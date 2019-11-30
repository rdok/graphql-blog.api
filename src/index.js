import '@babel/polyfill/noConflict'
import server from './server'

const options = {
    port: process.env.VIRTUAL_PORT || 4000,
    playground: '/',
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
}

server.start(
    options,
    ({port}) => console.log(`Playground http://localhost:${port}/`)
)
