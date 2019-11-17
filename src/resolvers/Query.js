const Query = {
    users(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().users.all(data, info)
    },
    user(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().users.findByEmail(data.email, info)
    },
    post(_, __, {dataSources}) {
        return dataSources().blogAPI().posts.find(2050)
    },
    posts(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().posts.all(data, info)
    },
    comments(_, __, {dataSources}) {
        return dataSources().blogAPI().comments.all()
    }
}

export {Query as default}