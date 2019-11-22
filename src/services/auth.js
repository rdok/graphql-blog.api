import {Prisma} from "prisma-binding";
import jwt from 'jsonwebtoken'
import bcryptjs from "bcryptjs";

export default class Auth {
    /** @type Prisma prisma */
    prisma
    /** @type Validator validator */
    validator

    constructor({prisma, validator}) {
        this.prisma = prisma
        this.validator = validator
    }

    async user(app) {
        try {
            return await this.userOrFail(app)
        } catch (e) {
            return null
        }
    }

    extractAuthToken = async (app) => {
        let token

        if (app.request) {
            const headers = app.request.headers
            await this.validator.validate(headers, {
                authorization: 'required',
            })
            token = headers.authorization
        } else {
            const context = app.connection.context
            await this.validator.validate(context, {
                Authorization: 'required',
            })
            token = context.Authorization
        }

        return token.replace('Bearer ', '')
    }

    async userOrFail(app) {
        let token = await this.extractAuthToken(app)
        const decoded = jwt.verify(token, this.secret())
        const user = await this.prisma.query.user({where: {id: decoded.id}})

        return user ? user
            : throw new Error('Unable to find user with the given token')
    }

    secret() {
        return process.env.JWT_AUTH_SECRET
    }

    async hash(password) {
        return await bcryptjs.hash(password, 10)
    }

    async compare(password, hash) {
        return await bcryptjs.compare(password, hash)
    }

    generateAuthPayload(app, user) {
        const token = jwt.sign({id: user.id}, this.secret(), {expiresIn: '48h'})
        app.request.headers.authorization = token

        return {user, token}
    }
}