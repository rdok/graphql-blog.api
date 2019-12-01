import prisma from "../../src/prisma";

beforeEach(async () => {
    await prisma.mutation.deleteManyUsers()
})

beforeEach(async () => {
    await prisma.mutation.deleteManyUsers()
})

