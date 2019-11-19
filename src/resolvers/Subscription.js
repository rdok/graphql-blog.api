const Subscription = {
    comment: {
        subscribe(_, {data}, {prisma}, info) {
            let subscriptionInput = {where: {}}

            if (data.postId) {
                subscriptionInput.where.node = {post: {id: data.postId}}
            }
            if (data.mutationIn) {
                subscriptionInput.where.mutation_in = data.mutationIn
            }

            return prisma.subscription.comment(subscriptionInput, info)
        }
    },
    post: {
        subscribe(_, __, {prisma}, info) {
            return prisma.subscription.post({
                where: {node: {published: true}}
            }, info)
        }
    },
}

export {Subscription as default}