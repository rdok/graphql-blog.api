export default async function hasRelation(primaryValue, args) {
    let [type, primaryField, relationType, relationField, relationValue] =
        args.split(',')

    if (!primaryValue) {
        return null
    }

    if (relationField === 'true') {
        relationField = true
    }

    const recordExists = await this.prisma.query[type]({
        where: {
            AND: [
                {[primaryField]: primaryValue},
                {
                    [relationType]: {
                        [relationField]: relationValue
                    }
                }
            ]
        }
    })

    return recordExists.length > 0
        ? null
        : `Could not find type '${type}' with '${primaryField}=${primaryValue}'`
        + ` and '${relationType}.${relationField}=${relationValue}`
}
