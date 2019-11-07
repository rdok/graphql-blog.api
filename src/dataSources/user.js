const uuidv4 = require('uuid/v4')
import { UserValidator } from '../validators/user'

class User {
    static data = []

    static create(attributes) {
        UserValidator.validateCreation(attributes)

        const user = {
            id: uuidv4(),
            name: attributes.name,
            email: attributes.email,
        }

        User.data.push(user)

        return user
    }

    static findByEmail(email) {
        return User.data.find((user) => { return user.email === email })
    }

    static all(query) {
        if (!query) { return User.data }

        return User.data.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase())
        })
    }

    static find(id) {
        return User.data.find((user) => { return user.id === id })
    }
}

User.data = [
    {
        id: '1',
        name: 'nameValue',
        email: 'email',
        age: 60,
        posts: ['2050']
    },
    {
        id: '2',
        name: 'nameValue2',
        email: 'emailValue2',
        age: 30,
        posts: ['2049', '2048']
    }
]

export { User }