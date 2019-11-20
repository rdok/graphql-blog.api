export default async function exists(data, args) {
    const [model, property] = args.split(',')

    const recordExists = await this.prisma.exists[model]({[property]: data})

    return recordExists ?
        null : `The selected value '${data}' does not exists.`
}
