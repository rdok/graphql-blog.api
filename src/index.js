import { GraphQLServer } from 'graphql-yoga'
import { resolvers } from './resolvers'
import { db } from './db'
import { User } from './dataSources/user'
import { Post } from './dataSources/post'
import { Comment } from './dataSources/comment'

const dataSources = () => ({
    blogAPI: () => ({
        users: new User({ db }),
        posts: new Post({ db }),
        comments: new Comment({ db }),
    })
})

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { dataSources }
})

server.start(() => console.log('Server is running on http://localhost:4000'))