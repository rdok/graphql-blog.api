const data = [
    { id: 2050, title: 'NextGen2', body: 'Description Value2', published: false, },
    { id: 2049, title: 'PrevGen', body: 'Description Value', published: true, }
]

class Post {
    static all(query) {
        if( ! query ) { return data }

        return data.filter((post) => {
            return post.title.toLowerCase().includes(query.toLowerCase())
            || post.body.toLowerCase().includes(query.toLowerCase())
        })
    }

    static find(id) {
        return data.find((post) => {
            return post.id === id
        })
    }
}

export { Post }

/**
let postsResolver = (args) => {
    if (!args.query) {
        return posts
    }

    return posts.filter((post) => {
        return post.name.toLowerCase().includes(args.query.toLowerCase())
    })
}

export { postsResolver }
*/