const Mutation = {
    createUser(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().users.create(data, info)
    },
    login(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().users.login(data)
    },
    updateUser(_, {id, data}, {dataSources}) {
        return dataSources().blogAPI().users.update(id, data)
    },
    deleteUser(_, {id}, {dataSources}) {
        return dataSources().blogAPI().users.delete(id)
    },
    createPost(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().posts.create(data, info)
    },
    updatePost(_, {id, data}, {dataSources}, info) {
        return dataSources().blogAPI().posts.update(id, data, info)
    },
    deletePost(_, {id}, {dataSources}, info) {
        return dataSources().blogAPI().posts.delete(id, info)
    },
    createComment(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().comments.create(data, info)
    },
    updateComment(_, {id, data}, {dataSources}, info) {
        return dataSources().blogAPI().comments.update(id, data, info)
    },
    deleteComment(_, {id}, {dataSources}, info) {
        return dataSources().blogAPI().comments.delete(id, info)
    },
}

export {Mutation as default}