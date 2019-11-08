import { User } from './dataSources/user'
import { currentUserResolver } from './dataSources/currentUser'
import { Post } from './dataSources/post'
import { Comment } from './dataSources/comment'

const resolvers = {
    Query: {
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
    },
    Mutation: {
        createUser(_, args, { dataSources }) {
            return dataSources().blogAPI().users.create(args.input)
        },
        deleteUser(_, args, { dataSources }) {
            return dataSources().blogAPI().users.delete(args)
        },
        createPost(_, args, { dataSources }) {
            return dataSources().blogAPI().posts.create(args.input)
        },
        deletePost(_, args, { dataSources }) {
            return dataSources().blogAPI().posts.delete(args)
        },
        createComment(_, args, { dataSources }) {
            return dataSources().blogAPI().comments.create(args.input)
        },
        deleteComment(_, args, { dataSources }) {
            return dataSources().blogAPI().comments.delete(args)
        },
    },
    Post: {
        author(post, _, { dataSources }) {
            return dataSources().blogAPI().users.find(post.author)
        },
        comments(post, _, { dataSources }) {
            return dataSources().blogAPI().comments.getByPostId(post.id)
        },
    },
    User: {
        posts(user, _, { dataSources }) {
            return dataSources().blogAPI().posts.getByAuthorId(user.id)
        },
        comments(user, _, { dataSources }) {
            return dataSources().blogAPI().comments.getByAuthorId(user.id)
        },
    },
    Comment: {
        author(comment, _, { dataSources }) {
            return dataSources().blogAPI().users.find(comment.author)
        },
        post(comment, _, { dataSources }) {
            return dataSources().blogAPI().posts.find(comment.post)
        },
    },
}

export { resolvers }