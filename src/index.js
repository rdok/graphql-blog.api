import { GraphQLServer } from 'graphql-yoga'

import { typeDefs } from './schema/typeDefs'
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
    Mutation: {
        createUser(_, args) { return User.create(args.input) },
        deleteUser(_, args) { return User.delete(args) },
        createPost(_, args) { return Post.create(args.input) },
        createComment(_, args) { return Comment.create(args.input) },
    },
    Post: {
        author(post) { return User.find(post.author) },
        comments(post) { return Comment.getByPostId(post.id) },
    },
    User: {
        posts(user) { return Post.getByAuthorId(user.id) },
        comments(user) { return Comment.getByAuthorId(user.id) },
    },
    Comment: {
        author(comment) { return User.find(comment.author) },
        post(comment) { return Post.find(comment.post) },
    },
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on http://localhost:4000'))