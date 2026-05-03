import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell showNav={false}>
      <TopBar title={`Assignment ${id}`} />
      <Card className="mt-4 text-center">
        <h2 className="text-lg font-semibold">Assignment Details</h2>
        <p className="mt-2 text-sm text-grey-text">
          The full assignment detail with description, progress, linked
          module, and study sessions will be built here.
        </p>
      </Card>
    </AppShell>
  );
}
