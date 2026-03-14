import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { GeneralSettingsForm } from "./general-settings-form";
import { ProjectDetailView } from "@repo/types";

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
