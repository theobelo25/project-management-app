import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route/controller as publicly accessible (JWT auth opt-out).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
