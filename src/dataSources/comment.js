const uuidv4 = require('uuid/v4')
import { CommentValidator } from '../validators/comment'
import { User } from './user'
import { Post } from './post'

class CommentAPI {

    constructor(args) {
        this.db = args.db
    }

    create = (attributes) => {
        const validator = new CommentValidator({ db: this.db })
        validator.validateCreation(attributes)

        const comment = { id: uuidv4(), ...attributes }
        this.db.comments.push(comment)

        return comment
    }

    all = () => { return this.db.comments }

    getByAuthorId = (authorId) => {
        return this.db.comments.filter((comment) => { return authorId === comment.author })
    }

    delete = (attributes) => {
        const index = this.findIndexOrFail(attributes.id)
        const deletedComments = this.db.comments.splice(index, 1)
        return deletedComments[0]
    }

    findIndexOrFail = (id) => {
        const index = this.db.comments.findIndex((comment) => { return comment.id === id })
        if (index === -1) { throw new Error('That comment id is invalid.') }
        return index
    }
    getByPostId = (postId) => {
        return this.db.comments.filter((comment) => { return postId === comment.post })
    }

    deleteByAuthorId = (authorId) => {
        const userQuery = new User({ db: this.db })
        userQuery.findOrFail(authorId)

        this.db.comments = this.db.comments.filter(comment => comment.author !== authorId)
    }

    deleteByPostId = (postId) => {
        const postQuery = new Post({ db: this.db })
        postQuery.findOrFail(postId)

        this.db.comments = this.db.comments.filter(comment => comment.post !== postId)
    }
}

export { CommentAPI }