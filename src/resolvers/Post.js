const Post = {
    author(post, _, { dataSources }) {
        return dataSources().blogAPI().users.find(post.author)
    },
    comments(post, _, { dataSources }) {
        return dataSources().blogAPI().comments.getByPostId(post.id)
    },
}

export { Post as default }