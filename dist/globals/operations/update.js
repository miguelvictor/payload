"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const executeAccess_1 = __importDefault(require("../../auth/executeAccess"));
const beforeChange_1 = require("../../fields/hooks/beforeChange");
const beforeValidate_1 = require("../../fields/hooks/beforeValidate");
const afterChange_1 = require("../../fields/hooks/afterChange");
const afterRead_1 = require("../../fields/hooks/afterRead");
const saveVersion_1 = require("../../versions/saveVersion");
const getLatestGlobalVersion_1 = require("../../versions/getLatestGlobalVersion");
const initTransaction_1 = require("../../utilities/initTransaction");
const killTransaction_1 = require("../../utilities/killTransaction");
async function update(args) {
    var _a;
    const { globalConfig, slug, req, req: { payload, locale, }, depth, overrideAccess, showHiddenFields, draft: draftArg, autosave, } = args;
    try {
        const shouldCommit = await (0, initTransaction_1.initTransaction)(req);
        let { data } = args;
        const shouldSaveDraft = Boolean(draftArg && ((_a = globalConfig.versions) === null || _a === void 0 ? void 0 : _a.drafts));
        // /////////////////////////////////////
        // 1. Retrieve and execute access
        // /////////////////////////////////////
        const accessResults = !overrideAccess ? await (0, executeAccess_1.default)({
            req,
            data,
        }, globalConfig.access.update) : true;
        // /////////////////////////////////////
        // Retrieve document
        // /////////////////////////////////////
        const query = overrideAccess ? undefined : accessResults;
        // /////////////////////////////////////
        // 2. Retrieve document
        // /////////////////////////////////////
        const { global, globalExists, } = await (0, getLatestGlobalVersion_1.getLatestGlobalVersion)({
            payload,
            config: globalConfig,
            slug,
            where: query,
            locale,
            req,
        });
        let globalJSON = {};
        if (global) {
            globalJSON = JSON.parse(JSON.stringify(global));
            if (globalJSON._id) {
                delete globalJSON._id;
            }
        }
        const originalDoc = await (0, afterRead_1.afterRead)({
            depth: 0,
            doc: globalJSON,
            entityConfig: globalConfig,
            req,
            overrideAccess: true,
            showHiddenFields,
            context: req.context,
        });
        // /////////////////////////////////////
        // beforeValidate - Fields
        // /////////////////////////////////////
        data = await (0, beforeValidate_1.beforeValidate)({
            data,
            doc: originalDoc,
            entityConfig: globalConfig,
            operation: 'update',
            overrideAccess,
            req,
            context: req.context,
        });
        // /////////////////////////////////////
        // beforeValidate - Global
        // /////////////////////////////////////
        await globalConfig.hooks.beforeValidate.reduce(async (priorHook, hook) => {
            await priorHook;
            data = (await hook({
                data,
                req,
                originalDoc,
            })) || data;
        }, Promise.resolve());
        // /////////////////////////////////////
        // beforeChange - Global
        // /////////////////////////////////////
        await globalConfig.hooks.beforeChange.reduce(async (priorHook, hook) => {
            await priorHook;
            data = (await hook({
                data,
                req,
                originalDoc,
            })) || data;
        }, Promise.resolve());
        // /////////////////////////////////////
        // beforeChange - Fields
        // /////////////////////////////////////
        let result = await (0, beforeChange_1.beforeChange)({
            data,
            doc: originalDoc,
            docWithLocales: globalJSON,
            entityConfig: globalConfig,
            operation: 'update',
            req,
            skipValidation: shouldSaveDraft,
            context: req.context,
        });
        // /////////////////////////////////////
        // Update
        // /////////////////////////////////////
        if (!shouldSaveDraft) {
            if (globalExists) {
                result = await payload.db.updateGlobal({
                    slug,
                    data: result,
                    req,
                });
            }
            else {
                result = await payload.db.createGlobal({
                    slug,
                    data: result,
                    req,
                });
            }
        }
        // /////////////////////////////////////
        // Create version
        // /////////////////////////////////////
        if (globalConfig.versions) {
            result = await (0, saveVersion_1.saveVersion)({
                payload,
                global: globalConfig,
                req,
                docWithLocales: {
                    ...result,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                },
                autosave,
                draft: shouldSaveDraft,
            });
        }
        // /////////////////////////////////////
        // afterRead - Fields
        // /////////////////////////////////////
        result = await (0, afterRead_1.afterRead)({
            depth,
            doc: result,
            entityConfig: globalConfig,
            req,
            overrideAccess,
            showHiddenFields,
            context: req.context,
        });
        // /////////////////////////////////////
        // afterRead - Global
        // /////////////////////////////////////
        await globalConfig.hooks.afterRead.reduce(async (priorHook, hook) => {
            await priorHook;
            result = await hook({
                doc: result,
                req,
            }) || result;
        }, Promise.resolve());
        // /////////////////////////////////////
        // afterChange - Fields
        // /////////////////////////////////////
        result = await (0, afterChange_1.afterChange)({
            data,
            doc: result,
            previousDoc: originalDoc,
            entityConfig: globalConfig,
            operation: 'update',
            req,
            context: req.context,
        });
        // /////////////////////////////////////
        // afterChange - Global
        // /////////////////////////////////////
        await globalConfig.hooks.afterChange.reduce(async (priorHook, hook) => {
            await priorHook;
            result = await hook({
                doc: result,
                previousDoc: originalDoc,
                req,
            }) || result;
        }, Promise.resolve());
        // /////////////////////////////////////
        // Return results
        // /////////////////////////////////////
        if (shouldCommit)
            await payload.db.commitTransaction(req.transactionID);
        return result;
    }
    catch (error) {
        await (0, killTransaction_1.killTransaction)(req);
        throw error;
    }
}
exports.default = update;
//# sourceMappingURL=update.js.map