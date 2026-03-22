"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationIdParamSchema = void 0;
const zod_1 = require("zod");
exports.NotificationIdParamSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
});
//# sourceMappingURL=notification-id-param.schema.js.map