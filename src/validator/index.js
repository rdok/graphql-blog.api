import {Prisma} from "prisma-binding";
import ValidationError from "./validation-error";
import existsWith from "./rules/exists-with";
import exists from "./rules/exists";
import unique from "./rules/unique";
import email from "./rules/email";
import boolean from "./rules/boolean";
import required from "./rules/required";
import min from "./rules/min";
import hasRelation from './rules/has-relation'

export default class Validator {
    /** @type Prisma prisma */
    prisma

    constructor({prisma}) {
        this.prisma = prisma
    }

    /**
     * @param {{}} data
     * @param {{}} rules
     */
    validate = async (data, rules) => {
        const errors = await this._generateErrors(data, rules)
        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors)
        }
    }

    _generateErrors = async (data, fieldsRules) => {
        const validator = this
        let errors = {}

        for (const field in fieldsRules) {
            const rules = fieldsRules[field].split('|')

            errors[field] = []

            for (const rule of rules) {

                const ruleParts = rule.split(':')

                const method = ruleParts[0]
                const args = ruleParts[1]

                if (typeof validator[method] !== 'function') {
                    throw new Error(`That rule is invalid: '${method}'`)
                }

                const error = await validator[method](data[field], args, field)

                if (error !== null) {
                    errors[field].push(error)
                }
            }

            if (errors[field].length === 0) {
                delete errors[field]
            }
        }

        return errors
    }

    hasRelation = hasRelation
    required = required
    boolean = boolean
    email = email
    unique = unique
    exists = exists
    existsWith = existsWith
    min = min
}