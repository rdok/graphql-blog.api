import createPost from '../factories/post'
import createUser from "../factories/user";
import {posts} from '../utils/operations'

describe('Post', () => {
    test('should expose posts of user', async () => {
        const user = await createUser()
        const post1 = await createPost({published: false}, user)
        const post2 = await createPost({published: true}, user)
        const response = await global.httpClientFor(user)
            .query({query: posts})

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
        const response = await global.httpClient.query({query: posts})

        expect(response).toHaveProperty('data')
        expect(response.data).toHaveProperty('posts')

        const expectedPosts = response.data.posts

        expect(expectedPosts.length).toBe(1)
        expect(expectedPosts[0].published).toBeTruthy()
        expect(expectedPosts[0].id).toBe(post2.id)
    })
})
