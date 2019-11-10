const Subscription = {
    commentCreated: {
        subscribe(_, { postId }, { pubsub, dataSources }) {
            dataSources().blogAPI().posts.findOrFail(postId)

            return pubsub.asyncIterator(`commentCreated?postId=${postId}`)
        }
    },
    postCreated: {
        subscribe(_, __, { pubsub }) {
            return pubsub.asyncIterator('postCreated')
        }
    }
}

export { Subscription as default }