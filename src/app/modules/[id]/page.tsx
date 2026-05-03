"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  Gavel,
  GraduationCap,
  MapPin,
  Plus,
  Scale,
  Search,
  Shield,
  StickyNote,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import {
  fetchModuleById,
  fetchAssignmentsByModule,
  fetchAssessmentsByModule,
  fetchStudySessionsByModule,
  fetchNotesByModule,
  fetchEventsByModule,
  updateModuleTopics,
} from "@/lib/data";
import type { Module, Assignment, Assessment, StudySession, Note, Event } from "@/lib/types";
import { cn, formatDate, formatTime, priorityLabel, priorityVariant } from "@/lib/utils";

const iconMap: Record<string, typeof Gavel> = {
  scale: Scale,
  "file-text": FileText,
  shield: Shield,
  "book-open": BookOpen,
  search: Search,
};

const moduleColors: Record<string, string> = {
  "#050505": "bg-deep-black",
  "#C8A24A": "bg-muted-gold/20",
  "#F3C6BD": "bg-muted-blush/30",
  "#CAD2C5": "bg-sage/30",
  "#EFE7D0": "bg-soft-beige/60",
};

function statusLabel(status: string) {
  return status
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type Tab = "overview" | "assignments" | "assessments" | "sessions" | "notes";

const tabLabels: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "assignments", label: "Assignments" },
  { key: "assessments", label: "Tests" },
  { key: "sessions", label: "Sessions" },
  { key: "notes", label: "Notes" },
];

