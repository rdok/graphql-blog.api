const users = [
    { id: '1', name: 'nameValue', email: 'email', age: 60, posts: ['2050'] },
    { id: '2', name: 'nameValue2', email: 'emailValue2', age: 30, posts: ['2049', '2048'] },
    { id: '3', name: 'nameValue3', email: 'emailValue3', age: 35, posts: [] },
]

const posts = [
    { id: '2050', 'author': '1', title: 'NextGen2', body: 'Description Value2', published: false },
    { id: '2049', 'author': '2', title: 'PrevGen', body: 'Description Value', published: true },
    { id: '2048', 'author': '2', title: 'PrevGen3', body: 'Description Value3', published: true },
    { id: '2047', 'author': '2', title: 'PrevGen3', body: 'Description Value3', published: true },
]

const comments = [
    { id: '20', author: '2', post: '2048', text: 'Interplanetary space is the space around the Sun and planets of the Solar System. ' },
    { id: '25', author: '2', post: '2048', text: 'Interstellar space is the physical space within a galaxy not occupied by stars or their planetary systems. ' },
    { id: '10', author: '2', post: '2049', text: 'On Earth, space begins at the Kármán line (100 km above sea level).' },
    { id: '5', author: '1', post: '2050', text: 'Space, also known as outer space, is the near-vacuum between celestial bodies.' },
    { id: '15', author: '1', post: '2050', text: 'eospace is the region of outer space near Earth. ' },
    { id: '35', author: '3', post: '2047', text: '3eospace is the region of outer space near Earth. ' },
]

const db = { users, posts, comments }

export { db }