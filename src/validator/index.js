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

    email = (data) => {
        return validator.isEmail(data) ?
            null : `The selected email '${data}' is not an email.`
    }

    required = (data) => {
        return (typeof data === 'undefined' || data === '')
            ? 'This field is required and cannot be empty.'
            : null
    }

    boolean = (data) => {
        return typeof data !== 'boolean'
            ? 'Must be of boolean type.'
            : null
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

    exists = async (data, args) => {
        const [model, property] = args.split(',')

        const recordExists = await this.prisma.exists[model]({[property]: data})

        return recordExists ?
            null : `The selected value '${data}' is invalid.`
    }

    existsWith = async (data, args) => {
        let [model, primaryColumn, secondaryColumn, secondaryValue] =
            args.split(',')

        if (!data) {
            return null
        }

        if (secondaryValue === 'true') {
            secondaryValue = true
        }

        const recordExists = await this.prisma.query[model]({
            where: {
                AND: [
                    {[primaryColumn]: data},
                    {[secondaryColumn]: secondaryValue}
                ]
            }
        })

        return recordExists.length > 0
            ? null
            : `Could not find record with '${primaryColumn}=${data} and `
            + `'${secondaryColumn}=${secondaryValue}`
    }
}