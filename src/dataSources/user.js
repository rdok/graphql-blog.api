import {Prisma} from "prisma-binding";
import Validator from '../validator/index'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

        const password = await bcryptjs.hash(data.password, 10)
        const user = await this.prisma.mutation.createUser({
            data: {...data, password}, info
        })

        return this.generateAuthPayload(user)
    }

    generateAuthPayload(user) {
        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_AUTH_SECRET,
            {expiresIn: '1h'}
        )

        return {user, token}
    }

    login = async (data) => {
        await this.validator.validate(data, {
            email: 'required|email|exists:User,email',
            password: 'required',
        })

        const user = await this.findByEmail(data.email)
        const isMatch = await bcryptjs.compare(data.password, user.password)

        return isMatch
            ? this.generateAuthPayload(user)
            : throw new Error('Invalid password.')
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
        return await this.prisma.query.user({where: {email: email}}, info)
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