const Subscription = {
    comment: {
        async subscribe(_, {data}, {validator, prisma}, info) {
            let subscriptionInput = {where: {}}

            await validator.validate(data, {
                postId: 'exists:Post,id',
            })

            if (data.postId) {
                subscriptionInput.where.node = {post: {id: data.postId}}
            }
            if (data.mutationIn) {
                subscriptionInput.where.mutation_in = data.mutationIn
            }

            return prisma.subscription.comment(subscriptionInput, info)
        }
    },
    loggedInUserComments: {
        subscribe(_, __, {prisma, user}, info) {
            return prisma.subscription.comment({
                where: {node: {author: {id: user.id}}}
            }, info)
        }
    },
    post: {
        subscribe(_, __, {prisma}, info) {
            return prisma.subscription.post({
                where: {node: {published: true}}
            }, info)
        }
    },
    loggedInUserPosts: {
        subscribe(_, __, {prisma, user}, info) {
            return prisma.subscription.post({
                where: {node: {author: {id: user.id}}}
            }, info)
        }
    }
}

export {Subscription as default}