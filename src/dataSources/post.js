import UserAPI from './user'
import CommentAPI from './comment'
import PostEvent from '../events/post'
import UpdatePostValidator from '../validator/udpate-post'
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

    update = (id, input) => {
        const updatePostValidator = new UpdatePostValidator({postAPI: this})
        updatePostValidator.validate(id, input)

        let post = this.find(id)
        const originalPost = {...post}

        post = Object.assign(post, input)

        if (originalPost.published && !post.published) {
            this.postEvent.publishDeleted(originalPost)
        } else if (!originalPost.published && post.published) {
            this.postEvent.publishCreated(post)
        } else {
            this.postEvent.publishUpdated(post)
        }

        return post
    }

    delete = (attributes) => {
        const postId = attributes.id
        const index = this.findIndexOrFail(postId)

        const commentQuery = new CommentAPI({prisma: this.prisma})
        commentQuery.deleteByPostId(postId)

        const [post] = this.prisma.posts.splice(index, 1)
        this.postEvent.publishDeleted(post)

        return post
    }

    all = (info) => {
        return this.prisma.query.posts(null, info)
    }

    find = (postId) => {
        return this.prisma.posts.find((post) => {
            return post.id === postId
        })
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