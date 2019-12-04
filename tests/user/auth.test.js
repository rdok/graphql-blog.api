import createUser from "../factories/user";
import Auth from '../../src/services/auth'
import {login} from '../utils/operations'

const auth = new Auth({prisma: null})

describe('User Auth', () => {
    test('it should guard against invalid login attempts', async () => {
        const password = 'invalid-password'
        const user = await createUser()

        let error
        const variables = {data: {email: user.email, password}}

        try {
            await global.httpClient.mutate({mutation: login, variables});
        } catch (e) {
            error = e
        }

        expect(error).toHaveProperty('graphQLErrors')
        expect(error.graphQLErrors.length).toBe(1)
        expect(error.graphQLErrors[0]).toHaveProperty('message')
        expect(error.graphQLErrors[0].message).toEqual('Invalid password.')
    })

    test('it should login', async () => {
        const password = 'secret2077'
        const user = await createUser({password})
        const variables = {data: {email: user.email, password}}

        const response = await global.httpClient
            .mutate({mutation: login, variables})

        expect(response).toHaveProperty('data')
        expect(response.data).toHaveProperty('login')
        expect(response.data.login).toHaveProperty('token')
    })
})

describe('isValidPassword', () => {
    test('valid password', () => {
        expect(auth.isValidPassword('1234567a')).toBeFalsy()
    })
    test('with less than 7 characters', () => {
        expect(auth.isValidPassword('a1')).toBeFalsy()
    })
    test('with no numbers', () => {
        expect(auth.isValidPassword('abcadfadfafd')).toBeFalsy()
    })
    test('with no letters', () => {
        expect(auth.isValidPassword('134123423134')).toBeFalsy()
    })
    test('disallow common insecure passwords', () => {
        expect(auth.isValidPassword('a123456b')).toBeFalsy()
        expect(auth.isValidPassword('a123qwerty456b')).toBeFalsy()
        expect(auth.isValidPassword('____abc123____')).toBeFalsy()
        expect(auth.isValidPassword('a1___password___z4')).toBeFalsy()
    })
})
