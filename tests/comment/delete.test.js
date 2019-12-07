import {deleteComment, subscribeToComments} from '../utils/operations'
import createComment from "../factories/comment";
import createUser from "../factories/user";
import prisma from "../../src/prisma";
import {createPost} from "../factories";

describe('Comment', () => {
    test('should delete own comment', async () => {
        const user = await createUser()
        const comment = await createComment(null, {author: user})

        let commentExists = await prisma.exists.Comment({id: comment.id})
        expect(commentExists).toBeTruthy()

        const response = await global.client(user)
            .mutate({mutation: deleteComment, variables: {id: comment.id}})

        expect(response).toEqual({
            data: {deleteComment: {__typename: "Comment", id: comment.id,}}
        })

        commentExists = await prisma.exists.Post({id: comment.id})
        expect(commentExists).toBeFalsy()
    })

    test('guard against deleting others comments', async () => {
        const user = await createUser()
        const comment = await createComment()

        let commentExists = await prisma.exists.Comment({id: comment.id})
        expect(commentExists).toBeTruthy()

        let error
        try {
            await global.client(user)
                .mutate({mutation: deleteComment, variables: {id: comment.id}})
        } catch (e) {
            error = e
        }

        const expected = `Could not find type 'comments' with 'id=${comment.id}' and 'author.id=${user.id}`
        expect(error.graphQLErrors[0].message.id[0]).toEqual(expected)

        commentExists = await prisma.exists.Comment({id: comment.id})
        expect(commentExists).toBeTruthy()
    })

    test('should subscribe to deleted comments', async (done) => {
        const post = await createPost()
        const variables = {postId: post.id}
        const comment = await createComment(null, {post})

        global.client()
            .subscribe({query: subscribeToComments, variables})
            .subscribe({
                next(response) {
                    expect(response.data.comment.mutation).toBe('DELETED')
                    done()
                }
            });

        setTimeout(async () => {
            await prisma.mutation.deleteComment({where: {id: comment.id}})
        }, 1000)
    })
})