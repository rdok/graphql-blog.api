import createUser from "../factories/user";
import prisma from "../../src/prisma";
import faker from "faker";
import {createPost, subscribeToComments, subscribeToPosts} from "../utils/operations";
import {createPost as createPostFactory} from "../factories";

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

    test('should subscribe to new published post', async (done) => {
        let post
        global.client()
            .subscribe({query: subscribeToPosts})
            .subscribe({
                next(response) {
                    expect(response.data.post.mutation).toBe('CREATED')
                    expect(response.data.post.node.id).toBe(post.id)
                    done()
                }
            });

        // Wait for subscription connection
        // https://www.udemy.com/course/graphql-bootcamp/learn/lecture/11917840#questions/5989800
        setTimeout(async () => {
            // assert un-published posts do not generate event
            await createPostFactory({published: false})
            post = await createPostFactory()
        }, 300)
    })
})
