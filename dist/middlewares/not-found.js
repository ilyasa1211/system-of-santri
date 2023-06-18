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
const errors_1 = require("../traits/errors");
exports.default = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    return next(new errors_1.NotFoundError("We are sorry for the trouble. The requested URL appears to be unavailable. Please verify the URL's accuracy by checking it twice. If you think this is a mistake, please get in touch with the relevant support staff or administrator for more information. "));
});
