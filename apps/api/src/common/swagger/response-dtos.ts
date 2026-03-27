import {
  AuthSessionSchema,
  NotificationViewSchema,
  OrganizationDetailViewSchema,
  OrganizationInviteAdminViewSchema,
  OrganizationInviteViewSchema,
  OrganizationMemberViewSchema,
  OrganizationSummaryViewSchema,
  OrganizationViewSchema,
  PaginatedOrganizationMembersViewSchema,
  PaginatedProjectsListViewSchema,
  PaginatedTasksViewSchema,
  PendingInviteViewSchema,
  ProjectDetailViewSchema,
  ProjectMemberViewSchema,
  ProjectMembersViewSchema,
  ProjectViewSchema,
  TaskAssignmentViewSchema,
  TaskViewSchema,
  UserViewSchema,
} from '@repo/types';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class AuthSessionResponseDto extends createZodDto(AuthSessionSchema) {}
export class UserViewResponseDto extends createZodDto(UserViewSchema) {}
export class UserViewListResponseDto extends createZodDto(
  z.array(UserViewSchema),
) {}

export class ProjectViewResponseDto extends createZodDto(ProjectViewSchema) {}
export class ProjectDetailViewResponseDto extends createZodDto(
  ProjectDetailViewSchema,
) {}
export class PaginatedProjectsListResponseDto extends createZodDto(
  PaginatedProjectsListViewSchema,
) {}
export class ProjectMembersResponseDto extends createZodDto(
  ProjectMembersViewSchema,
) {}
export class ProjectMemberResponseDto extends createZodDto(
  ProjectMemberViewSchema,
) {}

export class TaskViewResponseDto extends createZodDto(TaskViewSchema) {}
export class PaginatedTasksResponseDto extends createZodDto(
  PaginatedTasksViewSchema,
) {}
export class TaskAssignmentResponseDto extends createZodDto(
  TaskAssignmentViewSchema,
) {}

export class OrganizationViewListResponseDto extends createZodDto(
  z.array(OrganizationViewSchema),
) {}
export class OrganizationInviteResponseDto extends createZodDto(
  OrganizationInviteViewSchema,
) {}
export class OrganizationInviteAdminListResponseDto extends createZodDto(
  z.array(OrganizationInviteAdminViewSchema),
) {}
export class PendingInviteListResponseDto extends createZodDto(
  z.array(PendingInviteViewSchema),
) {}
export class OrganizationDetailResponseDto extends createZodDto(
  OrganizationDetailViewSchema,
) {}
export class OrganizationSummaryResponseDto extends createZodDto(
  OrganizationSummaryViewSchema,
) {}
export class PaginatedOrganizationMembersResponseDto extends createZodDto(
  PaginatedOrganizationMembersViewSchema,
) {}
export class OrganizationMemberResponseDto extends createZodDto(
  OrganizationMemberViewSchema,
) {}

export class NotificationListResponseDto extends createZodDto(
  z.array(NotificationViewSchema),
) {}
