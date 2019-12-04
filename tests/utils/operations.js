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

const comments = gql`query { comments { id text post { id } author { id } } }`

export {
    createPost, posts, deletePost, updatePost,
    login, users, loggedInUser, createUser,
    comments
}
