import prisma from '../../src/prisma'
import bcrypt from 'bcryptjs'
import faker from 'faker'
import Auth from "../../src/services/auth";

export default async function createUser(data) {
    const factoryData = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('cyberpunk2077')
    }

    if (typeof data === "object" && data.hasOwnProperty('password')) {
        data.password = bcrypt.hashSync(data.password)
    }

    data = Object.assign(factoryData, data)

    const user = await prisma.mutation.createUser({data})

    const auth = new Auth({prisma, validator: {}})
    user.token = auth.generateAuthPayload(null, user).token

    return user
}
