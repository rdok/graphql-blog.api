const uuidv4 = require('uuid/v4')
import { PostValidator } from '../validators/post'
import { User } from './user'
import { Comment } from './comment'

class Post {
    static data = []

    static create(attributes) {
        PostValidator.validateCreation(attributes)

        const post = { id: uuidv4(), ...attributes }

        Post.data.push(post)

        return post
    }

    static delete(attributes) {
        const postId = attributes.id
        const index = Post.findIndexOrFail(postId)

        Comment.deleteByPostId(postId)
        const deletedPosts = Post.data.splice(index, 1)

        return deletedPosts[0]
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
        User.findOrFail(authorId)

        Post.data = Post.data.filter((post) => {
            const shouldDeletePost = post.author === authorId
            if (shouldDeletePost) { Comment.deleteByPostId(post.id) }

            return !shouldDeletePost
        })
    }

    static findOrFail(id) {
        const post = Post.data.find((post) => { return post.id === id })
        if (!post) { throw new Error('That post id is invalid.') }
        return post
    }

    static findIndexOrFail(id) {
        const index = Post.data.findIndex((post) => { return post.id === id })
        if (index === -1) { throw new Error('That post id is invalid.') }
        return index
    }
}

Post.data = [
    { id: '2050', 'author': '1', title: 'NextGen2', body: 'Description Value2', published: false },
    { id: '2049', 'author': '2', title: 'PrevGen', body: 'Description Value', published: true },
    { id: '2048', 'author': '2', title: 'PrevGen3', body: 'Description Value3', published: true },
    { id: '2047', 'author': '2', title: 'PrevGen3', body: 'Description Value3', published: true },
]

export { Post }