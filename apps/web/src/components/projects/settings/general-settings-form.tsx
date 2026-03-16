import { useRouter } from "next/navigation";

import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Textarea } from "@web/components/ui/textarea";
import { useUpdateProject } from "@web/lib/api/mutations/use-update-project";

export function GeneralSettingsForm({
  projectId,
  defaultName,
  defaultDescription,
}: {
  projectId: string;
  defaultName: string;
  defaultDescription: string;
}) {
  const router = useRouter();

  const updateMutation = useUpdateProject(projectId);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    updateMutation.mutate({ name, description: description || null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Project name</Label>
        <Input id="name" name="name" defaultValue={defaultName} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={defaultDescription}
          placeholder="Describe this project"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
      {updateMutation.error && (
        <p className="text-sm text-destructive">
          {updateMutation.error.message}
        </p>
      )}
    </form>
  );
}
