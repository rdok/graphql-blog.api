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

    test('guests should not delete a post', async () => {
        const post = await createPost()
        const mutation = gql`mutation { deletePost(id:"${post.id}") { id } }`

        let postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeTruthy()

        let error
        try {
            await global.httpClient.mutate({mutation})
        } catch (e) {
            error = e
        }

        const expected = `This field is required and cannot be empty.`
        expect(error.graphQLErrors[0].message.authorization[0]).toEqual(expected)

        postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeTruthy()
    })

    test('users should not delete others post', async () => {
        const user = await createUser()
        const post = await createPost()
        const mutation = gql`mutation { deletePost(id:"${post.id}") { id } }`

        let postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeTruthy()

        let error
        try {
            await global.httpClientFor(user).mutate({mutation})
        } catch (e) {
            error = e
        }

        const expected = `Could not find type 'posts' with 'id=${post.id}' and 'author.id=${user.id}`
        expect(error.graphQLErrors[0].message.id[0]).toEqual(expected)

        postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeTruthy()
    })
})
