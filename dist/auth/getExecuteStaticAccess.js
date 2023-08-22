"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const executeAccess_1 = __importDefault(require("./executeAccess"));
const errors_1 = require("../errors");
const getExecuteStaticAccess = (config) => async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    try {
        if (req.path) {
            const accessResult = await (0, executeAccess_1.default)({ req, isReadingStaticFile: true }, config.access.read);
            if (typeof accessResult === 'object') {
                const filename = decodeURI(req.path).replace(/^\/|\/$/g, '');
                const queryToBuild = {
                    and: [
                        {
                            or: [
                                {
                                    filename: {
                                        equals: filename,
                                    },
                                },
                            ],
                        },
                        accessResult,
                    ],
                };
                if (config.upload.imageSizes) {
                    config.upload.imageSizes.forEach(({ name }) => {
                        queryToBuild.and[0].or.push({
                            [`sizes.${name}.filename`]: {
                                equals: filename,
                            },
                        });
                    });
                }
                const doc = await req.payload.db.findOne({
                    collection: config.slug,
                    where: queryToBuild,
                });
                if (!doc) {
                    throw new errors_1.Forbidden(req.t);
                }
            }
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.default = getExecuteStaticAccess;
//# sourceMappingURL=getExecuteStaticAccess.js.map