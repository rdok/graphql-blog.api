import { GraphQLServer } from 'graphql-yoga'

import { typeDefs } from './typeDefs'
import { User } from './dataSources/user'
import { currentUserResolver } from './dataSources/currentUser'
import { Post } from './dataSources/post'

const resolvers = {
    Query: {
        users(_, args) { return User.all(args.query) },
        currentUser() { return currentUserResolver() },
        post() { return Post.find(2050) },
        posts(_, args) { return Post.all(args.query) },
    },
    Post: { author(post) { return User.find(post.author) } },
    User: { posts(user) { return Post.getByIds(user.posts) } }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on http://localhost:4000'))