
import { User } from '../dataSources/user'

class PostValidator {
    static validateCreation(attributes) {
        const emailExists = User.find(attributes.author)

        if (! emailExists) {
            throw new Error('That user email does not exists.')
        }
    }
}

export { PostValidator }