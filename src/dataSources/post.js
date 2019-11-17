import UserAPI from './user'
import CommentAPI from './comment'
import UpdatePostValidator from '../validator/udpate-post'
import {Prisma} from "prisma-binding";

export default class PostAPI {

    /** @type Prisma prisma */
    prisma
    /** @type Validator validator */
    validator

    constructor({prisma, validator, postEvent}) {
        this.prisma = prisma
        this.postEvent = postEvent
    }

    create = async (data) => {

        await this.validator.validate(data, {
            title: 'required',
            body: 'required',
            published: 'required|boolean',
            author: 'required|exists:user,id',
        })

        const post = this.prisma.mutation.createPost(data)

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

    all = (query) => {
        if (!query) {
            return this.prisma.posts
        }

        const valueToFind = query.toLowerCase()

        return this.prisma.posts.filter((post) => {
            return post.title.toLowerCase().includes(valueToFind)
                || post.body.toLowerCase().includes(valueToFind)
        })
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