"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ClipboardList, FileText, Filter, Menu, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { AddTaskForm } from "@/components/forms/AddTaskForm";
import { fetchAssignments } from "@/lib/data";
import type { Assignment } from "@/lib/types";
import { cn, formatDate, priorityLabel, priorityVariant } from "@/lib/utils";

const tabs = ["All", "Not Started", "In Progress", "Completed"];

function statusLabel(status: string) {
  return status
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    fetchAssignments().then(setAssignments);
  }, []);

  return (
    <AppShell showNav>
      <header className="grid grid-cols-3 items-center py-3">
        <button aria-label="Open menu" className="justify-self-start rounded-full p-2">
          <Menu size={21} />
        </button>
        <h1 className="text-center text-lg font-semibold">Assignments</h1>
        <div className="flex items-center justify-end gap-2">
          <button aria-label="Filter assignments" className="rounded-full p-2">
            <Filter size={18} />
          </button>
          <button
            aria-label="Add assignment"
            onClick={() => setShowAddTask(true)}
            className="rounded-full bg-deep-black p-1 text-soft-white"
          >
            <Plus size={17} />
          </button>
        </div>
      </header>

      <div className="mt-3 grid grid-cols-4 border-b border-grey-border text-center text-xs font-medium text-grey-text">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={cn(
              "pb-3",
              tab === "All" && "border-b-2 border-deep-black text-deep-black"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="mt-4 space-y-3">
        {assignments.map((assignment, index) => {
          const Icon = index % 2 === 0 ? ClipboardList : FileText;

          return (
            <Link key={assignment.id} href={`/assignments/${assignment.id}`}>
              <Card padding="sm" className="rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-grey-border bg-paper-white">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold">
                      {assignment.title.replace(" — Offer & Acceptance Essay", " Assignment")}
                    </h2>
                    <p className="mt-1 flex items-center gap-1 text-xs text-grey-text">
                      <CalendarDays size={12} /> Due {formatDate(assignment.dueDate)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant={priorityVariant(assignment.priority)}>
                        {priorityLabel(assignment.priority)}
                      </Badge>
                      <Badge>{statusLabel(assignment.status)}</Badge>
                    </div>
                  </div>
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-grey-border bg-soft-white text-xs font-semibold">
                    {assignment.progress}%
                  </div>
                </div>
                {assignment.progress > 0 && (
                  <Progress value={assignment.progress} className="mt-3 h-1.5" />
                )}
              </Card>
            </Link>
          );
        })}
      </section>

      <AddTaskForm open={showAddTask} onClose={() => setShowAddTask(false)} />
    </AppShell>
  );
}
