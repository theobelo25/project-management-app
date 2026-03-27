import { MemberRowActions } from './member-row-actions';
import { formatProjectRole, getInitials } from '@web/components/projects/utils';
import { Badge } from '@web/components/ui/badge';
import type { ProjectRole } from '@repo/types';
import type { ProjectMember } from './types';
import { cn } from '@web/lib/utils';

export const MEMBERS_TABLE_GRID_CLASS =
  'grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_120px_56px] items-center gap-4';

export type MemberRowContentProps = {
  member: ProjectMember;
  currentUserRole?: ProjectRole;
  onChangeRole?: (
    memberId: string,
    role: Exclude<ProjectRole, 'OWNER'>,
  ) => void;
  onRemove?: (memberId: string) => void;
  layout: 'row' | 'stack';
  disabled?: boolean;
};

export function MemberRowContent({
  member,
  currentUserRole,
  onChangeRole,
  onRemove,
  layout,
  disabled = false,
}: MemberRowContentProps) {
  const avatar = (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
      {getInitials(member.name || '?')}
    </div>
  );
  const badge = (
    <Badge variant="secondary">{formatProjectRole(member.role)}</Badge>
  );
  const actions = (
    <MemberRowActions
      member={member}
      currentUserRole={currentUserRole}
      onChangeRole={onChangeRole}
      onRemove={onRemove}
      disabled={disabled}
    />
  );

  if (layout === 'row') {
    return (
      <div role="row" className={cn(MEMBERS_TABLE_GRID_CLASS, 'px-6 py-4')}>
        <div role="cell" className="flex min-w-0 items-center gap-3">
          {avatar}
          <p className="truncate font-medium">{member.name}</p>
        </div>
        <p role="cell" className="truncate text-sm text-muted-foreground">
          {member.email}
        </p>
        <div role="cell">{badge}</div>
        <div role="cell" className="flex justify-end">
          {actions}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {avatar}
          <div className="min-w-0">
            <p className="truncate font-medium">{member.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {member.email}
            </p>
          </div>
        </div>
        {actions}
      </div>
      {badge}
    </div>
  );
}
