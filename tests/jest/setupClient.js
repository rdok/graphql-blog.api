import '@babel/polyfill'
import 'cross-fetch/polyfill'
import ApolloBoost from "apollo-boost";

global.httpClient = new ApolloBoost({
    uri: 'http://api:' + (process.env.TEST_PORT || 4001)
})

