const Subscription = {
    comment: {
        subscribe(_, __, { commentEvent }) {
            return commentEvent.openChannel()
        }
    },
    post: {
        subscribe(_, __, { postEvent }) {
            return postEvent.openChannel()
        }
    },
}

export { Subscription as default }