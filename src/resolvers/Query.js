const Query = {
    users(_, {query}, {dataSources}, info) {
        return dataSources().blogAPI().users.index(query, info)
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
    posts(_, {query}, {dataSources, user, auth, app}, info) {
        return dataSources().blogAPI().posts.index(query, {info, auth, app})
    },
    comments(_, {query}, {dataSources}, info) {
        return dataSources().blogAPI().comments.index(query, info)
    }
}

export {Query as default}