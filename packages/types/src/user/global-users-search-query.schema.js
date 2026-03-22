"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalUsersSearchQuerySchema = void 0;
const zod_1 = require("zod");
exports.GlobalUsersSearchQuerySchema = zod_1.z.object({
    search: zod_1.z.preprocess((val) => {
        if (val === undefined || val === null)
            return "";
        return String(val).trim();
    }, zod_1.z.string().min(2, "search must be at least 2 characters").max(100)),
});
//# sourceMappingURL=global-users-search-query.schema.js.map