import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";

export default function NewStudySessionPage() {
  return (
    <AppShell showNav={false}>
      <TopBar title="New Study Session" />
      <Card className="mt-4 text-center">
        <h2 className="text-lg font-semibold">Study Session Form</h2>
        <p className="mt-2 text-sm text-grey-text">
          The form to schedule a study session with linked module, goal,
          and time block will be built here.
        </p>
      </Card>
    </AppShell>
  );
}
