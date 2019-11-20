import validator from 'validator'

export default function email(data) {
    return validator.isEmail(data) ?
        null : `The selected email '${data}' is not an email.`
}
