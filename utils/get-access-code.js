const { NotFoundError } = require("../errors");

module.exports = async function (Model) {
  const { value } = await Model.findOne({ key: "access_code" });
  if (!value) {
    throw new NotFoundError(
      "The Access Code configuration could not be found by the system. Please check your settings once more and try again.",
    );
  }
  return value;
};
