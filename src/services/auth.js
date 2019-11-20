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

    async login(app) {
        const headers = app.request.headers
        await this.validator.validate(headers, {
            authorization: 'required',
        })

        let token = headers.authorization
        token = token.replace('Bearer ', '')

        const decoded = jwt.verify(token, this.secret())

        return this.prisma.query.user({where: {id: decoded.id}})
    }

    secret() {
        return process.env.JWT_AUTH_SECRET
    }

    generateAuthPayload(user) {
        const token = jwt.sign({id: user.id}, this.secret(), {expiresIn: '1h'})

        return {user, token}
    }
}