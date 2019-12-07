import {createComment, createPost, createUser} from "../factories";
import {subscribeToComments, updateComment} from "../utils/operations";
import prisma from '../../src/prisma'

describe('Comment', () => {
    test('should update a comment', async () => {
        const author = await createUser()
        const comment = await createComment(null, {author})

        const response = await global.client(author).mutate({
            mutation: updateComment,
            variables: {id: comment.id, data: {text: 'expected-text-value'}}
        })

        expect(response.data.updateComment).toEqual({
            __typename: 'Comment',
            id: comment.id,
            text: 'expected-text-value',
            author: {__typename: 'User', id: author.id},
            post: {__typename: 'Post', id: comment.post.id},
        })

        const commentUpdated = await prisma.exists.Comment({
            id: comment.id,
            text: 'expected-text-value',
        })

        expect(commentUpdated).toBeTruthy()
    })

    test('should not update a comment not owned', async () => {
        const author = await createUser()
        const comment = await createComment()

        let error
        try {
            await global.client(author).mutate({
                mutation: updateComment,
                variables: {id: comment.id, data: {text: 'any-value'}}
            })
        } catch (e) {
            error = e
        }

        const expected = `Could not find type 'comments' with `
            + `'id=${comment.id}' and 'author.id=${author.id}`
        expect(error.graphQLErrors[0].message.id[0]).toEqual(expected)
    })

    test('should subscribe to updated comment', async (done) => {
        const author = await createUser()
        const comment = await createComment(null, {author})
        const variables = {postId: comment.post.id}

        global.client()
            .subscribe({query: subscribeToComments, variables})
            .subscribe({
                next(response) {
                    expect(response.data.comment.mutation).toBe('UPDATED')
                    expect(response.data.comment.node.post.id)
                        .toBe(comment.post.id)
                    done()
                }
            });

        // Wait for subscription connection
        // https://www.udemy.com/course/graphql-bootcamp/learn/lecture/11917840#questions/5989800
        setTimeout(async () => {
            await global.client(author).mutate({
                mutation: updateComment,
                variables: {id: comment.id, data: {text: 'any-value'}}
            })
        }, 1000)
    })
})