import CommentEvent from "../events/comment";
import {Prisma} from "prisma-binding";
import Validator from "../validator";

class CommentAPI {

    /** @type Prisma */
    prisma
    /** @type Validator */
    validator
    /** @type CommentEvent */
    commentEvent

    constructor({prisma, validator, commentEvent}) {
        this.prisma = prisma
        this.validator = validator
        this.commentEvent = commentEvent
    }

    create = async (data, info) => {
        await this.validator.validate(data, {
            text: 'required',
            author: 'required|exists:User,id',
            post: 'required|existsWith:posts,id,published,true',
        })

        return this.prisma.mutation.createComment({
            data: {
                ...data,
                author: {connect: {id: data.author}},
                post: {connect: {id: data.post}}
            }
        }, info)
    }

    update = async (id, data, info) => {
        await this.validator.validate(
            {id: id, ...data},
            {text: 'required', id: 'required|exists:Comment,id'}
        )

        return this.prisma.mutation.updateComment({
            where: {id: id},
            data: {...data}
        }, info)
    }

    all = (query, info) => {
        return this.prisma.query.comments(query, info)
    }

    delete = async (id, info) => {
        await this.validator.validate({id}, {
            id: 'required|exists:Comment,id',
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