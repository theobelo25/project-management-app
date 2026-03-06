"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserInputSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserInputSchema = zod_1.z.object({
    email: zod_1.z.email(),
    name: zod_1.z.string().min(1).max(200).optional(),
});
//# sourceMappingURL=create-user.schema.js.map