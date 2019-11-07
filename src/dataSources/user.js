class User {
    static create(attributes) {
        return {
            id: '1',
            name: attributes.name,
            email: attributes.email,
        }
    }
    static all(query) {
        if (!query) { return data }

        return data.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase())
        })
    }

    static find(id) {
        return data.find((user) => { return user.id === id })
    }
}

export { User }

const data = [
    {
        id: '1',
        name: 'nameValue',
        email: 'emailValue',
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