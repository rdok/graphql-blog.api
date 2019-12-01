import createPost from '../factories/post'
import {gql} from 'apollo-boost'
import createUser from "../factories/user";

describe('Post', () => {
    test('should expose posts of user', async () => {
        const user = await createUser()
        const post1 = await createPost({published: false}, user)
        const post2 = await createPost({published: true}, user)
        const query = gql`query { posts { id published author { id } } }`

        const response = await global.httpClientFor(user).query({query})

        expect(response.data.posts).toEqual([
            {
                __typename: "Post",
                id: post1.id,
                published: false,
                author: {__typename: "User", id: user.id},
            },
            {
                __typename: "Post",
                id: post2.id,
                published: true,
                author: {__typename: "User", id: user.id},
            }
        ])
    })
})
