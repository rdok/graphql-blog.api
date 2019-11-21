import {Prisma} from "prisma-binding";
import jwt from 'jsonwebtoken'

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

    async userOrFail(app) {
        const headers = app.request.headers
        await this.validator.validate(headers, {
            authorization: 'required',
        })

        let token = headers.authorization
        token = token.replace('Bearer ', '')

        const decoded = jwt.verify(token, this.secret())

        const user = await this.prisma.query.user({where: {id: decoded.id}})

        return user ? user
            : throw new Error('Unable to find user with the given token')
    }

    secret() {
        return process.env.JWT_AUTH_SECRET
    }

    generateAuthPayload(user) {
        const token = jwt.sign({id: user.id}, this.secret(), {expiresIn: '48h'})

        return {user, token}
    }
}