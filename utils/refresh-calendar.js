

module.exports = async function (Model, method) {
    const currentYear = new Date().getFullYear()
    const calendar = await method(Model, { id: 0 })
    if (calendar.year !== currentYear) {
        await Model.deleteMany()
        await Model.create({ id: 0 })
    }
}
