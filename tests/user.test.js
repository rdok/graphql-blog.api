import ApolloBoost, {gql} from 'apollo-boost'
import prisma from '../src/prisma'
import createUser from "./factories/user";

describe('User', () => {
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

    test('should expose users public profile', async () => {
        const user1 = await createUser()
        const user2 = await createUser()
        const query = gql`query { users { name email } }`

        const response = await global.httpClient.query({query})

        expect(response).toHaveProperty('data')
        expect(response.data).toHaveProperty('users')
        expect(response.data.users.length).toBe(2)
        expect(response.data.users).toEqual([
            {"__typename": "User", name: user1.name, email: null},
            {"__typename": "User", name: user2.name, email: null},
        ])
    })

    test('it should guard against invalid login attempts', async () => {
        const mutation = gql`mutation {
            login(data: {email:"invalid" password: "invalid"})
            { user { id } token }
        }`

        await expect(
            global.httpClient.mutate({mutation})
        ).rejects.toThrow('GraphQL error')
    })

    test('it should login', async () => {
        const user = await createUser({password: 'cyberpunk2077'})
        const mutation = gql`mutation {
            login(data: {email:"${user.email}" password: "cyberpunk2077"})
            { token }
        }`

        const response = await global.httpClient.mutate({mutation})

        expect(response).toHaveProperty('data')
        expect(response.data).toHaveProperty('login')
        expect(response.data.login).toHaveProperty('token')
    })
})
