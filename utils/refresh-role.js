
module.exports = async function (Model, method) {
    const roleExist = await Model.exists({ id: 1 })
    if (!roleExist) ['admin', 'manager', 'santri'].forEach(async (name, index) => await method(Model, { id: +index + 1, name }))
}
