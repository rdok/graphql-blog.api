import validator from 'validator'
import ValidationError from '../validation-error'

export default class UserValidator {
    constructor(args) { this.userAPI = args.userAPI }

    validateUpdate = (input) => {
        let errors = {}

        if (!this.userAPI.find(input.id)) {
            errors.id = [`Non existent id: '${input.id}'.`]
        }

        if (input.email && !validator.isEmail(input.email)) {
            errors.email = [`Not an email: 'input.email'.`]
        }

        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors)
        }
    }
}