import {Prisma} from "prisma-binding";
import Validator from "../validator";

export default class PostAPI {

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
            title: 'required',
            body: 'required',
            published: 'required|boolean',
        })

        data.author = {connect: {id: user.id}}

        return this.prisma.mutation.createPost(
            {data: {...data}}, info
        )
    }

    update = async (id, {data, user}) => {

        await this.validator.validate({id, ...data}, {
            // TODO: replace validation with shield/policy
            id: `required|hasRelation:posts,id,author,id,${user.id}`,
            published: 'boolean',
        })

        return this.prisma.mutation.updatePost({
            where: {id: id},
            data: {...data}
        })
    }

    delete = async ({id, info, user}) => {
        await this.validator.validate({id}, {
            // TODO: replace validation with shield/policy
            id: `required|hasRelation:posts,id,author,id,${user.id}`,
        })

        return await this.prisma.mutation.deletePost({
            where: {id: id}
        }, info)
    }

    all = (query, info) => {
        if (query) {
            query = {
                where: {
                    OR: [
                        {title_contains: query},
                        {body_contains: query},
                    ]
                }
            }
        }
        return this.prisma.query.posts(query, info)
    }

    find = (id, info) => {
        return this.prisma.query.post({where: {id: id}, info})
    }
}