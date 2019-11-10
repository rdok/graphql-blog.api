const Subscription = {
    comment: {
        subscribe(_, { postId }, { commentEvent }) {
            return commentEvent.openChannel(postId)
        }
    },
    post: {
        subscribe(_, __, { postEvent }) {
            return postEvent.openChannel()
        }
    },
}

export { Subscription as default }