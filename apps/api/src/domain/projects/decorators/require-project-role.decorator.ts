import { SetMetadata } from '@nestjs/common';
import { ProjectRole } from '@repo/database';

export const REQUIRE_PROJECT_ROLE_KEY = 'requireProjectRole';

export const RequireProjectRole = (role: ProjectRole) =>
  SetMetadata(REQUIRE_PROJECT_ROLE_KEY, role);
