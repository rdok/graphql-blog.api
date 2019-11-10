const Subscription = {
    commentCreated: {
        subscribe(_, { postId }, { pubsub, dataSources }) {
            dataSources().blogAPI().posts.findOrFail(postId)

            return pubsub.asyncIterator(`commentCreated?postId=${postId}`)
        }
    },
    post: {
        subscribe(_, __, { postEvent }) {
            return postEvent.openChannel()
        }
    },
}

export { Subscription as default }