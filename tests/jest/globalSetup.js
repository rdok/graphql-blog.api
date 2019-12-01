import '@babel/polyfill'

const server = require('../../src/server.js').default

module.exports = async (config) => {
    global.httpServer = await server.start({
        port: process.env.TEST_PORT || 4001,
    })
}