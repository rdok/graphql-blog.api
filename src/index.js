import { GraphQLServer } from 'graphql-yoga'

import { typeDefs } from './typeDefs'
import { User } from './dataSources/user'
import { currentUserResolver } from './dataSources/currentUser'
import { Post } from './dataSources/post'
import { Comment } from './dataSources/comment'

const resolvers = {
    Query: {
        users(_, args) { return User.all(args.query) },
        currentUser() { return currentUserResolver() },
        post() { return Post.find(2050) },
        posts(_, args) { return Post.all(args.query) },
        comments() { return Comment.all() }
    },
    Post: { author(post) { return User.find(post.author) } },
    User: {
        posts(user) { return Post.getByUserId(user.id) },
        comments(user) { return Comment.getByUserId(user.id) },
    },
    Comment: { author(comment) { return User.find(comment.author) } },
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on http://localhost:4000'))