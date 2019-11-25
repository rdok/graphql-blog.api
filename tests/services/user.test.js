import {getFirstName} from '../../src/services/user'

describe('User', () => {
    describe('getFirstName', () => {
        test('given first and last name', () => {
            const firstName = getFirstName('Neil Armstrong')

            expect(firstName).toBe('Neil')
        })

        test('given just the first name', () => {
            const firstName = getFirstName('Bob')

            expect(firstName).toBe('Bob')

        })
    })
})
