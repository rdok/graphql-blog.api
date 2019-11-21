import Query from '../resolvers/Query'
import Mutation from '../resolvers/Mutation'
import Subscription from '../resolvers/Subscription'
import User from '../resolvers/User'

const authMiddleware = {Query: {}}
Object.keys(Query).forEach((key) => {
    authMiddleware.Query[key] = login
})

delete authMiddleware.Query.users
delete authMiddleware.Query.posts
delete authMiddleware.Query.comments

authMiddleware.Mutation = {}
Object.keys(Mutation).forEach((key) => {
    authMiddleware.Mutation[key] = login
})

delete authMiddleware.Mutation.login
delete authMiddleware.Mutation.createUser

authMiddleware.Subscription = {}
Object.keys(Subscription).forEach((key) => {
    authMiddleware.Subscription[key] = login
})

authMiddleware.User = {}
Object.keys(User).forEach((key) => {
    authMiddleware.User[key] = login
})

console.log(authMiddleware.User)
async function login(resolve, parent, args, context, info) {
    const {auth, app} = context

    context.user = await auth.userOrFail(app)

    return resolve(parent, args, context, info)
}

export default authMiddleware
