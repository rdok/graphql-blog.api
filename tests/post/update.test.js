import createPost from '../factories/post'
import createUser from "../factories/user";
import prisma from "../../src/prisma";
import faker from "faker";
import {updatePost} from "../utils/operations";


describe('Post', () => {

    test('should update a post', async () => {
        const user = await createUser()
        const post = await createPost({published: false}, user)

        let data = {
            title: faker.lorem.words(),
            body: faker.lorem.sentence(),
            published: true,
        }

        const response = await global.httpClientFor(user).mutate({
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
            await global.httpClientFor(user).mutate({
                mutation: updatePost,
                variables
            })
        } catch (e) {
            error = e
        }

        const expected = `Could not find type 'posts' with 'id=${post.id}' and 'author.id=${user.id}`
        expect(error.graphQLErrors[0].message.id[0]).toEqual(expected)
    })
})
