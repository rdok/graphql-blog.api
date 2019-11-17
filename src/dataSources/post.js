import UserAPI from './user'
import CommentAPI from './comment'
import PostEvent from '../events/post'
import {Prisma} from "prisma-binding";

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

        const post = this.prisma.mutation.createPost(
            {data: {...data}}, info
        )

        this.postEvent.publishCreated(post)

        return post
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

        let post = await this.prisma.mutation.deletePost({
            where: {id: id}
        }, info)

        this.postEvent.publishDeleted(post)

        return post
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

    getByAuthorId = (authorId) => {
        return this.prisma.posts.filter((post) => {
            return post.author === authorId
        })
    }

    deleteByAuthorId = (authorId) => {
        const userQuery = new UserAPI({prisma: this.prisma})
        const commentQuery = new CommentAPI({prisma: this.prisma})
        userQuery.findOrFail(authorId)

        this.prisma.posts = this.prisma.posts.filter((post) => {
            const shouldDeletePost = post.author === authorId
            if (shouldDeletePost) {
                commentQuery.deleteByPostId(post.id)
            }

            return !shouldDeletePost
        })
    }

    findOrFail = (id) => {
        const post = this.prisma.posts.find((post) => {
            return post.id === id
        })
        if (!post) {
            throw new Error('That post id is invalid.')
        }
        return post
    }

    findIndexOrFail = (id) => {
        const index = this.prisma.posts.findIndex((post) => {
            return post.id === id
        })
        if (index === -1) {
            throw new Error('That post id is invalid.')
        }
        return index
    }
}