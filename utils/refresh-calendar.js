module.exports = async function (Model, method) {
    const year = new Date().getFullYear()
    await method(Model, { year })
}
