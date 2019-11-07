
import { User } from '../dataSources/user'
import { Post } from '../dataSources/post'

class CommentValidator {
    static validateCreation(attributes) {

        let errors = []

        if (!User.find(attributes.author)) {
           errors.push(`The author id ${attributes.author} is invalid`)
        }

        const postId = attributes.post
        const post = Post.find(postId)

        if (!post) {
            errors.push(`The post id ${postId} is invalid`)
        }

        if (post && !post.published) {
            errors.push(
                `Cannot comment on un-published post with id ${postId}`
            )
        }

        if(errors.length > 0){
            throw new Error(errors)
        }
    }
}

export { CommentValidator }