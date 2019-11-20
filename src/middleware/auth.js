import Query from '../resolvers/Query'
import Mutation from '../resolvers/Mutation'
import Subscription from '../resolvers/Subscription'

const authMiddleware = {Query: {}}
Object.keys(Query).forEach((key) => {
    authMiddleware.Query[key] = login
})

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

async function login(resolve, parent, args, context, info) {
    const {auth, app} = context

    if (!app.connection) {
        context.user = await auth.login(app)
    }

    return resolve(parent, args, context, info)
}

export default authMiddleware
