export default async function unique(data, args) {
    const [model, property, except, exceptProperty, expectValue] = args.split(',')

    const record = await this.prisma.query[model]({
        where: {[property]: data}
    })

    let error = null

    if (record) {
        if (!except || record[exceptProperty] !== expectValue) {
            error = `The selected value is taken.`
        }
    }

    return error
}
