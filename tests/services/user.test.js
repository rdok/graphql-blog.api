import '@babel/polyfill'
import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import prisma from '../../src/prisma'

const client = new ApolloBoost({
    uri: 'http://api:' + (process.env.TEST_PORT || 4001)
})

beforeEach(async () => {
    await prisma.mutation.deleteManyUsers()
})

describe('User', () => {
    test('create new', async () => {
        const createUser = gql`
            mutation CreateUser {
                createUser(data: {
                    name:"expectedName"
                    email:"expected@email.test"
                    password:"cyberpunk2077"
                })
                {  user { id name email }  token }
            }
        `

        let user = await prisma.query.user({where: {email: 'expected@email.test'}})
        expect(user).toBeNull()

        const authPayload = await client.mutate({mutation: createUser})

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
