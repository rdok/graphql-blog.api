import Auth from '../../src/services/auth'

const auth = new Auth({prisma: null})

describe('Auth', () => {
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
})
