"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forgotPassword_1 = __importDefault(require("../forgotPassword"));
const dataloader_1 = require("../../../collections/dataloader");
const init_1 = require("../../../translations/init");
const errors_1 = require("../../../errors");
const setRequestContext_1 = require("../../../express/setRequestContext");
async function localForgotPassword(payload, options) {
    const { collection: collectionSlug, data, expiration, disableEmail, req = {}, } = options;
    (0, setRequestContext_1.setRequestContext)(options.req);
    const collection = payload.collections[collectionSlug];
    if (!collection) {
        throw new errors_1.APIError(`The collection with slug ${String(collectionSlug)} can't be found. Forgot Password Operation.`);
    }
    req.payloadAPI = req.payloadAPI || 'local';
    req.payload = payload;
    req.i18n = (0, init_1.i18nInit)(payload.config.i18n);
    if (!req.t)
        req.t = req.i18n.t;
    if (!req.payloadDataLoader)
        req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
    return (0, forgotPassword_1.default)({
        data,
        collection,
        disableEmail,
        expiration,
        req,
    });
}
exports.default = localForgotPassword;
//# sourceMappingURL=forgotPassword.js.map