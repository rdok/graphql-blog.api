import {Prisma} from "prisma-binding";
import {fragmentReplacements} from './resolvers'

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://prisma:4466",
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
})

export {prisma as default}
