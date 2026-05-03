import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <AppShell showNav={false}>
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            StudyDocket
          </h1>
          <p className="text-grey-text text-sm leading-relaxed max-w-xs mx-auto">
            Your personal law school planner. Stay calm, stay structured.
          </p>
        </div>

        <Card className="w-full max-w-xs space-y-4">
          <p className="text-sm text-grey-text">
            Welcome! This page will be replaced with a splash screen or
            redirect to the login flow.
          </p>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </Card>
      </div>
    </AppShell>
  );
}
