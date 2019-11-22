import Query from '../resolvers/Query'
import Mutation from '../resolvers/Mutation'
import Subscription from '../resolvers/Subscription'
import User from '../resolvers/User'

const authMiddleware = {Query: {}}
Object.keys(Query).forEach((key) => {
    authMiddleware.Query[key] = auth
})

delete authMiddleware.Query.users
delete authMiddleware.Query.posts
delete authMiddleware.Query.comments

authMiddleware.Mutation = {}
Object.keys(Mutation).forEach((key) => {
    authMiddleware.Mutation[key] = auth
})

delete authMiddleware.Mutation.login
delete authMiddleware.Mutation.createUser

authMiddleware.Subscription = {}
Object.keys(Subscription).forEach((key) => {
    authMiddleware.Subscription[key] = auth
})

async function auth(resolve, root, args, context, info) {

    if (typeof context.user === 'undefined') {
        const {auth, app} = context
        context.user = await auth.userOrFail(app)
    }

    return resolve(root, args, context, info)
}

export default authMiddleware
