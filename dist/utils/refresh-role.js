"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(model, method) {
    return __awaiter(this, void 0, void 0, function* () {
        const roleExist = yield model.exists({ id: 1 });
        if (!roleExist) {
            ["admin", "manager", "santri"].forEach((name, index) => __awaiter(this, void 0, void 0, function* () { return yield method(model, { id: +index + 1, name }); }));
        }
    });
}
exports.default = default_1;
;
