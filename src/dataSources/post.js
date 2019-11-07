class Post {
    static all(query) {
        if (!query) { return data }

        const valueToFind = query.toLowerCase()

        return data.filter((post) => {
            return post.title.toLowerCase().includes(valueToFind)
                || post.body.toLowerCase().includes(valueToFind)
        })
    }

    static find(id) {
        return data.find((post) => { return post.id === id })
    }

    static getByUserId(id){
        return data.filter((post) => { return id === post.author })
    }
}

export { Post }

const data = [
    { id: '2050', title: 'NextGen2', body: 'Description Value2', published: false, 'author': '1' },
    { id: '2049', title: 'PrevGen', body: 'Description Value', published: true, 'author': '2' },
    { id: '2048', title: 'PrevGen3', body: 'Description Value3', published: true, 'author': '2' },
]