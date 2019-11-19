import PostEvent from '../events/post'
import {Prisma} from "prisma-binding";
import Validator from "../validator";

export default class PostAPI {

    /** @type Prisma */
    prisma
    /** @type Validator */
    validator
    /** @type PostEvent */
    postEvent

    constructor({prisma, validator, postEvent}) {
        this.prisma = prisma
        this.validator = validator
        this.postEvent = postEvent
    }

    create = async (data, info) => {

        await this.validator.validate(data, {
            title: 'required',
            body: 'required',
            published: 'required|boolean',
            author: 'required|exists:User,id',
        })

        data.author = {connect: {id: data.author}}

        return this.prisma.mutation.createPost(
            {data: {...data}}, info
        )
    }

    update = async (id, data, info) => {

        await this.validator.validate({id, ...data}, {
            id: 'required|exists:Post,id',
            author: 'exists:User,id',
            published: 'boolean',
        })

        const originalPost = await this.find(id)

        const updatedPost = await this.prisma.mutation.updatePost({
            where: {id: id},
            data: {...data}
        })

        if (originalPost.published && !updatedPost.published) {
            this.postEvent.publishDeleted(originalPost)
        } else if (!originalPost.published && updatedPost.published) {
            this.postEvent.publishCreated(updatedPost)
        } else {
            this.postEvent.publishUpdated(updatedPost)
        }

        return updatedPost
    }

    delete = async (id, info) => {
        await this.validator.validate({id}, {
            id: 'required|exists:Post,id',
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