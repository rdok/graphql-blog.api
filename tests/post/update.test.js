import createPost from '../factories/post'
import {gql} from 'apollo-boost'
import createUser from "../factories/user";
import prisma from "../../src/prisma";
import faker from "faker";

describe('Post', () => {

    test('should update a post', async () => {
        const user = await createUser()
        const post = await createPost({published: false}, user)

        const newData = {
            id: post.id,
            title: faker.lorem.words(),
            body: faker.lorem.sentence(),
            published: true,
        }

        const mutation = gql`
            mutation {
                updatePost(id:"${newData.id}" data:{
                    title:"${newData.title}"
                    body:"${newData.body}"
                    published:${newData.published}
                }) {
                    id title body published
                }
            }
        `

        const response = await global.httpClientFor(user).mutate({mutation})
        const expected = {data: {updatePost: {__typename: "Post", ...newData}}}
        expect(response).toEqual(expected)

        const databaseUpdated = await prisma.exists.Post(newData)
        expect(databaseUpdated).toBeTruthy()
    })

    test('should not update a post not owned', async () => {
        const user = await createUser()
        const post = await createPost({published: false})

        const mutation = gql`mutation {
            updatePost(id:"${post.id}" data:{ published:true }) { id }
        }`

        let error
        try {
            await global.httpClientFor(user).mutate({mutation})
        } catch (e) {
            error = e
        }

        const expected = `Could not find type 'posts' with 'id=${post.id}' and 'author.id=${user.id}`
        expect(error.graphQLErrors[0].message.id[0]).toEqual(expected)
    })
})
