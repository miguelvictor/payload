"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLocalStrategy = void 0;
const errors_1 = require("../../../errors");
const generatePasswordSaltHash_1 = require("./generatePasswordSaltHash");
const registerLocalStrategy = async ({ collection, doc, password, payload, req, }) => {
    const existingUser = await payload.find({
        collection: collection.slug,
        depth: 0,
        where: {
            email: {
                equals: doc.email,
            },
        },
    });
    if (existingUser.docs.length > 0) {
        throw new errors_1.ValidationError([{ message: 'A user with the given email is already registered', field: 'email' }]);
    }
    const { salt, hash } = await (0, generatePasswordSaltHash_1.generatePasswordSaltHash)({ password });
    const sanitizedDoc = { ...doc };
    if (sanitizedDoc.password)
        delete sanitizedDoc.password;
    return payload.db.create({
        collection: collection.slug,
        data: {
            ...sanitizedDoc,
            salt,
            hash,
        },
        req,
    });
};
exports.registerLocalStrategy = registerLocalStrategy;
//# sourceMappingURL=register.js.map