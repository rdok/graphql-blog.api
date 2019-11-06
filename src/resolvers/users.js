import users from '../dataSources/users'

let usersResolver = (args) => {
    if (!args.query) {
        return users
    }

    return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
    })
}

export { usersResolver }