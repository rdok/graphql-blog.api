class Comment {
    static all() { return data }

    static getByAuthorId(id){
        return data.filter((comment) => { return id === comment.author })
    }

    static getByPostId(id){
        return data.filter((comment) => { return id === comment.post })
    }
}

export { Comment }

const data = [
    { id: '5', author: '1', post: '2050', text: 'Space, also known as outer space, is the near-vacuum between celestial bodies.' },
    { id: '10', author: '1', post: '2049', text: 'On Earth, space begins at the Kármán line (100 km above sea level).' },
    { id: '15', author: '1', post: '2050', text: 'eospace is the region of outer space near Earth. ' },
    { id: '20', author: '2', post: '2048', text: 'Interplanetary space is the space around the Sun and planets of the Solar System. ' },
    { id: '25', author: '2', post: '2048', text: 'Interstellar space is the physical space within a galaxy not occupied by stars or their planetary systems. ' },
]