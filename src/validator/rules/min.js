export default function min(data, minimumLength) {
    return (typeof data === 'undefined' || data.length < minimumLength)
        ? `The selected field value must be of minimum length '${minimumLength}'.`
        : null
}
