import prisma from '../../src/prisma'
import bcrypt from 'bcryptjs'
import faker from 'faker'

export default function createUser(data) {
    const factoryData = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('cyberpunk2077')
    }

    if (typeof data === "object" && data.hasOwnProperty('password')) {
        data.password = bcrypt.hashSync(data.password)
    }

    data = Object.assign(factoryData, data)

    return prisma.mutation.createUser({data})
}
