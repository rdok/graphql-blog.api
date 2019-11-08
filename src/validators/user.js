import { User } from '../dataSources/user'

class UserValidator {
    static validateCreation(attributes) {
        const emailTaken = User.findByEmail(attributes.email)

        if (emailTaken) {
            throw new Error('Email has been taken.')
        }
    }
}

export { UserValidator }