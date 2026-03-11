"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZodDto = createZodDto;
exports.isZodDto = isZodDto;
function createZodDto(schema) {
    class ZodDto {
        static schema = schema;
    }
    return ZodDto;
}
function isZodDto(metatype) {
    if (typeof metatype !== 'function') {
        return false;
    }
    return 'schema' in metatype;
}
//# sourceMappingURL=zod-dto.util.js.map