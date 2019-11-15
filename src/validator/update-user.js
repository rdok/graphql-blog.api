import validator from 'validator'
import ValidationError from './validation-error'

export default class UpdateUserValidator {

    /** @type UserAPI userAPI */
    userAPI

    constructor({userAPI}) {
        this.userAPI = userAPI
    }

    validate = (email, data) => {
        let errors = {}

        if (!validator.isEmail(email)) {
            errors.email = [`Invalid email: '${email}'.`]
        }



        if (data.email === undefined) {
            errors.data.email = [`Email is required.`]
        } else if (!validator.isEmail(data.email)) {
            errors.data.email = [`Invalid email: '${email}'.`]
        } else {
            if (!this.userAPI.findByEmail(email)) {
                errors.id = [`Non existent email: '${email}'.`]
            }
        }

        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors)
        }
    }

    validateEmail(id, {email}) {
        let error = []

        if (!validator.isEmail(email)) {
            error.push([])

            return error
        }

        const userHavingEmail = this.userAPI.findByEmail(email)

        if (userHavingEmail && userHavingEmail.id !== id) {
            error.push([`The selected email '${email} has been taken.`])
        }

        return error
    }
}