const Post = {
    author(post, _, { dataSources }, info) {
        console.log(post)
        return dataSources().blogAPI().users.find(post.author.id, info)
    },
    comments(post, _, { dataSources }) {
        return dataSources().blogAPI().comments.getByPostId(post.id)
    },
}

export { Post as default }