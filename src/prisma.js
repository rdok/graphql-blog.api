import {Prisma} from "prisma-binding";
import {fragmentReplacements} from './resolvers'

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://prisma:4466",
    secret: process.env.PRISMA_CLOUD_SESSION_KEY,
    fragmentReplacements
})

export {prisma as default}
