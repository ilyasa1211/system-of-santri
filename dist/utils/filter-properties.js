"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function filterProperties(model, filter, override) {
    const filteredModel = {};
    filter.forEach((prop) => {
        var _a;
        filteredModel[prop] = (_a = override[prop]) !== null && _a !== void 0 ? _a : model[prop];
    });
    return filteredModel;
}
exports.default = filterProperties;
