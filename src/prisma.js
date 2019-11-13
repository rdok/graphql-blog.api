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

const updatePost = async (id, data) => {
    return await prisma.mutation.updatePost(
        {
            where: { id: id},
            data: {...data},
        },
        ' { id published } '
    )
}

updatePost('ck2x1ivkd00ia0719vrizznms', { published: false}).then((data) => {
    console.log(data)
})


const createPostForUser = async (authorId, data) => {
    return await prisma.mutation.createPost(
        {data: {...data, author: {connect: {id: authorId}}}},
        ' { id title } '
    )
}
