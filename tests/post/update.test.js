import createPost from '../factories/post'
import createUser from "../factories/user";
import prisma from "../../src/prisma";
import faker from "faker";
import {subscribeToComments, subscribeToPosts, updateComment, updatePost} from "../utils/operations";
import {createComment} from "../factories";


describe('Post', () => {

    test('should update a post', async () => {
        const user = await createUser()
        const post = await createPost({published: false}, user)

        let data = {
            title: faker.lorem.words(),
            body: faker.lorem.sentence(),
            published: true,
        }

        const response = await global.client(user).mutate({
            mutation: updatePost,
            variables: {id: post.id, data: data}
        })

        data.id = post.id

        const expected = {data: {updatePost: {__typename: "Post", ...data}}}
        expect(response).toEqual(expected)

        const databaseUpdated = await prisma.exists.Post(data)
        expect(databaseUpdated).toBeTruthy()
    })

    test('should not update a post not owned', async () => {
        const user = await createUser()
        const post = await createPost({published: false})

        const variables = {id: post.id, data: {published: true}}

        let error
        try {
            await global.client(user).mutate({
                mutation: updatePost,
                variables
            })
        } catch (e) {
            error = e
        }

        const expected = `Could not find type 'posts' with 'id=${post.id}' and 'author.id=${user.id}`
        expect(error.graphQLErrors[0].message.id[0]).toEqual(expected)
    })

    test('should subscribe to updated post', async (done) => {
        const author = await createUser()
        const post = await createPost({published: true}, author)

        global.client()
            .subscribe({query: subscribeToPosts})
            .subscribe({
                next(response) {
                    expect(response.data.post.mutation).toBe('UPDATED')
                    expect(response.data.post.node.id).toBe(post.id)
                    done()
                }
            });

        // Wait for subscription connection
        // https://www.udemy.com/course/graphql-bootcamp/learn/lecture/11917840#questions/5989800
        setTimeout(async () => {
            try {
                await global.client(author).mutate({
                    mutation: updatePost,
                    variables: {id: post.id, data: {title: 'any-value'}}
                })
            } catch (e) {
                console.log(JSON.stringify(e))
            }
        }, 1000)
    })
})
