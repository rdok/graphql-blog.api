export default function required(data) {
    return (typeof data === 'undefined' || data === '')
        ? 'The selected field value is required and cannot be empty.'
        : null
}
