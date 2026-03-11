"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, context) => {
    const request = context.switchToHttp().getRequest();
    const authUser = request.user;
    if (authUser && typeof authUser === 'object' && 'user' in authUser) {
        return authUser.user;
    }
    return authUser;
});
//# sourceMappingURL=current-user.decorator.js.map