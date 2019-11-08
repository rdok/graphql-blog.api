import UserAPI from '../dataSources/user'
import PostAPI from '../dataSources/post'
import ValidationError from './validation-error'

export default class CommentValidator {
    constructor(args) { this.db = args.db }

    validateCreation = (attributes) => {
        const userQuery = new UserAPI({ db: this.db })
        const postQuery = new PostAPI({ db: this.db })
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
            throw new ValidationError(errors)
        }
    }
}