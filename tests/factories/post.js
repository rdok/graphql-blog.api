import prisma from '../../src/prisma'
import faker from 'faker'
import createUser from "./user";

export default async function createPost(data = {}, author = null) {
    const info = '{ id title body published author { id } }'

    if (!author) {
        author = await createUser()
    }

    const factoryData = {
        title: faker.lorem.words(),
        body: faker.lorem.sentence(),
        published: faker.random.boolean(),
        author: {connect: {id: author.id}}
    }

    data = Object.assign(factoryData, data)

    return prisma.mutation.createPost({data}, info)
}
