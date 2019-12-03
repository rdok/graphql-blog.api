import createPost from '../factories/post'
import {gql} from 'apollo-boost'
import createUser from "../factories/user";

const query = gql`query { posts { id title body published author { id } } }`

describe('Post', () => {
    test('should expose posts of user', async () => {
        const user = await createUser()
        const post1 = await createPost({published: false}, user)
        const post2 = await createPost({published: true}, user)
        const response = await global.httpClientFor(user).query({query})

        expect(response.data.posts).toEqual([
            {
                __typename: "Post",
                id: post1.id,
                published: false,
                body: post1.body,
                title: post1.title,
                author: {__typename: "User", id: user.id},
            },
            {
                __typename: "Post",
                id: post2.id,
                published: true,
                body: post2.body,
                title: post2.title,
                author: {__typename: "User", id: user.id},
            }
        ])
    })

    test('should expose published posts to guests', async () => {
        await createPost({published: false})
        const post2 = await createPost({published: true})

        // when i make a request to  create one
        const response = await global.httpClient.query({query})

        expect(response).toHaveProperty('data')
        expect(response.data).toHaveProperty('posts')

        const posts = response.data.posts

        expect(posts.length).toBe(1)
        expect(posts[0].published).toBeTruthy()
        expect(posts[0].id).toBe(post2.id)
    })
})
