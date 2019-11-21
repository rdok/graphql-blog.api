const User = {
    email: {
        // this is not really required, as the auth middleware inject the logged
        // in user. Still worth adding for fragment demonstration purposes.
        resolve(parent, args, {user}, info) {
            const emailOwnedByLoggedInUser = user && user.email === parent.email

            return emailOwnedByLoggedInUser ? user.email : null
        }
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