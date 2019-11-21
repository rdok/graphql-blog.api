export default function required(data) {
    return (typeof data === 'undefined' || data === '')
        ? 'This field is required and cannot be empty.'
        : null
}
