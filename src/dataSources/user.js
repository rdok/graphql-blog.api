import {Prisma} from "prisma-binding";
import Validator from '../validator/index'

export default class UserAPI {

    /** @type Prisma prisma */
    prisma
    /** @type Validator validator */
    validator

    constructor({prisma, validator}) {
        this.prisma = prisma
        this.validator = validator
    }

    create = async (data, info) => {
        const emailTaken = await this.prisma.exists.User({email: data.email})

        return emailTaken ?
            throw new Error('Email has been taken.')
            : await this.prisma.mutation.createUser({
                data: {...data}, info
            })
    }

    update = async (id, data, info) => {

        await this.validator.validate({id, ...data}, {
            email: `email|unique:user,email,except,id,${id}`,
        })

        return await this.prisma.mutation.updateUser({
            where: {id: id},
            data: {...data}
        }, info)
    }

    delete = async (id, info) => {
        const userExists = await this.prisma.exists.User({id: id})

        if (!userExists) {
            throw new Error(`User id ${id} does not exists.`)
        }

        return this.prisma.mutation.deleteUser({where: {id: id}}, info)
    }

    findByEmail = async (email, info) => {
        const user = await this.prisma.query.user({where: {email: email}}, info)

        return user === null ?
            throw new Error(`User with ${email} does not exists.`)
            : user
    }

    all = (query, info) => {
        if (!query) {
            return this.prisma.query.users(null, info)
        }

        return this.prisma.users.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase())
        })
    }

    find = (id) => {
        return this.prisma.users.find((user) => {
            return user.id === id
        })
    }

    findOrFail = (id) => {
        const user = this.prisma.users.find((user) => {
            return user.id === id
        })
        if (!user) {
            throw new Error(`The user id '${id}' is invalid.`)
        }
        return user
    }
}