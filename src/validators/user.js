import { User } from '../dataSources/user'

class UserValidator {
    static validateCreation(attributes) {
        const emailTaken = User.findByEmail(attributes.email)

        if (emailTaken) {
            throw new Error('Email has been taken.')
        }
    }

    static validateDeletion(id) {
        const user = User.find(id)

        if (!user) {
            throw new Error('That user id is invalid.')
        }
    }
}

export { UserValidator }