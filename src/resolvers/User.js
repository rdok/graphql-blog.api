const User = {
    email(parent, args, {user}) {
        const ownedByUser = user && user.email === parent.email

        return ownedByUser ? user.email : null
    },
    posts: {
        fragment: 'fragment AuthorId on User { id }',
        resolve({id}, __, {prisma, user}, info) {
            const authorId = id
            const query = {where: {OR: [{published: true},]}};

            if (user && user.id === authorId) {
                query.where.OR.push({author: {id: user.id}})
            }

            return prisma.query.posts(query, info)
        }
    }
}

export {User as default}