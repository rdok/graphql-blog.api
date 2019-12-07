import {createComment, createPost, createUser} from "../factories";
import {updateComment} from "../utils/operations";
import prisma from '../../src/prisma'

describe('Post', () => {
    test('should update a post', async () => {
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

    test('should not update a post not owned', async () => {
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
})