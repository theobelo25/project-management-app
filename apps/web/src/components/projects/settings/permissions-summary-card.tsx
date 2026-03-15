import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { Users } from "lucide-react";
import { ProjectRole } from "@repo/types";
import { formatProjectRole } from "../utils/format";

type PermissionsSummaryCardProps = {
  project: {
    currentUserRole?: ProjectRole;
  };
};

export function PermissionsSummaryCard({
  project,
}: PermissionsSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions Summary</CardTitle>
        <CardDescription>
          Your current access level for this project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">
              {formatProjectRole(project.currentUserRole)}
            </p>
            <p className="text-sm text-muted-foreground">
              {project.currentUserRole === "OWNER"
                ? "You can manage settings, members, and destructive actions."
                : project.currentUserRole === "ADMIN"
                  ? "You can manage members and update project details."
                  : "You can view project details but have limited administrative access."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
