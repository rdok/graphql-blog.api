import createPost from './factories/post'
import {gql} from 'apollo-boost'

describe('Post', () => {
    test('a guest may view posts', async () => {
        const post1 = await createPost({published: false})
        const post2 = await createPost({published: true})

        const query = gql`
            query {
                posts { id title body published author { id }}
            }
        `

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