import createUser from "../factories/user";
import {users, loggedInUser} from '../utils/operations'

describe('User Profile', () => {
    test('should expose users public profile', async () => {
        const user1 = await createUser()
        const user2 = await createUser()

        const response = await global.client().query({query: users})

        expect(response).toHaveProperty('data')
        expect(response.data).toHaveProperty('users')
        expect(response.data.users.length).toBe(2)
        expect(response.data.users).toEqual([
            {"__typename": "User", email: null, name: user1.name,},
            {"__typename": "User", email: null, name: user2.name,},
        ])
    })

    test('should fetch private user profile', async () => {
        const user = await createUser()
        const response = await global.client(user)
            .query({query: loggedInUser})

        expect(response.data.loggedInUser).toEqual({
            __typename: "User",
            id: user.id,
            name: user.name,
            email: user.email,
        })
    })
})
