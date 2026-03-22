"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isZodDto = isZodDto;
function isZodDto(metatype) {
    return Boolean(metatype &&
        (typeof metatype === 'object' || typeof metatype === 'function') &&
        'isZodDto' in metatype &&
        metatype.isZodDto === true);
}
//# sourceMappingURL=zod-dto.util.js.map