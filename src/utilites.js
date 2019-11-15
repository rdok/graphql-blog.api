/**
 *
 * @param {{}} object
 * @param {array} props
 * @returns {{}} response
 */
function onlyPick(object, props) {
    if (!object || !props) throw new Error(`Object and props are required.`);

    let response = {}

    props.forEach(function (property) {
        if (property in object) {
            response[property] = object[property]
        }
    })

    return response
}

export {onlyPick}