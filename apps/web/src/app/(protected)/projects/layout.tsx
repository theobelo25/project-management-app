import { PageLayout } from '@web/components/layout/page-layout';
import { ProjectsUnifiedHeader } from '@web/components/projects/projects-header/projects-unified-header';
import { TaskDetailProvider } from '@web/components/projects/projects-header/task-detail-header';

type LayoutProps = {
  children: React.ReactNode;
};

export default function ProjectsLayout({ children }: LayoutProps) {
  return (
    <TaskDetailProvider>
      <div className="flex flex-col min-h-0 flex-1">
        <header className="bg-background shrink-0 min-h-40">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
            <ProjectsUnifiedHeader />
          </div>
        </header>
        <PageLayout className="flex-1 min-h-0 pb-6">{children}</PageLayout>
      </div>
    </TaskDetailProvider>
  );
}
