import prisma from "../../src/prisma";
import {
    createComment as createCommentOperation,
    subscribeToComments
} from "../utils/operations";
import {createPost, createUser} from "../factories";

describe('Comemnt', () => {

    // test('should create a comment', async () => {
    //     const user = await createUser()
    //     const post = await createPost({published: true})
    //     const variables = {data: {post: post.id, text: 'comment-text'}}
    //
    //     const response = await global.httpClientFor(user).mutate({
    //         mutation: createCommentOperation,
    //         variables
    //     })
    //
    //     expect(response).toEqual({
    //         data: {
    //             createComment: {
    //                 id: response.data.createComment.id,
    //                 __typename: "Comment",
    //                 text: variables.data.text,
    //                 author: {__typename: "User", id: user.id},
    //                 post: {__typename: "Post", id: post.id},
    //             }
    //         }
    //     })
    //
    //     const commentCreated = await prisma.exists.Comment({
    //         id: response.data.createComment.id,
    //         text: variables.data.text,
    //         post: {id: post.id},
    //         author: {id: user.id}
    //     })
    //
    //     expect(commentCreated).toBeTruthy()
    // })

    test('should subscribe to new comments', async (done) => {
        try {
            await global.subscription.subscribe({query: subscribeToComments})
                .subscribe({
                    async next(response) {
                        console.log(response)
                        expect(1).toBe(2)
                        await done()
                    }
                })
        } catch (e) {
            console.log(e)
        }
    })
})
