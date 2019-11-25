import Auth from '../../src/services/auth'

const auth = new Auth({prisma: null})

describe('Auth', () => {
    describe('isValidPassword', () => {
        test('valid password', () => {
            const password = auth.isValidPassword('1234567a')

            expect(password).toBeTruthy()
        })
        test('with less than 7 characters', () => {
            const password = auth.isValidPassword('a1')

            expect(password).toBeFalsy()
        })

        test('with no numbers', () => {
            const password = auth.isValidPassword('abcadfadfafd')

            expect(password).toBeFalsy()
        })
        test('with no letters', () => {
            const password = auth.isValidPassword('134123423134')

            expect(password).toBeFalsy()
        })
    })
})
