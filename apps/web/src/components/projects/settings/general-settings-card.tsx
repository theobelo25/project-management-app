import { GeneralSettingsForm } from "@web/components/projects/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import type { ProjectDetailView } from "@repo/types";

type GeneralSettingsCardProps = {
  project: Pick<ProjectDetailView, "id" | "name" | "description">;
};

export function GeneralSettingsCard({ project }: GeneralSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>
          Update the basic information for this project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GeneralSettingsForm
          projectId={project.id}
          defaultName={project.name}
          defaultDescription={project.description ?? ""}
        />
      </CardContent>
    </Card>
  );
}
