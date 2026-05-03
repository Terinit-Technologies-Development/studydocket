import { Bell, Crown, Menu } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { assignments, events, modules, studySessions, user } from "@/lib/mock-data";
import { formatTime, priorityLabel, priorityVariant } from "@/lib/utils";

const weekDays = [
  { label: "Mon", day: "12" },
  { label: "Tue", day: "13" },
  { label: "Wed", day: "14", active: true },
  { label: "Thu", day: "15" },
  { label: "Fri", day: "16" },
  { label: "Sat", day: "17" },
  { label: "Sun", day: "18" },
];

function moduleName(moduleId?: string) {
  return modules.find((module) => module.id === moduleId)?.name ?? "Personal";
}

export default function DashboardPage() {
  const todaysEvents = events.slice(0, 3);
  const upcomingAssignments = assignments.slice(0, 2);
  const nextSession = studySessions[2];

  return (
    <AppShell showNav>
      <header className="flex items-center justify-between py-2">
        <button aria-label="Open menu" className="rounded-full p-2">
          <Menu size={21} />
        </button>
        <button aria-label="Notifications" className="rounded-full p-2">
          <Bell size={21} />
        </button>
      </header>

      <section className="space-y-1 pt-2">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          Good morning, {user.name.split(" ")[0]}
          <Crown size={18} className="text-muted-gold" />
        </h1>
        <p className="text-sm text-grey-text">You&apos;ve got this. One step at a time.</p>
      </section>

      <Card className="mt-5" padding="sm">
        <p className="px-2 pb-3 pt-1 text-sm font-semibold">Wednesday, 14 May</p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-1">
              <span className="text-[11px] text-grey-text">{day.label}</span>
              <span
                className={
                  day.active
                    ? "flex h-8 w-8 items-center justify-center rounded-full bg-deep-black text-sm font-semibold text-soft-white"
                    : "flex h-8 w-8 items-center justify-center text-sm font-medium"
                }
              >
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4" padding="sm">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold">Today&apos;s Schedule</h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grey-surface text-xs font-semibold">
            {todaysEvents.length}
          </span>
        </div>
        <div className="space-y-3">
          {todaysEvents.map((event) => (
            <div key={event.id} className="grid grid-cols-[52px_1fr_auto] gap-3 text-xs">
              <div className="text-grey-text">
                <p className="font-medium text-deep-black">{formatTime(event.startTime)}</p>
                <p>{event.location?.split(",")[0]}</p>
              </div>
              <div>
                <p className="font-semibold leading-tight">{event.title.replace(" — ", " ")}</p>
                <p className="mt-0.5 text-grey-text">{moduleName(event.moduleId)}</p>
              </div>
              <Badge>{moduleName(event.moduleId).split(" ").slice(0, 2).join(" ")}</Badge>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full text-center text-xs font-semibold">View full day</button>
      </Card>

      <Card className="mt-4" padding="sm">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold">Upcoming Deadlines</h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grey-surface text-xs font-semibold">
            {upcomingAssignments.length}
          </span>
        </div>
        <div className="space-y-3">
          {upcomingAssignments.map((assignment, index) => (
            <div key={assignment.id} className="flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold leading-tight">{assignment.title.replace(" — Offer & Acceptance Essay", " Assignment")}</p>
                <p className="mt-0.5 text-grey-text">
                  {index === 0 ? "Due in 2 days" : "Due tomorrow"} • 16 May
                </p>
              </div>
              <Badge variant={priorityVariant(assignment.priority)}>
                {priorityLabel(assignment.priority)}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4" padding="sm">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold">Next Study Session</h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grey-surface text-xs font-semibold">
            3
          </span>
        </div>
        <div className="text-xs">
          <p className="text-grey-text">Today, 6:00 PM - 8:00 PM</p>
          <p className="mt-1 font-semibold">{nextSession.title.replace(" — Consideration Recap", ": Offer & Acceptance")}</p>
          <p className="mt-1 text-grey-text">Goal: Finish reading and case notes</p>
        </div>
      </Card>
    </AppShell>
  );
}
