module.exports = function trimAllBody (reqBody) {
    for (const [key, value] of Object.entries(reqBody.body)) {
        reqBody.body[key] = value.trim()
    }
}
