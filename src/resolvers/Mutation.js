const Mutation = {
    // #########################################################################
    // # User                                                                  #
    // #########################################################################
    createUser(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().users.create(data, info)
    },
    login(_, {data}, {dataSources}, info) {
        return dataSources().blogAPI().users.login(data)
    },
    updateUser(_, {data}, {dataSources, user}) {
        return dataSources().blogAPI().users.update({data, user})
    },
    deleteUser(_, __, {dataSources, user}) {
        return dataSources().blogAPI().users.delete(user)
    },

    // #########################################################################
    // # Post                                                                  #
    // #########################################################################
    createPost(_, {data}, {dataSources, user}, info) {
        return dataSources().blogAPI().posts.create({data, info, user})
    },
    updatePost(_, {id, data}, {dataSources, user},) {
        return dataSources().blogAPI().posts.update(id, {data, user})
    },
    deletePost(_, {id}, {dataSources, user}, info) {
        return dataSources().blogAPI().posts.delete({id, info, user})
    },

    // #########################################################################
    // # Comment                                                               #
    // #########################################################################
    createComment(_, {data}, {dataSources, user}, info) {
        return dataSources().blogAPI().comments.create({data, info, user})
    },
    updateComment(_, {id, data}, {dataSources, user}, info) {
        return dataSources().blogAPI().comments.update(id, {data, info, user})
    },
    deleteComment(_, {id}, {dataSources, user}, info) {
        return dataSources().blogAPI().comments.delete({id, info, user})
    },
}

export {Mutation as default}