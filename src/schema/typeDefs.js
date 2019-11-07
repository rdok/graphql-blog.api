import { custom } from './custom'
import { query } from './query'
import { mutation } from './mutation'

const typeDefs = query + custom + mutation

export { typeDefs }