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

    _generateErrors = async (data, rules) => {
        const validator = this
        let errors = []

        Object.keys(rules).forEach((property, index) => {
            const rule = rules[property]
            const validations = rule.split('|')

            validations.forEach(async (validation) => {

                const validationParts = validation.split(':')
                const validationMethod = validationParts[0]
                const validationArgs = validationParts[1]

                if (typeof validator[validationMethod] !== 'function') {
                    throw new Error(`That rule is invalid: '${validationMethod}'`)
                }

                const error = await validator[validationMethod](data[property], validationArgs)

                if (error !== null) {
                    errors.push(error)
                }
            })
        })

        return errors

    }

    email = async (data) => {
        return new Promise((resolve) => {
            resolve(validator.isEmail(data) ?
                null : `The selected email '${data}' is not an email.`
            )
        });
    }

    unique = async (data, args) => {
        const [model, property, except, exceptProperty, value, ...undefined] = args.split(',')

        const record = await this.prisma.query[model]({
            where: {[property]: data}
        })

        if (record === null) {
            return null
        }

        if (except && record[exceptProperty] === value) {
            return null
        }

        return `The selected email is taken.`
    }

    exists = async (data, args) => {
        const [model, property] = args.split(',')

        const recordExists = await this.prisma.exists[model]({[property]: data})

        return recordExists ?
            null : `The selected ${property} field's value ${data} does not exist`
    }
}