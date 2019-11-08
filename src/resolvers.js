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
        deletePost(_, args) { return Post.delete(args) },
        createComment(_, args) { return Comment.create(args.input) },
        deleteComment(_, args) { return Comment.delete(args) },
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

export { resolvers }