"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../errors");
const verifyEmail_1 = __importDefault(require("../verifyEmail"));
async function localVerifyEmail(payload, options) {
    const { collection: collectionSlug, token, } = options;
    const req = {
        payload,
    };
    const collection = payload.collections[collectionSlug];
    if (!collection) {
        throw new errors_1.APIError(`The collection with slug ${String(collectionSlug)} can't be found. Verify Email Operation.`);
    }
    return (0, verifyEmail_1.default)({
        req,
        token,
        collection,
    });
}
exports.default = localVerifyEmail;
//# sourceMappingURL=verifyEmail.js.map