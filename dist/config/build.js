"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConfig = void 0;
const sanitize_1 = require("./sanitize");
/**
 * @description Builds and validates Payload configuration
 * @param config Payload Config
 * @returns Built and sanitized Payload Config
 */
async function buildConfig(config) {
    if (Array.isArray(config.plugins)) {
        const configAfterPlugins = await config.plugins.reduce(async (acc, plugin) => {
            const configAfterPlugin = await acc;
            return plugin(configAfterPlugin);
        }, Promise.resolve(config));
        const sanitizedConfig = (0, sanitize_1.sanitizeConfig)(configAfterPlugins);
        return sanitizedConfig;
    }
    return (0, sanitize_1.sanitizeConfig)(config);
}
exports.buildConfig = buildConfig;
//# sourceMappingURL=build.js.map