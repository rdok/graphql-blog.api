import prisma from "../../src/prisma";
import createUser from "../factories/user";
import {createUser as createUserMutation} from '../utils/operations'

describe('User Registration', () => {

    test('should allow valid registration', async () => {
        const variables = {
            data: {
                name: "expectedName",
                email: "expected@email.test",
                password: "cyberpunk2077",
            }
        }

        let user = await prisma.query.user({where: {email: 'expected@email.test'}})
        expect(user).toBeNull()

        const response = await global.client()
            .mutate({mutation: createUserMutation, variables})

        expect(response).toHaveProperty('data')
        expect(response.data).toHaveProperty('createUser')
        expect(response.data.createUser).toHaveProperty('user')
        expect(response.data.createUser).toHaveProperty('token')

        user = await prisma.query.user(
            {where: {email: variables.data.email}},
            '{ email name }'
        )

        expect(user).toEqual({
            name: variables.data.name,
            email: variables.data.email,
        })
    })

    test('should not allow invalid registration', async () => {
        const variables = {
            data: {
                name: "any-name",
                email: "invalid-email",
                password: "invpas",
            }
        }

        let error
        try {
            await global.client()
                .mutate({mutation: createUserMutation, variables})
        } catch (e) {
            error = e
        }

        expect(error.graphQLErrors.length).toBe(1)
        const validationError = error.graphQLErrors[0]

        expect(validationError).toHaveProperty('message')
        expect(validationError.message).toHaveProperty('email')
        expect(validationError.message.email[0]).toBe("The selected email 'invalid-email' is not an email.")
        expect(validationError.message).toHaveProperty('password')
        expect(validationError.message.password[0]).toBe("This field value must be of minimum length '7'.")
    })

    test('should not allow registration with existing email', async () => {
        const user = await createUser()
        const variables = {
            data: {
                name: "any-name",
                email: user.email,
                password: "cyberpunk2077"
            }
        }

        let error
        try {
            await global.client()
                .mutate({mutation: createUserMutation, variables})
        } catch (e) {
            error = e
        }

        expect(error.graphQLErrors.length).toBe(1)
        const validationError = error.graphQLErrors[0]

        expect(validationError).toHaveProperty('message')
        expect(validationError.message).toHaveProperty('email')
        expect(validationError.message.email[0]).toBe("The selected value is taken.")
    })
})