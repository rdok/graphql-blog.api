export default async function existsWith(data, args) {
    let [model, primaryColumn, secondaryColumn, secondaryValue] =
        args.split(',')

    if (!data) {
        return null
    }

    if (secondaryValue === 'true') {
        secondaryValue = true
    }

    const recordExists = await this.prisma.query[model]({
        where: {
            AND: [
                {[primaryColumn]: data},
                {[secondaryColumn]: secondaryValue}
            ]
        }
    })

    return recordExists.length > 0
        ? null
        : `Could not find record with '${primaryColumn}=${data} and `
        + `'${secondaryColumn}=${secondaryValue}`
}
