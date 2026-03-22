"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferProjectOwnershipSchema = void 0;
const zod_1 = require("zod");
exports.TransferProjectOwnershipSchema = zod_1.z.object({
    userId: zod_1.z.string().trim().min(1, "User id is required"),
});
//# sourceMappingURL=transfer-project-ownership.schema.js.map