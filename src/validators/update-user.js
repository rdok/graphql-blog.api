import validator from 'validator'
import ValidationError from './validation-error'

export default class UpdateUserValidator {
    constructor(args) { this.userAPI = args.userAPI }

    validate = (id, input) => {
        let errors = {}

        if (!this.userAPI.find(id)) {
            errors.id = [`Non existent id: '${id}'.`]
        }

        if (input.email) {
            let emailErrors = this.validateEmail(id, input)

            if (emailErrors.length > 0) {
                errors.email = emailErrors
            }
        }

        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors)
        }
    }

    validateEmail(id, { email }) {
        let error = []

        if (!validator.isEmail(email)) {
            error.push([`Not an email: '${email}'.`])

            return error
        }

        const userHavingEmail = this.userAPI.findByEmail(email)

        if (userHavingEmail && userHavingEmail.id !== id) {
            error.push([`The selected email '${email} has been taken.`])
        }

        return error
    }
}