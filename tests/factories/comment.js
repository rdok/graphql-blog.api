import prisma from '../../src/prisma'
import faker from 'faker'
import createPost from "./post";
import createUser from './user'

export default async function createComment(data, relations = {}) {
    const info = '{ id text author { id } post { id } }'
    const author = relations.author ? relations.author : await createUser()
    const post = relations.post
        ? relations.post : await createPost(null, author)

    data = Object.assign({
        text: faker.lorem.sentence(),
        post: {connect: {id: post.id}},
        author: {connect: {id: author.id}},
    }, data)

    return await prisma.mutation.createComment({data}, info)
}
