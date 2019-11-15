const Mutation = {
    createUser(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().users.create(data, info)
    },
    updateUser(_, {id, data}, {dataSources}) {
        return dataSources().blogAPI().users.update(id, data)
    },
    deleteUser(_, {id}, {dataSources}) {
        return dataSources().blogAPI().users.delete(id)
    },
    createPost(_, args, {dataSources}) {
        return dataSources().blogAPI().posts.create(args.data)
    },
    updatePost(_, {id, data}, {dataSources}) {
        return dataSources().blogAPI().posts.update(id, data)
    },
    deletePost(_, args, {dataSources}) {
        return dataSources().blogAPI().posts.delete(args)
    },
    createComment(_, args, {dataSources}) {
        return dataSources().blogAPI().comments.create(args.data)
    },
    updateComment(_, {id, data}, {dataSources}) {
        return dataSources().blogAPI().comments.update(id, data)
    },
    deleteComment(_, args, {dataSources}) {
        return dataSources().blogAPI().comments.delete(args)
    },
}

export {Mutation as default}