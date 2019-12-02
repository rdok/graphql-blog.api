import createPost from '../factories/post'
import {gql} from 'apollo-boost'
import createUser from "../factories/user";
import prisma from "../../src/prisma";
import faker from "faker";

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

    test('should update a post', async () => {
        const user = await createUser()
        const post = await createPost({published: false}, user)

        const newData = {
            id: post.id,
            title: faker.lorem.words(),
            body: faker.lorem.sentence(),
            published: true,
        }

        const mutation = gql`
            mutation {
                updatePost(id:"${newData.id}" data:{
                    title:"${newData.title}"
                    body:"${newData.body}"
                    published:${newData.published}
                }) {
                    id title body published
                }
            }
        `

        const response = await global.httpClientFor(user).mutate({mutation})
        expect(response).toEqual({
            data: {
                updatePost: {
                    __typename: "Post",
                    ...newData
                }
            }
        })

        const databaseUpdated = await prisma.exists.Post(newData)
        expect(databaseUpdated).toBeTruthy()
    })

    test.skip('should not update a post not owned', () => {

    })
})
