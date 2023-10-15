export default async function (model, method) {
    const year = new Date().getFullYear();
    await method(model, { year });
}
