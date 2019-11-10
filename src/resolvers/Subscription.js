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
    }
}

export { Subscription as default }