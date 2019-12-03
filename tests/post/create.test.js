import {gql} from 'apollo-boost'
import createUser from "../factories/user";
import prisma from "../../src/prisma";
import faker from "faker";

describe('Post', () => {

    test('should create a post', async () => {
        const user = await createUser()

        const data = {
            title: faker.lorem.words(),
            body: faker.lorem.sentence(),
            published: true,
        }

        const mutation = gql`
            mutation {
                createPost(data:{
                    title:"${data.title}"
                    body:"${data.body}"
                    published:${data.published}
                })
                { id title body published author { id } }
            }
        `

        const response = await global.httpClientFor(user).mutate({mutation})

        expect(response).toEqual({
            data: {
                createPost: {
                    __typename: "Post",
                    id: response.data.createPost.id,
                    ...data,
                    author: {__typename: "User", id: user.id},
                }
            }
        })

        const postCreated = await prisma.exists.Post({
            ...data,
            author: {id: user.id}
        })

        expect(postCreated).toBeTruthy()
    })
})
