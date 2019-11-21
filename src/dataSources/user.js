import {Prisma} from "prisma-binding";
import Validator from '../validator/index'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Auth from "../services/auth";

export default class UserAPI {
    /** @type Auth auth */
    auth
    /** @type Prisma prisma */
    prisma
    /** @type Validator validator */
    validator

    constructor({prisma, validator, auth}) {
        this.prisma = prisma
        this.validator = validator
        this.auth = auth
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

        return this.auth.generateAuthPayload(user)
    }


    login = async (data) => {
        await this.validator.validate(data, {
            email: 'required|email|exists:User,email',
            password: 'required',
        })

        const user = await this.show(data.email)
        const isMatch = await bcryptjs.compare(data.password, user.password)

        return isMatch
            ? this.auth.generateAuthPayload(user)
            : throw new Error('Invalid password.')
    }

    update = async ({data, user}) => {
        await this.validator.validate({...data}, {
            email: `email|unique:user,email,except,id,${user.id}`,
        })

        return await this.prisma.mutation.updateUser({
            where: {id: user.id},
            data: {...data}
        })
    }

    delete = async (user, info) => {
        return this.prisma.mutation.deleteUser({where: {id: user.id}}, info)
    }

    show = async (email, info) => {
        return await this.prisma.query.user({where: {email: email}}, info)
    }

    index = (query, info) => {

        if (query) {
            query = {where: {OR: [{name_contains: query},]}}
        }

        return this.prisma.query.users(query, info)
    }
}