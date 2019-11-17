import {Prisma} from "prisma-binding";
import ValidationError from "./validation-error";
import validator from 'validator'

export default class Validator {
    /** @type Prisma prisma */
    prisma

    constructor({prisma}) {
        this.prisma = prisma
    }

    /**
     * @param {{}} data
     * @param {[]} rules
     */
    validate = async (data, rules) => {

        const errors = await this._generateErrors(data, rules)

        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors)
        }
    }

    _generateErrors = async (data, fieldsRules) => {
        const validator = this
        let errors = []

        for (const field in fieldsRules) {
            const rules = fieldsRules[field].split('|')

            for (const rule of rules) {

                const ruleParts = rule.split(':')
                const method = ruleParts[0]
                const args = ruleParts[1]

                if (typeof validator[method] !== 'function') {
                    throw new Error(`That rule is invalid: '${method}'`)
                }

                const error = await validator[method](data[field], args)

                if (error !== null) {
                    errors.push(error)
                }
            }
        }

        return errors
    }

    email = (data) => {
        return validator.isEmail(data) ?
            null : `The selected email '${data}' is not an email.`
    }

    unique = async (data, args) => {
        const [model, property, except, exceptProperty, expectValue] = args.split(',')

        const record = await this.prisma.query[model]({
            where: {[property]: data}
        })

        let error = null

        if (record) {
            if (!except || record[exceptProperty] !== expectValue) {
                error = `The selected ${property} is taken.`
            }
        }

        return error
    }

    exists = (data, args) => {
        const [model, property] = args.split(',')

        const recordExists = this.prisma.exists[model]({[property]: data})

        return recordExists ?
            null : `The selected ${property} field's value ${data} does not exist`
    }
}