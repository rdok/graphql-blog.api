
import { User } from '../dataSources/user'

class PostValidator {
    static validateCreation(attributes) {
        const userExists = User.find(attributes.author)

        if (! userExists) {
            throw new Error('That author id does not exists.')
        }
    }
}

export { PostValidator }