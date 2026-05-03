import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";

export default function OverviewPage() {
  return (
    <AppShell showNav>
      <TopBar title="Overview" />
      <Card className="mt-4 text-center">
        <h2 className="text-lg font-semibold">Dark Dashboard Overview</h2>
        <p className="mt-2 text-sm text-grey-text">
          The full-screen dark-themed overview with stats, progress
          summary, and key metrics will be built here.
        </p>
      </Card>
    </AppShell>
  );
}
