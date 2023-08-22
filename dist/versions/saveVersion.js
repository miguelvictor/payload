"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveVersion = void 0;
const enforceMaxVersions_1 = require("./enforceMaxVersions");
const sanitizeInternalFields_1 = __importDefault(require("../utilities/sanitizeInternalFields"));
const saveVersion = async ({ payload, collection, global, id, docWithLocales: doc, autosave, draft, req, }) => {
    let result;
    let entityConfig;
    if (collection) {
        entityConfig = collection;
    }
    if (global) {
        entityConfig = global;
    }
    const versionData = { ...doc };
    if (draft)
        versionData._status = 'draft';
    if (versionData._id)
        delete versionData._id;
    try {
        let createNewVersion = true;
        const now = new Date().toISOString();
        if (autosave) {
            const { docs } = await payload.db.findVersions({
                collection: entityConfig.slug,
                limit: 1,
                where: {
                    parent: {
                        equals: id,
                    },
                },
                sort: '-updatedAt',
                req,
            });
            const [latestVersion] = docs;
            // overwrite the latest version if it's set to autosave
            if ((latestVersion === null || latestVersion === void 0 ? void 0 : latestVersion.autosave) === true) {
                createNewVersion = false;
                const data = {
                    version: versionData,
                    createdAt: new Date(latestVersion.createdAt).toISOString(),
                    updatedAt: draft ? now : new Date(doc.updatedAt).toISOString(),
                };
                result = await payload.db.updateVersion({
                    collectionSlug: entityConfig.slug,
                    versionData: data,
                    id: latestVersion.id,
                    req,
                });
            }
        }
        if (createNewVersion) {
            result = await payload.db.createVersion({
                collectionSlug: entityConfig.slug,
                parent: collection ? id : undefined,
                autosave: Boolean(autosave),
                createdAt: (doc === null || doc === void 0 ? void 0 : doc.createdAt) ? new Date(doc.createdAt).toISOString() : now,
                updatedAt: draft ? now : new Date(doc.updatedAt).toISOString(),
                versionData,
                req,
            });
        }
    }
    catch (err) {
        let errorMessage;
        if (collection)
            errorMessage = `There was an error while saving a version for the ${collection.labels.singular} with ID ${id}.`;
        if (global)
            errorMessage = `There was an error while saving a version for the global ${global.label}.`;
        payload.logger.error(errorMessage);
        payload.logger.error(err);
    }
    let max = 100;
    if (collection && typeof collection.versions.maxPerDoc === 'number')
        max = collection.versions.maxPerDoc;
    if (global && typeof global.versions.max === 'number')
        max = global.versions.max;
    if (max > 0) {
        await (0, enforceMaxVersions_1.enforceMaxVersions)({
            id,
            payload,
            collection,
            global,
            max,
            req,
        });
    }
    result = JSON.parse(JSON.stringify(result));
    let createdVersion = result.version;
    createdVersion.createdAt = result.createdAt;
    createdVersion.updatedAt = result.updatedAt;
    createdVersion = (0, sanitizeInternalFields_1.default)(createdVersion);
    createdVersion.id = id;
    return createdVersion;
};
exports.saveVersion = saveVersion;
//# sourceMappingURL=saveVersion.js.map