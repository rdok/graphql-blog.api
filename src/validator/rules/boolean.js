export default function boolean(data) {
    return typeof data !== 'boolean'
        ? 'Must be of boolean type.'
        : null
}
