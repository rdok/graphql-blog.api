const uuidv4 = require('uuid/v4')
import { PostValidator } from '../validators/post'
import { UserValidator } from '../validators/user'

class Post {
    static data = []

    static create(attributes) {
        PostValidator.validateCreation(attributes)

        const post = { id: uuidv4(), ...attributes }

        Post.data.push(post)

        return post
    }

    static all(query) {
        if (!query) { return Post.data }

        const valueToFind = query.toLowerCase()

        return Post.data.filter((post) => {
            return post.title.toLowerCase().includes(valueToFind)
                || post.body.toLowerCase().includes(valueToFind)
        })
    }

    static find(postId) {
        return Post.data.find((post) => { return post.id === postId })
    }

    static getByAuthorId(authorId) {
        return Post.data.filter((post) => { return post.author === authorId })
    }

    static deleteByAuthorId(authorId) {
        UserValidator.validateDeletion(authorId)
        Post.data = Post.data.filter(post => post.author !== authorId)
    }
}

Post.data = [
    { id: '2050', 'author': '1',title: 'NextGen2', body: 'Description Value2', published: false },
    { id: '2049', 'author': '2', title: 'PrevGen', body: 'Description Value', published: true },
    { id: '2048', 'author': '2', title: 'PrevGen3', body: 'Description Value3', published: true },
]

export { Post }