export default function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [mod, setMod] = useState<Module | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [topicInput, setTopicInput] = useState("");

  useEffect(() => {
    fetchModuleById(id).then(setMod);
    fetchAssignmentsByModule(id).then(setAssignments);
    fetchAssessmentsByModule(id).then(setAssessments);
    fetchStudySessionsByModule(id).then(setStudySessions);
    fetchNotesByModule(id).then(setNotes);
    fetchEventsByModule(id).then(setEvents);
  }, [id]);

  function addTopic() {
    const trimmed = topicInput.trim();
    if (!trimmed || !mod) return;
    const updated = [...mod.topics, trimmed];
    setMod({ ...mod, topics: updated });
    setTopicInput("");
    updateModuleTopics(id, updated);
  }

  function removeTopic(index: number) {
    if (!mod) return;
    const updated = mod.topics.filter((_, i) => i !== index);
    setMod({ ...mod, topics: updated });
    updateModuleTopics(id, updated);
  }

  function handleTopicKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTopic();
    }
  }

  if (!mod) {
    return (
      <AppShell showNav={false}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-grey-text text-sm">Loading module...</p>
        </div>
      </AppShell>
    );
  }

  const Icon = iconMap[mod.icon] ?? Gavel;
  const colorBg = moduleColors[mod.color] ?? "bg-grey-surface";

  const completedAssignments = assignments.filter((a) => a.status === "completed").length;
  const overallProgress =
    assignments.length > 0
      ? Math.round(
          assignments.reduce((sum, a) => sum + a.progress, 0) / assignments.length
        )
      : 0;

  return (
    <AppShell showNav={false}>
      {/* Header */}
      <header className="flex items-center justify-between py-3">
        <Link href="/modules" className="rounded-full p-2">
          <ArrowLeft size={21} />
        </Link>
        <h1 className="truncate text-lg font-semibold">{mod.name}</h1>
        <div className="w-10" />
      </header>

      {/* Module identity card */}
      <Card padding="md" className="relative overflow-hidden">
        <div className={cn("absolute left-0 top-0 h-full w-1.5", colorBg || "bg-deep-black")} />
        <div className="flex items-center gap-4 pl-1">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-grey-surface">
            <Icon size={26} strokeWidth={1.6} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold">{mod.name}</h2>
            <p className="mt-0.5 text-xs text-grey-text">{mod.lecturerName}</p>
          </div>
        </div>
        {mod.notes && (
          <p className="mt-3 pl-1 text-xs leading-relaxed text-grey-text border-t border-grey-border pt-3">
            {mod.notes}
          </p>
        )}
      </Card>

      {/* Topics section */}
      <Card padding="md" className="mt-3">
        <h3 className="text-sm font-semibold">Topics</h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {mod.topics.map((topic, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-grey-surface px-3 py-1.5 text-xs font-medium"
            >
              {topic}
              <button onClick={() => removeTopic(i)} aria-label={`Remove ${topic}`}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={handleTopicKey}
            placeholder="Add a topic..."
            className="h-10 flex-1 rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
          />
          <Button size="sm" onClick={addTopic}>
            <Plus size={15} className="mr-1" /> Add
          </Button>
        </div>
      </Card>

      {/* Stats row */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[
          { label: "Tasks", value: completedAssignments + "/" + assignments.length, sub: "done" },
          { label: "Tests", value: assessments.length, sub: "upcoming" },
          { label: "Sessions", value: studySessions.length, sub: "planned" },
          { label: "Notes", value: notes.length, sub: "saved" },
        ].map((stat) => (
          <Card key={stat.label} padding="sm" className="text-center">
            <p className="text-lg font-semibold">{stat.value}</p>
            <p className="text-[10px] text-grey-text">{stat.label}</p>
            <p className="text-[10px] text-grey-text">{stat.sub}</p>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      {assignments.length > 0 && (
        <Card padding="sm" className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Overall Progress</span>
            <span className="text-grey-text">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="mt-2 h-1.5" />
        </Card>
      )}

      {/* Tab bar */}
      <div className="mt-4 flex gap-1 overflow-x-auto border-b border-grey-border pb-0">
        {tabLabels.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "shrink-0 px-3 pb-2.5 text-xs font-medium transition",
              tab === t.key
                ? "border-b-2 border-deep-black text-deep-black"
                : "text-grey-text"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <section className="mt-4 space-y-3 pb-8">
        {tab === "overview" && (
          <>
            {/* Upcoming events */}
            {events.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Upcoming Events</h3>
                {events.slice(0, 4).map((evt) => (
                  <Card key={evt.id} padding="sm" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-grey-surface">
                      <Clock3 size={15} />
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-semibold">{evt.title.replace(" — ", " ")}</p>
                      <p className="mt-0.5 text-grey-text">
                        {formatDate(evt.date)} • {formatTime(evt.startTime)} – {formatTime(evt.endTime)}
                      </p>
                      {evt.location && (
                        <p className="mt-0.5 flex items-center gap-0.5 text-grey-text">
                          <MapPin size={10} /> {evt.location}
                        </p>
                      )}
                    </div>
                    <Badge variant={priorityVariant(evt.priority)}>
                      {priorityLabel(evt.priority)}
                    </Badge>
                  </Card>
                ))}
              </div>
            )}

            {/* Recent notes */}
            {notes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Recent Notes</h3>
                {notes.slice(0, 3).map((note) => (
                  <Card key={note.id} padding="sm">
                    <div className="flex items-start gap-2">
                      <StickyNote size={14} className="mt-0.5 shrink-0 text-grey-text" />
                      <div className="min-w-0 flex-1 text-xs">
                        <p className="font-semibold">{note.title}</p>
                        <p className="mt-1 line-clamp-2 text-grey-text">{note.content}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {note.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="default">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "assignments" && (
          <>
            {assignments.length === 0 && (
              <Card className="py-8 text-center">
                <p className="text-sm text-grey-text">No assignments for this module yet.</p>
              </Card>
            )}
            {assignments.map((assignment) => (
              <Link key={assignment.id} href={`/assignments/${assignment.id}`}>
                <Card padding="sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-grey-border bg-paper-white">
                      <ClipboardList size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">{assignment.title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-grey-text">
                        <CalendarDays size={11} /> Due {formatDate(assignment.dueDate)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={priorityVariant(assignment.priority)}>
                          {priorityLabel(assignment.priority)}
                        </Badge>
                        <Badge>{statusLabel(assignment.status)}</Badge>
                      </div>
                    </div>
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-grey-border text-xs font-semibold">
                      {assignment.progress}%
                    </div>
                  </div>
                  {assignment.progress > 0 && (
                    <Progress value={assignment.progress} className="mt-3 h-1.5" />
                  )}
                </Card>
              </Link>
            ))}
          </>
        )}

        {tab === "assessments" && (
          <>
            {assessments.length === 0 && (
              <Card className="py-8 text-center">
                <p className="text-sm text-grey-text">No tests or exams for this module yet.</p>
              </Card>
            )}
            {assessments.map((assessment) => (
              <Card key={assessment.id} padding="sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper-white">
                    <GraduationCap size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">{assessment.title}</h3>
                    <p className="mt-1 text-xs text-grey-text">
                      {formatDate(assessment.date)} • {assessment.assessmentType}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant={priorityVariant(assessment.priority)}>
                        {priorityLabel(assessment.priority)}
                      </Badge>
                      <Badge variant="priority-medium">
                        Confidence: {"●".repeat(assessment.confidenceLevel)}{"○".repeat(5 - assessment.confidenceLevel)}
                      </Badge>
                    </div>
                    {assessment.topics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {assessment.topics.map((topic) => (
                          <Badge key={topic} variant="default">{topic}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={15} className="text-grey-text" />
                </div>
              </Card>
            ))}
          </>
        )}

        {tab === "sessions" && (
          <>
            {studySessions.length === 0 && (
              <Card className="py-8 text-center">
                <p className="text-sm text-grey-text">No study sessions planned for this module yet.</p>
              </Card>
            )}
            {studySessions.map((session) => (
              <Card key={session.id} padding="sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-grey-surface">
                    <Clock3 size={15} />
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="font-semibold">{session.title}</p>
                    <p className="mt-0.5 text-grey-text">
                      {formatDate(session.date)} • {formatTime(session.startTime)} – {formatTime(session.endTime)}
                    </p>
                    <p className="mt-1 text-grey-text">Goal: {session.goal}</p>
                    <div className="mt-1.5">
                      <Badge>{session.status}</Badge>
                    </div>
                    {session.reflectionNotes && (
                      <p className="mt-2 rounded-lg bg-grey-surface p-2 text-[11px] text-grey-text">
                        💭 {session.reflectionNotes}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab === "notes" && (
          <>
            {notes.length === 0 && (
              <Card className="py-8 text-center">
                <p className="text-sm text-grey-text">No notes for this module yet.</p>
              </Card>
            )}
            {notes.map((note) => (
              <Card key={note.id} padding="sm">
                <div className="flex items-start gap-2">
                  <StickyNote size={14} className="mt-0.5 shrink-0 text-grey-text" />
                  <div className="min-w-0 flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{note.title}</p>
                      <span className="text-[10px] text-grey-text">{formatDate(note.updatedAt)}</span>
                    </div>
                    <p className="mt-1.5 line-clamp-4 whitespace-pre-line leading-relaxed text-grey-text">
                      {note.content}
                    </p>
                    {note.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="default">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </section>
    </AppShell>
  );
}
