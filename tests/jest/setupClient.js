import '@babel/polyfill'
import 'cross-fetch/polyfill'
import ApolloBoost from "apollo-boost";

const uri = 'http://api:' + (process.env.TEST_PORT || 4001) + '/graphql'

global.httpClient = new ApolloBoost({uri})

global.httpClientFor = function (user) {
    const token = user.token

    return new ApolloBoost({
        uri,
        request(operation) {
            operation.setContext({headers: {Authorization: `Bearer ${token}`}})
        }
    })
}

