import {comments} from '../utils/operations'
import createComment from "../factories/comment";

describe('Comment', () => {
    test('guests may read comments', async () => {
        const comment1 = await createComment()
        const comment2 = await createComment()

        const response = await global.client().query({query: comments})

        expect(response.data.comments).toEqual([
            {
                __typename: "Comment",
                id: comment1.id,
                text: comment1.text,
                author: {__typename: "User", id: comment1.author.id},
                post: {__typename: "Post", id: comment1.post.id},
            },
            {
                __typename: "Comment",
                id: comment2.id,
                text: comment2.text,
                author: {__typename: "User", id: comment2.author.id},
                post: {__typename: "Post", id: comment2.post.id},
            }
        ])
    })
})