const uuidv4 = require('uuid/v4')
import { UserValidator } from '../validators/user'
import { Post } from './post'
import { Comment } from './comment'

class User {
    static data = []

    static create(attributes) {
        UserValidator.validateCreation(attributes)

        const user = { id: uuidv4(), ...attributes }
        User.data.push(user)

        return user
    }

    static delete(attributes) {
        const userId = attributes.id
        const index = User.findIndexOrFail(userId)

        Post.deleteByAuthorId(userId)
        Comment.deleteByAuthorId(userId)
        const deletedUsers = User.data.splice(index, 1)

        return deletedUsers[0]
    }

    static findByEmail(email) {
        return User.data.find((user) => { return user.email === email })
    }

    static all(query) {
        if (!query) { return User.data }

        return User.data.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase())
        })
    }

    static find(id) {
        return User.data.find((user) => { return user.id === id })
    }

    static findOrFail(id) {
        const user = User.data.find((user) => { return user.id === id })
        if (!user) { throw new Error('That user id is invalid.') }
        return user
    }

    static findIndexOrFail(id) {
        const index = User.data.findIndex((user) => { return user.id === id })
        if (index === '-1') { throw new Error('That user id is invalid.') }
        return index
    }
}

User.data = [
    { id: '1', name: 'nameValue', email: 'email', age: 60, posts: ['2050'] },
    { id: '2', name: 'nameValue2', email: 'emailValue2', age: 30, posts: ['2049', '2048'] },
    { id: '3', name: 'nameValue3', email: 'emailValue3', age: 35, posts: [] },
]

export { User }