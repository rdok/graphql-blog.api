import createUser from "../factories/user";
import prisma from "../../src/prisma";
import createPost from "../factories/post";
import {deletePost, subscribeToPosts} from "../utils/operations";

describe('Post', () => {

    test('should delete a post', async () => {
        const user = await createUser()
        const post = await createPost(null, user)

        let postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeTruthy()

        const response = await global.client(user)
            .mutate({mutation: deletePost, variables: {id: post.id}})

        expect(response).toEqual({
            data: {deletePost: {__typename: "Post", id: post.id,}}
        })

        postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeFalsy()
    })

    test('guests should not delete a post', async () => {
        const post = await createPost()

        let postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeTruthy()

        let error
        try {
            await global.client()
                .mutate({mutation: deletePost, variables: {id: post.id}})
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

        let postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeTruthy()

        let error
        try {
            await global.client(user)
                .mutate({mutation: deletePost, variables: {id: post.id}})
        } catch (e) {
            error = e
        }

        const expected = `Could not find type 'posts' with 'id=${post.id}' and 'author.id=${user.id}`
        expect(error.graphQLErrors[0].message.id[0]).toEqual(expected)

        postExists = await prisma.exists.Post({id: post.id})
        expect(postExists).toBeTruthy()
    })

    test('should subscribe to deleted posts', async (done) => {
        const post = await createPost()

        global.client()
            .subscribe({query: subscribeToPosts})
            .subscribe({
                next(response) {
                    expect(response.data.post.mutation).toBe('DELETED')
                    done()
                }
            });

        setTimeout(async () => {
            await prisma.mutation.deletePost({where: {id: post.id}})
        }, 1000)
    })
})
