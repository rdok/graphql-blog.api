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
            // author: 'required|exists:User,id',
            post: 'required|existsWith:posts,id,published,true',
        })

        const args = {
            data: {
                ...data,
                author: {connect: {id: data.author}},
                post: {connect: {id: data.post}}
            }
        }

        const comment = this.prisma.mutation.createComment(args, info)

        this.commentEvent.publishCreated(comment)

        return comment
    }

    update = async (id, data, info) => {
        await this.validator.validate({
            id: id,
            ...data
        }, {
            text: 'required',
            id: 'required|exists:Comment,id'
        })

        let comment = this.prisma.mutation.updateComment({
            where: {id: id},
            data: {...data}
        }, info)

        this.commentEvent.publishUpdated(comment)

        return comment
    }

    all = (query, info) => {
        return this.prisma.query.comments(query, info)
    }

    delete = async (id, info) => {
        await this.validator.validate({id}, {
            id: 'required|exists:Comment,id',
        })

        let comment = this.prisma.mutation.deleteComment({
            where: {id: id}
        }, info)

        this.commentEvent.publishDeleted(comment)

        return comment
    }

    find = (id) => {
        return this.prisma.query.comments({where: {id: id}})
    }
}

export {CommentAPI as default}