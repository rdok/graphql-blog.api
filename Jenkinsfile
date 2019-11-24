pipeline {
    agent { label 'linux' }
    triggers { cron('H H(18-19) * * *') }
    options { buildDiscarder( logRotator( numToKeepStr: '5' ) ) }
    environment {
        VIRTUAL_HOST = 'api.graphql-blog.rdok.dev'
        VIRTUAL_PORT = '3007'
        LETSENCRYPT_HOST = 'api.graphql-blog.rdok.dev'
        LETSENCRYPT_EMAIL = credentials('rdok-email')
        DEFAULT_EMAIL = credentials('rdok-email')
        COMPOSE_PROJECT_NAME = 'graphql-blog-api'
        NODE_ENV = 'production'
        JWT_AUTH_SECRET = credentials('jwt-auth-secret')
        PRISMA_ENDPOINT = credentials('prisma-endpoint')
        PRISMA_SECRET = credentials('prisma-token')
    }
    stages {
        stage('Test') {
           steps { ansiColor('xterm') {
              sh '''#!/bin/bash
                  ./docker/test.sh dev
              '''
        } } }
        stage('Build & Deploy') {
           agent { label "rdok.dev" }
           steps { ansiColor('xterm') {
              sh '''#!/bin/bash
                ./docker/build-production.sh
                ./docker/up-production.sh
              '''
        } } }
        stage('Health Check') { steps { build 'api-health-check' } }
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
