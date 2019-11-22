const Query = {
    users(_, args, {dataSources}, info) {
        return dataSources().blogAPI().users.index(args, info)
    },
    user(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().users.show(data.email, info)
    },
    loggedInUser(_, {data}, {dataSources, user}, info) {
        return dataSources().blogAPI().users.show(user.email, info)
    },
    post(_, {data}, {dataSources, app}, info) {
        return dataSources().blogAPI().posts.show(data.id, {app}, info)
    },
    posts(_, args, {dataSources, user, auth, app}, info) {
        return dataSources().blogAPI().posts.index(args, {auth, app}, info)
    },
    comments(_, args, {dataSources, meta}, info) {
        return dataSources().blogAPI().comments.index(args, info)
    }
}

export {Query as default}