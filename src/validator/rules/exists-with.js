export default async function existsWith(primaryValue, args) {
    let [type, primaryField, secondaryField, secondaryValue] =
        args.split(',')

    if (!primaryValue) {
        return null
    }

    if (secondaryValue === 'true') {
        secondaryValue = true
    }

    const recordExists = await this.prisma.query[type]({
        where: {
            AND: [
                {[primaryField]: primaryValue},
                {[secondaryField]: secondaryValue}
            ]
        }
    })

    return recordExists.length > 0
        ? null
        : `Could not find type '${type}' with '${primaryField}=${primaryValue}'`
        + ` and '${secondaryField}=${secondaryValue}'`
}
