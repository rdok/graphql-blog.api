import ValidationError from '../validation-error'

export default class UpdateCommentValidator {
    constructor({ commentAPI }) {
        this.commentAPI = commentAPI
    }

    validate = (id, input) => {
        let errors = {}

        if (!this.commentAPI.find(id)) {
            errors.id = [`Non existent id: '${id}'.`]
        }

        if (typeof input.text !== 'string' || input.text.length === 0) {
            errors.title = [`Text cannot be empty.`]
        }

        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors)
        }
    }
}