"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupRequestSchema = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]/, "Password must contain at least one special character");
exports.SignupRequestSchema = zod_1.z
    .object({
    email: zod_1.z.email(),
    name: zod_1.z.string().min(1).max(200),
    password: passwordSchema,
    confirmPassword: zod_1.z.string().min(8),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
//# sourceMappingURL=signup-user.schema.js.map