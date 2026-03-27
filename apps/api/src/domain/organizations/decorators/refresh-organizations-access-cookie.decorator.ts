import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { OrganizationsAccessCookieRefreshInterceptor } from '../interceptors/organizations-access-cookie-refresh.interceptor';
export function RefreshOrganizationsAccessCookie() {
  return applyDecorators(
    UseInterceptors(OrganizationsAccessCookieRefreshInterceptor),
  );
}
