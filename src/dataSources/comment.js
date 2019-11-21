import {Prisma} from "prisma-binding";
import Validator from "../validator";

class CommentAPI {

    /** @type Prisma */
    prisma
    /** @type Validator */
    validator

    constructor({prisma, validator}) {
        this.prisma = prisma
        this.validator = validator
    }

    create = async ({data, info, user}) => {
        await this.validator.validate(data, {
            text: 'required',
            post: 'required|existsWith:posts,id,published,true',
        })

        return this.prisma.mutation.createComment({
            data: {
                ...data,
                author: {connect: {id: user.id}},
                post: {connect: {id: data.post}}
            }
        }, info)
    }

    update = async (id, {data, info, user}) => {
        await this.validator.validate({id: id, ...data}, {
            text: 'required',
            // TODO: replace validation with shield/policy
            id: `required|hasRelation:comments,id,author,id,${user.id}`,
        })

        return this.prisma.mutation.updateComment({
            where: {id: id},
            data: {...data}
        }, info)
    }

    all = (query, info) => {
        return this.prisma.query.comments(query, info)
    }

    delete = async ({id, info, user}) => {
        await this.validator.validate({id}, {
            // TODO: replace validation with shield/policy
            id: `required|hasRelation:comments,id,author,id,${user.id}`,
        })

        return this.prisma.mutation.deleteComment({
            where: {id: id}
        }, info)
    }

    find = (id) => {
        return this.prisma.query.comments({where: {id: id}})
    }
}

export {CommentAPI as default}