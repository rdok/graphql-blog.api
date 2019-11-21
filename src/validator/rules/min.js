export default function min(data, minimumLength) {
    return (typeof data === 'undefined' || data.length < minimumLength)
        ? `This field value must be of minimum length '${minimumLength}'.`
        : null
}
