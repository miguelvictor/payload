"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataloader_1 = require("../../dataloader");
const restoreVersion_1 = __importDefault(require("../restoreVersion"));
const init_1 = require("../../../translations/init");
const errors_1 = require("../../../errors");
const setRequestContext_1 = require("../../../express/setRequestContext");
async function restoreVersionLocal(payload, options) {
    var _a;
    const { collection: collectionSlug, depth, locale = payload.config.localization ? (_a = payload.config.localization) === null || _a === void 0 ? void 0 : _a.defaultLocale : null, fallbackLocale = null, id, user, overrideAccess = true, showHiddenFields, context, } = options;
    const collection = payload.collections[collectionSlug];
    if (!collection) {
        throw new errors_1.APIError(`The collection with slug ${String(collectionSlug)} can't be found. Restore Version Operation.`);
    }
    const i18n = (0, init_1.i18nInit)(payload.config.i18n);
    const req = {
        user,
        payloadAPI: 'local',
        locale,
        fallbackLocale,
        payload,
        i18n,
        t: i18n.t,
    };
    (0, setRequestContext_1.setRequestContext)(req, context);
    if (!req.payloadDataLoader)
        req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
    const args = {
        payload,
        depth,
        collection,
        overrideAccess,
        id,
        showHiddenFields,
        req,
    };
    return (0, restoreVersion_1.default)(args);
}
exports.default = restoreVersionLocal;
//# sourceMappingURL=restoreVersion.js.map