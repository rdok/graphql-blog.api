const data = [{ id: '1', name: 'nameValue', email: 'emailValue', age: 60 }, { id: '2', name: 'nameValue2', email: 'emailValue2', age: 30 }]

class User {
    static all(query) {
        if (!query) { return data }

        return data.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase())
        })
    }
}

export { User }