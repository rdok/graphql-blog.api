import {gql} from 'apollo-boost'
import createUser from "../factories/user";
import prisma from "../../src/prisma";
import createPost from "../factories/post";

describe('Post', () => {

    test('should delete a post', async () => {
        const user = await createUser()
        const post = await createPost(null, user)
        const mutation = gql`mutation { deletePost(id:"${post.id}") { id } }`

        let postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeTruthy()

        const response = await global.httpClientFor(user).mutate({mutation})

        expect(response).toEqual({
            data: {
                deletePost: {
                    __typename: "Post",
                    id: response.data.deletePost.id,
                }
            }
        })

        postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeFalsy()
    })

    test.skip('guests should delete a post', async () => {

    })

    test.skip('users should delete not owned post', async () => {

    })
})
