import { User } from '../dataSources/user'
import { Post } from '../dataSources/post'

class CommentValidator {
    constructor(args) { this.db = args.db }

    validateCreation = (attributes) => {
        const userQuery = new User({ db: this.db })
        const postQuery = new Post({ db: this.db })
        let errors = []

        if (!userQuery.find(attributes.author)) {
            errors.push(`The author id ${attributes.author} is invalid`)
        }

        const postId = attributes.post
        const post = postQuery.find(postId)

        if (!post) {
            errors.push(`The post id ${postId} is invalid`)
        }

        if (post && !post.published) {
            errors.push(
                `Cannot comment on un-published post with id ${postId}`
            )
        }

        if (errors.length > 0) {
            throw new Error(errors)
        }
    }
}

export { CommentValidator }