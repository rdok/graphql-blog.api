import prisma from '../../src/prisma'
import faker from 'faker'
import createPost from "./post";
import createUser from './user'

export default async function createComment(data, relations = {}) {
    const info = '{ id text author { id } post { id } }'
    const post = relations.post ? relations.post : await createPost()
    const user = relations.user ? relations.user : await createUser()

    data = Object.assign({
        text: faker.lorem.sentence(),
        post: {connect: {id: post.id}},
        author: {connect: {id: user.id}},
    }, data)

    return prisma.mutation.createComment({data}, info)
}
