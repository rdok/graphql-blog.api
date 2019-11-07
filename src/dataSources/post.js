const uuidv4 = require('uuid/v4')
import { PostValidator } from '../validators/post'

class Post {
    static data = []

    static create(attributes) {
        PostValidator.validateCreation(attributes)

        const post = {
            id: uuidv4(),
            title: attributes.title,
            body: attributes.body,
            published: attributes.published,
            author: attributes.author,
        }

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

    static find(id) {
        return Post.data.find((post) => { return post.id === id })
    }

    static getByAuthorId(id) {
        return Post.data.filter((post) => { return id === post.author })
    }
}

Post.data = [
    { id: '2050', title: 'NextGen2', body: 'Description Value2', published: false, 'author': '1' },
    { id: '2049', title: 'PrevGen', body: 'Description Value', published: true, 'author': '2' },
    { id: '2048', title: 'PrevGen3', body: 'Description Value3', published: true, 'author': '2' },
]

export { Post }