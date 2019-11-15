import ValidationError from './validation-error'

export default class UpdatePostValidator {
    constructor({ postAPI }) { this.postAPI = postAPI }

    validate = (id, input) => {
        let errors = {}

        if (!this.postAPI.find(id)) {
            errors.id = [`Non existent id: '${id}'.`]
        }

        if (typeof input.title == 'string' && input.title.length === 0) {
            errors.title = [`Title cannot be empty.`]
        }

        if ('published' in input && input.published === null) {
            errors.title = [`Published field cannot be null`]
        }

        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors)
        }
    }
}