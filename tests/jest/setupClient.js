import '@babel/polyfill'
import 'cross-fetch/polyfill'
import ApolloBoost, {HttpLink} from "apollo-boost";
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient} from 'apollo-client'
import {WebSocketLink} from 'apollo-link-ws'
import {ApolloLink, Observable} from 'apollo-link'
import {getMainDefinition} from 'apollo-utilities'
import {onError} from "apollo-link-error";

const PORT = process.env.TEST_PORT || 4001
const HTTP_URI = 'http://api:' + PORT + '/graphql'
const WEB_SOCKET_URI = 'ws://api:' + PORT + '/subscriptions'

global.client = (user) => {
    const request = async (operation) => {
        if (user && user.token) {
            const headers = {Authorization: `Bearer ${user.token}`}
            operation.setContext({headers})
        }
    }

    const httpRequestLink = new ApolloLink((operation, forward) => {
        return new Observable((observer => {
            let handle
            Promise.resolve(operation)
                .then((oper) => {
                    request(oper)
                })
                .then(() => {
                    handle = forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer)
                    })
                })
                .catch(observer.error.bind(observer))

            return () => {
                if (handle) {
                    handle.unsubscribe()
                }
            }
        }))
    })

    const wsLink = ApolloLink.from([
        onError(({graphQLErrors, networkError}) => {
            printError(graphQLErrors)

            if (networkError) {
                console.log(`[Network error]: ${networkError}`)
            }
        }),
        httpRequestLink,
        new WebSocketLink({
            uri: WEB_SOCKET_URI,
            options: {
                reconnect: true,
                connectionParams: () => {
                    if (user && user.token) {
                        return {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                }
            }
        })
    ])

    const httpLink = ApolloLink.from([
        onError(({graphQLErrors, networkError}) => {
            printError(graphQLErrors)

            if (networkError) {
                console.log(`[Network error]: ${networkError}`)
            }
        }),
        httpRequestLink,
        new HttpLink({
            uri: HTTP_URI,
            credentials: 'include'
        })
    ])

    const link = ApolloLink.split(({query}) => {
        const {kind, operation} = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    }, wsLink, httpLink)

    return new ApolloClient({link, cache: new InMemoryCache()})
}

function printError(graphQLErrors) {
    if (!graphQLErrors) {
        return
    }

    graphQLErrors.map(({message, locations, path}) => {
        let error = `[GraphQL error]: `
        error += `Message ${JSON.stringify(message)}, `
        error += `Location: ${JSON.stringify(locations)},`
        error += `Path: ${JSON.stringify(path)}`
        console.log(error)
    })
}
