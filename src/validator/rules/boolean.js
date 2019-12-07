export default function boolean(data) {
    switch (typeof data) {
        case 'undefined':
        case 'boolean':
            return null
        default:
            return 'Mut be of boolean type'
    }
}

