const uuidv4 = require('uuid/v4')
import { Post } from './post'
import { Comment } from './comment'

class User {

    constructor(args) {
        this.db = args.db
    }

    create = (attributes) => {
        const emailTaken = this.findByEmail(attributes.email)
        if (emailTaken) { throw new Error('Email has been taken.') }
        const user = { id: uuidv4(), ...attributes }
        this.db.users.push(user)
        return user
    }

    delete = (attributes) => {
        const userId = attributes.id
        const index = this.findIndexOrFail(userId)

        const postQuery = new Post({ db: this.db })
        postQuery.deleteByAuthorId(userId)
        const commentQuery = new Comment({ db: this.db })
        commentQuery.deleteByAuthorId(userId)

        const deletedUsers = this.db.users.splice(index, 1)

        return deletedUsers[0]
    }

    findByEmail = (email) => {
        return this.db.users.find((user) => { return user.email === email })
    }

    all = (query) => {
        if (!query) { return this.db.users }

        return this.db.users.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase())
        })
    }

    find = (id) => {
        return this.db.users.find((user) => { return user.id === id })
    }

    findOrFail = (id) => {
        const user = this.db.users.find((user) => { return user.id === id })
        if (!user) { throw new Error('That user id is invalid.') }
        return user
    }

    findIndexOrFail = (id) => {
        const index = this.db.users.findIndex((user) => { return user.id === id })
        if (index === -1) { throw new Error('That user id is invalid.') }
        return index
    }
}

export { User }