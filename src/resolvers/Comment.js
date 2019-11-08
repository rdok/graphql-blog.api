const Comment = {
    author(comment, _, { dataSources }) {
        return dataSources().blogAPI().users.find(comment.author)
    },
    post(comment, _, { dataSources }) {
        return dataSources().blogAPI().posts.find(comment.post)
    },
}

export { Comment as default }