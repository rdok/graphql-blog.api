import {gql} from "apollo-boost";
import prisma from "../../src/prisma";
import createUser from "../factories/user";

describe('User Registration', () => {

    test('should allow valid registration', async () => {
        const createUser = gql` mutation CreateUser {
            createUser(data: {
                name: "expectedName"
                email: "expected@email.test"
                password: "cyberpunk2077"
            })
            {  user { id name email }  token }
        } `

        let user = await prisma.query.user({where: {email: 'expected@email.test'}})
        expect(user).toBeNull()

        const response = await global.httpClient.mutate({mutation: createUser})
        expect(response).toHaveProperty('data')
        expect(response.data).toHaveProperty('createUser')
        expect(response.data.createUser).toHaveProperty('user')
        expect(response.data.createUser).toHaveProperty('token')

        user = await prisma.query.user(
            {where: {email: 'expected@email.test'}},
            '{ email name }'
        )

        expect(user).toEqual({
            name: "expectedName",
            email: "expected@email.test",
        })
    })

    test('should not allow invalid registration', async () => {
        const mutation = gql` mutation CreateUser {
            createUser(data: {
                name: "expectedName"
                email: "invalid-email"
                password: "invpas"
            })
            {  user { id name email }  token }
        } `

        let error
        try {
            await global.httpClient.mutate({mutation})
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

        const mutation = gql` mutation CreateUser {
            createUser(data: {
                name: "expectedName"
                email: "${user.email}"
                password: "cyberpunk2077"
            })
            {  user { id name email }  token }
        } `

        let error
        try {
            await global.httpClient.mutate({mutation})
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