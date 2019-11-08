import { currentUserResolver } from '../dataSources/currentUser'

const Query = {
    users(_, args, { dataSources }) {
        return dataSources().blogAPI().users.all(args.query)
    },
    currentUser() { return currentUserResolver() },
    post(_, __, { dataSources }) {
        return dataSources().blogAPI().posts.find(2050)
    },
    posts(_, args, { dataSources }) {
        return dataSources().blogAPI().posts.all(args.query)
    },
    comments(_, __, { dataSources }) {
        return dataSources().blogAPI().comments.all()
    }
}

export { Query as default }