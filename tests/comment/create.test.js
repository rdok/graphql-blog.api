import createUser from "../factories/user";
import prisma from "../../src/prisma";
import createPost from "../factories/post";
import faker from "faker";
import {createComment as createCommentOperation} from "../utils/operations";

describe('Comemnt', () => {

    test('should create a comment', async () => {
        const user = await createUser()
        const post = await createPost({published: true})
        const variables = {data: {post: post.id, text: 'comment-text'}}

        const response = await global.httpClientFor(user).mutate({
            mutation: createCommentOperation,
            variables
        })

        expect(response).toEqual({
            data: {
                createComment: {
                    id: response.data.createComment.id,
                    __typename: "Comment",
                    text: variables.data.text,
                    author: {__typename: "User", id: user.id},
                    post: {__typename: "Post", id: post.id},
                }
            }
        })

        const commentCreated = await prisma.exists.Comment({
            id: response.data.createComment.id,
            text: variables.data.text,
            post: {id: post.id},
            author: {id: user.id}
        })

        expect(commentCreated).toBeTruthy()
    })
})
