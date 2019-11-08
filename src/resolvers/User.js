const User = {
    posts(user, _, { dataSources }) {
        return dataSources().blogAPI().posts.getByAuthorId(user.id)
    },
    comments(user, _, { dataSources }) {
        return dataSources().blogAPI().comments.getByAuthorId(user.id)
    },
}

export { User as default }