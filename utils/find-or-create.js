/**
 * @param {import('mongoose').Model} Model
 * @param {object} filterOrCreate
 * @returns Mongoose Model
 */
async function findOrCreate(Model, filterOrCreate = { id: 0 }) {
  const model = await Model.findOne(filterOrCreate);
  return (!model) ? await Model.create(filterOrCreate) : model;
}

module.exports = findOrCreate;
