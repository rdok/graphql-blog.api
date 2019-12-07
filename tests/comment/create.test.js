import prisma from "../../src/prisma";
import {
    createComment as createCommentOperation,
    subscribeToComments
} from "../utils/operations";
import {createPost, createUser, createComment} from "../factories";

describe('Comment', () => {

    test('should not create comment if not logged in', async () => {
        const post = await createPost({published: true})
        const variables = {data: {post: post.id, text: 'comment-text'}}

        let error
        try {
            await global.client().mutate({
                mutation: createCommentOperation,
                variables
            })
        } catch (e) {
            error = e
        }

        const expected = `This field is required and cannot be empty.`
        expect(error.graphQLErrors[0].message.authorization[0]).toEqual(expected)
    })

    test('should create a comment', async () => {
        const user = await createUser()
        const post = await createPost({published: true})
        const variables = {data: {post: post.id, text: 'comment-text'}}

        const response = await global.client(user).mutate({
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

    test('should subscribe to new comments', async (done) => {
        const post = await createPost()
        const variables = {postId: post.id}

        global.client()
            .subscribe({query: subscribeToComments, variables})
            .subscribe({
                next(response) {
                    expect(response.data.comment.mutation).toBe('CREATED')
                    expect(response.data.comment.node.post.id).toBe(post.id)
                    done()
                }
            });

        // Wait for subscription connection
        // https://www.udemy.com/course/graphql-bootcamp/learn/lecture/11917840#questions/5989800
        setTimeout(async () => {
            await createComment() // assert does not listens to different post
            await createComment(null, {post})
        }, 1000)
    })
})
