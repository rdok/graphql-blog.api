const Subscription = {
    counter: {
        subscribe(_, __, { pubsub }) {
            let count = 0

            setInterval(() => {
                count++
                pubsub.publish('counter', {
                    counter: count
                })
            }, 2000)

            return pubsub.asyncIterator('counter')
        }
    },
    commentCreated: {
        subscribe(_, { postId }, { pubsub, dataSources }) {
            dataSources().blogAPI().posts.findOrFail(postId)

            return pubsub.asyncIterator(`commentCreated?postId=${postId}`)
        }
    }
}

export { Subscription as default }