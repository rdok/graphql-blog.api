import '@babel/polyfill'

const server = require('../../src/server.js').default
const options = {
    port: process.env.TEST_PORT || 4001,
    playground: '/',
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
}

module.exports = async () => {
    global.httpServer = await server.start(options, ({port}) => {
        console.log(`\nOpening test server at http://api:${port}/`)
    })
}
