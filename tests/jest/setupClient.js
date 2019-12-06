import '@babel/polyfill'
import 'cross-fetch/polyfill'
import ApolloBoost from "apollo-boost";
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient} from 'apollo-client'
import {WebSocketLink} from 'apollo-link-ws'

const port = process.env.TEST_PORT || 4001
const uri = 'http://api:' + port + '/graphql'
const wsUri = 'ws://api:' + port + '/subscriptions'

global.httpClient = new ApolloBoost({uri})

const webSocketLink = new WebSocketLink({
    uri: wsUri,
    options: {reconnect: true},
});

global.subscription = new ApolloClient({
    link: webSocketLink,
    cache: new InMemoryCache()
});

// global.httpClientFor = function (user) {
//     const token = user.token
//
//     return new ApolloBoost({
//         uri,
//         request(operation) {
//             operation.setContext({headers: {Authorization: `Bearer ${token}`}})
//         }
//     })
// }
//
