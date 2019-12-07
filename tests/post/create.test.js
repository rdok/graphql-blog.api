import createUser from "../factories/user";
import prisma from "../../src/prisma";
import faker from "faker";
import {createPost} from "../utils/operations";

describe('Post', () => {

    test('should create a post', async () => {
        const user = await createUser()

        const data = {
            title: faker.lorem.words(),
            body: faker.lorem.sentence(),
            published: true,
        }

        const response = await global.client(user)
            .mutate({mutation: createPost, variables: {data: data}})

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
