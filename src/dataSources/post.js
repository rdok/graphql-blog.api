import {Prisma} from "prisma-binding";
import Validator from "../validator";
import Auth from "../services/auth";

export default class PostAPI {

    /** @type Prisma */
    prisma
    /** @type Validator */
    validator
    /** @type Auth */
    auth

    constructor({prisma, validator, auth}) {
        this.prisma = prisma
        this.validator = validator
        this.auth = auth
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

        const updatedPost = this.prisma.mutation.updatePost({
            where: {id: id},
            data: {...data}
        })

        if (!updatedPost.published) {
            await this.prisma.mutation
                .deleteManyComments({where: {post: {id: id}}})
        }

        return updatedPost
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

    index = async ({query, meta}, {auth, app}, info) => {
        let input = {where: {published: true}}
        const user = await auth.user(app)
        const filterWhere = {OR: [{title_contains: query}, {body_contains: query},]}

        if (!user) {
            if (query) {
                input.where.OR = filterWhere.OR
            }
        } else {
            input = {where: {OR: [{author: {id: user.id}}, {published: true}]}}
            if (query) {
                input = {where: {AND: [input.where, filterWhere]}}
            }
        }

        if (meta) {
            input = {...input, ...meta}
        }

        return this.prisma.query.posts(input, info)
    }

    show = async (id, {app}, info) => {
        await this.validator.validate({id}, {
            id: 'required|exists:Post,id',
        })

        const post = await this.prisma.query.post(
            {where: {id: id}},
            '{ published author { id } }'
        )

        const user = await this.auth.user(app)
        const mayShow = post.published || (user && user.id === post.author.id)

        if (!mayShow) {
            throw new Error('That post is unpublished.')
        }

        return await this.prisma.query.post({where: {id: id}}, info)
    }
}