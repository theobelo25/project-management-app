"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentRefreshToken = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("@repo/types");
exports.CurrentRefreshToken = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.cookies?.[types_1.COOKIE.REFRESH];
    if (typeof token !== 'string') {
        throw new common_1.UnauthorizedException('Refresh token missing');
    }
    return token;
});
//# sourceMappingURL=refresh-token.decorator.js.map