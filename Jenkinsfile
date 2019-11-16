pipeline {
    agent { label 'rdok.dev' }
    triggers { cron('H H(18-19) * * *') }
    options { buildDiscarder( logRotator( numToKeepStr: '5' ) ) }
    environment {
        VIRTUAL_HOST = 'api.graphql-blog.rdok.dev'
        VIRTUAL_PORT = '3007'
        LETSENCRYPT_HOST = 'api.graphql-blog.rdok.dev'
        LETSENCRYPT_EMAIL = credentials('rdok-email')
        DEFAULT_EMAIL = credentials('rdok-email')
        COMPOSE_PROJECT_NAME = 'graphql-blog-api'
        POSTGRES_PASSWORD = credentials('database-password')
        ENV = 'production'
    }
    stages {
        stage('Deploy') { 
           steps { ansiColor('xterm') {
              sh '''#!/bin/bash
                ./docker/up.sh production
              '''
        } } }
        stage('Health Check') { 
            agent { label "linux" }
            steps { build 'api-health-check' }
        } 
    }
    post {
        failure {
            slackSend color: '#FF0000',
            message: "@here Failed: <${env.BUILD_URL}console | ${env.JOB_NAME}#${env.BUILD_NUMBER}>"
        }
        fixed {
            slackSend color: 'good',
            message: "@here Fixed: <${env.BUILD_URL}console | ${env.JOB_NAME}#${env.BUILD_NUMBER}>"
        }
        success {
            slackSend message: "Stable: <${env.BUILD_URL}console | ${env.JOB_NAME}#${env.BUILD_NUMBER}>"
        }
    }
}
