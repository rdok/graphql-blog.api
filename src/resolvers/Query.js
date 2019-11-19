const Query = {
    users(_, {query}, {dataSources}, info) {
        return dataSources().blogAPI().users.all(query, info)
    },
    user(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().users.findByEmail(data.email, info)
    },
    post(_, __, {dataSources}) {
        return dataSources().blogAPI().posts.find(2050)
    },
    posts(_, {query}, {dataSources}, info) {
        return dataSources().blogAPI().posts.all(query, info)
    },
    comments(_, {query}, {dataSources}, info) {
        return dataSources().blogAPI().comments.all(query, info)
    }
}

export {Query as default}