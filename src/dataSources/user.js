import {Prisma} from "prisma-binding";
import Validator from '../validator/index'
import bcryptjs from 'bcryptjs'

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
        await this.validator.validate(data, {
            email: 'required|email|unique:user,email',
            password: 'required|min:7'
        })

        data.password = await bcryptjs.hash(data.password, 10)

        return this.prisma.mutation.createUser({
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
        await this.validator.validate({id}, {
            id: 'required|exists:User,id',
        })

        return this.prisma.mutation.deleteUser({where: {id: id}}, info)
    }

    findByEmail = async (email, info) => {
        const user = await this.prisma.query.user({where: {email: email}}, info)

        return user === null ?
            throw new Error(`User with ${email} does not exists.`)
            : user
    }

    all = (query, info) => {

        if (query) {
            query = {
                where: {
                    OR: [
                        {name_contains: query},
                        {email_contains: query},
                    ]
                }
            }
        }

        return this.prisma.query.users(query, info)
    }
}