import {gql} from "apollo-boost";

const posts = gql`query { posts { id title body published author { id } } }`
const deletePost = gql`mutation ($id:ID!){ deletePost(id:$id) { id } }`
const createPost = gql`
    mutation($data:CreatePostInput!){
        createPost(data:$data)
        { id title body published author { id } }
    }`
const updatePost = gql`
    mutation ($id: ID!, $data:UpdatePostInput!) {
        updatePost(id:$id data: $data) { id title body published }
    }`

const users = gql`query { users { name email } }`
const loggedInUser = gql`query { loggedInUser { id name email } }`
const login = gql`mutation ($data:LoginInput!) {
    login(data: $data) { user { id } token }
}`
const createUser = gql` mutation($data:CreateUserInput!) {
    createUser(data: $data)
    {  user { id name email }  token }
} `

const createComment = gql` mutation($data:CreateCommentInput!) {
    createComment(data: $data) {  id text author { id } post { id } }
}`

const updateComment = gql` mutation ($id: ID!, $data:UpdateCommentInput!) {
    updateComment(id:$id data: $data) { id text author { id } post { id } }
} `
const comments = gql`query { comments { id text post { id } author { id } } }`
const deleteComment = gql`mutation ($id:ID!){ deleteComment(id:$id) { id } }`

const subscribeToComments = gql` subscription($postId:ID!) {
    comment(data: {
        mutationIn: [CREATED, UPDATED, DELETED]
        postId: $postId
    })
    { mutation node {id text author { id } post { id }}}
}`

export {
    createPost, posts, deletePost, updatePost,
    login, users, loggedInUser, createUser,
    comments, createComment, updateComment, deleteComment, subscribeToComments
}
