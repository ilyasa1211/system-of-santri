"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseStyle = void 0;
class CaseStyle {
    constructor(input, divider = " ", joinWith = null) {
        this._input = input;
        this._divider = divider;
        this._joinWith = joinWith;
    }
    toCamelCase() {
        var _a;
        return this._input
            .split(this._divider)
            .map((input, index) => {
            return index === 0 ? input : input[0].toUpperCase() + input.slice(1);
        })
            .join((_a = this._joinWith) !== null && _a !== void 0 ? _a : "");
    }
    toPascalCase() {
        var _a;
        return this._input
            .split(this._divider)
            .map((input) => input.toUpperCase())
            .join((_a = this._joinWith) !== null && _a !== void 0 ? _a : "");
    }
    toSnakeCase() {
        var _a;
        return this._input
            .split(this._divider)
            .map((input) => input.toLowerCase())
            .join((_a = this._joinWith) !== null && _a !== void 0 ? _a : "_");
    }
}
exports.CaseStyle = CaseStyle;
