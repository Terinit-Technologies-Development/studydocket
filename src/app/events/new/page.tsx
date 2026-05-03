import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";

export default function NewEventPage() {
  return (
    <AppShell showNav={false}>
      <TopBar title="Add Event" />
      <Card className="mt-4 text-center">
        <h2 className="text-lg font-semibold">New Event Form</h2>
        <p className="mt-2 text-sm text-grey-text">
          The form to add a new event (class, assignment, personal, study
          session) will be built here.
        </p>
      </Card>
    </AppShell>
  );
}
