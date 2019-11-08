const Mutation = {
    createUser(_, args, { dataSources }) {
        return dataSources().blogAPI().users.create(args.input)
    },
    deleteUser(_, args, { dataSources }) {
        return dataSources().blogAPI().users.delete(args)
    },
    createPost(_, args, { dataSources }) {
        return dataSources().blogAPI().posts.create(args.input)
    },
    deletePost(_, args, { dataSources }) {
        return dataSources().blogAPI().posts.delete(args)
    },
    createComment(_, args, { dataSources }) {
        return dataSources().blogAPI().comments.create(args.input)
    },
    deleteComment(_, args, { dataSources }) {
        return dataSources().blogAPI().comments.delete(args)
    },
}

export { Mutation as default }