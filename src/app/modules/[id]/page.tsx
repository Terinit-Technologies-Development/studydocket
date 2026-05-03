import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell showNav={false}>
      <TopBar title={`Module ${id}`} />
      <Card className="mt-4 text-center">
        <h2 className="text-lg font-semibold">Module Detail</h2>
        <p className="mt-2 text-sm text-grey-text">
          The detail view with assignments, assessments, and study sessions
          for this module will be built here.
        </p>
      </Card>
    </AppShell>
  );
}
