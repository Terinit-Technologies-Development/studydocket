import { ChevronRight, Filter, Menu, Plus, Scale } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { assessments } from "@/lib/mock-data";
import { cn, formatDate, priorityLabel, priorityVariant } from "@/lib/utils";

const tabs = ["Upcoming", "Completed"];

function confidenceLabel(level: number) {
  if (level >= 4) return "High";
  if (level === 3) return "Medium";
  return "Low";
}

export default function AssessmentsPage() {
  return (
    <AppShell showNav>
      <header className="grid grid-cols-3 items-center py-3">
        <button aria-label="Open menu" className="justify-self-start rounded-full p-2">
          <Menu size={21} />
        </button>
        <h1 className="text-center text-lg font-semibold">Test / Exam</h1>
        <button aria-label="Filter tests" className="justify-self-end rounded-full p-2">
          <Filter size={18} />
        </button>
      </header>

      <div className="mt-2 grid grid-cols-2 rounded-full bg-grey-surface p-1 text-xs font-semibold">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={cn(
              "rounded-full py-2.5 transition",
              tab === "Upcoming" ? "bg-deep-black text-soft-white" : "text-deep-black"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="mt-5 space-y-4">
        {assessments.map((assessment) => (
          <Card key={assessment.id} padding="sm" className="rounded-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-paper-white">
                <Scale size={25} strokeWidth={1.6} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold">
                  {assessment.title.replace("Mid-Term ", "")}
                </h2>
                <p className="mt-1 text-xs text-grey-text">
                  {formatDate(assessment.date)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant={priorityVariant(assessment.priority)}>
                    {priorityLabel(assessment.priority)}
                  </Badge>
                  <Badge variant="priority-medium">
                    Confidence: {confidenceLabel(assessment.confidenceLevel)}
                  </Badge>
                </div>
              </div>
              <ChevronRight size={18} className="text-grey-text" />
            </div>
          </Card>
        ))}
      </section>

      <button
        className="fixed bottom-24 right-[calc(50%-12rem)] flex h-14 w-14 items-center justify-center rounded-full bg-deep-black text-soft-white shadow-lg"
        aria-label="Add test or exam"
      >
        <Plus size={25} />
      </button>
    </AppShell>
  );
}
