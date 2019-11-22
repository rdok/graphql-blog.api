import {Prisma} from "prisma-binding";
import Validator from '../validator/index'
import Auth from "../services/auth";

export default class UserAPI {
    /** @type Auth auth */
    auth
    /** @type Prisma prisma */
    prisma
    /** @type Validator validator */
    validator
    passwordRule = 'min:7'

    constructor({prisma, validator, auth}) {
        this.prisma = prisma
        this.validator = validator
        this.auth = auth
    }

    create = async (data, {app}, info) => {
        await this.validator.validate(data, {
            email: 'required|email|unique:user,email',
            password: 'required|' + this.passwordRule
        })

        const password = await this.auth.hash(data.password)
        const user = await this.prisma.mutation.createUser({
            data: {...data, password}, info
        })

        return this.auth.generateAuthPayload(app, user)
    }


    login = async (data, {app}) => {
        await this.validator.validate(data, {
            email: 'required|email|exists:User,email',
            password: 'required',
        })

        const user = await this.show(data.email)
        const isMatch = await this.auth.compare(data.password, user.password)

        return isMatch
            ? this.auth.generateAuthPayload(app, user)
            : throw new Error('Invalid password.')
    }

    update = async ({data, user}) => {
        await this.validator.validate({...data}, {
            email: `email|unique:user,email,except,id,${user.id}`,
            password: this.passwordRule
        })

        if (data.password) {
            data.password = await this.auth.hash(data.password)
        }

        return await this.prisma.mutation
            .updateUser({where: {id: user.id}, data})
    }

    delete = async (user, info) => {
        return this.prisma.mutation.deleteUser({where: {id: user.id}}, info)
    }

    show = async (email, info) => {
        return await this.prisma.query.user({where: {email: email}}, info)
    }

    index = ({query, meta}, info) => {
        let args = {}

        if (query) {
            args.where = {OR: [{name_contains: query}]}
        }

        if (meta) {
            args = {...meta, ...args}
        }

        return this.prisma.query.users(args, info)
    }
}