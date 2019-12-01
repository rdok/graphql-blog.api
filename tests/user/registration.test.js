import {gql} from "apollo-boost";
import prisma from "../../src/prisma";

describe('User Registration', () => {

    test('should allow user registration', async () => {
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

})