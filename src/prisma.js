import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://localhost:4466"
})

// prisma.query.users(null, '{ id name posts { id title  } }')
//     .then((data) => {
//        console.log(JSON.stringify(data, undefined, 2))
//     })
//
// prisma.query.comments(null, '{ id text author { id email  } post { id title } }')
//     .then((data) => {
//         console.log(JSON.stringify(data, undefined, 2))
//     })


const existsPost = async (filter) => {
    return await prisma.exists.Post(filter)
}


const updatePost = async (id, data) => {
    const postExists = await prisma.exists.Post({id: id})

    if (!postExists) {
        throw new Error('Post id not found')
    }

    return await prisma.mutation.updatePost(
        {
            where: {id: id},
            data: {...data},
        },
        ' { id published author { id name posts { id title published } } } '
    )
}


const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({id: authorId})

    if (!userExists) {
        throw new Error('User id not found')
    }

    return await prisma.mutation.createPost(
        {data: {...data, author: {connect: {id: authorId}}}},
        ' { id title } '
    )
}

// createPostForUser('invalid-user-id', {})
//     .catch((error) => {
//        console.log(error)
//     })
// updatePost('ck2x1ivkd00ia0719vrizznms', {published: false}).then((data) => {
//     console.log(data)
// })

// updatePost('invalid', {published: false}).catch((error) => {
//     console.log(error)
// })

// updatePost('ck2yba25n00eh071973acshf0', {published: true}).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

// existsPost({
//     title: "postTitle",
//     author: {id: "ck2x0awft00ak0719kps1l2ly"}
// }).then((data) => {
//     console.log(`Exists: ${data}`)
// })
