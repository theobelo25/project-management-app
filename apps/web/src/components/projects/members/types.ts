export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER";

export type ProjectMember = {
  id: string;
  name: string;
  email: string;
  role: ProjectRole;
};

export type InviteProjectMemberDto = {
  email: string;
  role: Exclude<ProjectRole, "OWNER">;
};
