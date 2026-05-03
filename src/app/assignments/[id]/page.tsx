"use client";

import { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Minus,
  Paperclip,
  Plus,
  StickyNote,
  Upload,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import {
  fetchAssignmentById,
  fetchModuleById,
  fetchStudySessionsByAssignment,
  fetchNotesByModule,
  fetchAssignmentAttachments,
  uploadAssignmentFile,
  deleteAssignmentAttachment,
  updateAssignmentProgress,
  updateAssignmentStatus,
} from "@/lib/data";
import type { Module, Assignment, StudySession, Note, AssignmentAttachment } from "@/lib/types";
import { cn, daysUntil, formatDate, formatTime, isOverdue, isDueSoon, priorityLabel, priorityVariant } from "@/lib/utils";

function statusLabel(status: string) {
  return status
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const statuses: Assignment["status"][] = ["not-started", "in-progress", "completed"];

const progressSteps = [0, 25, 50, 75, 100];

export default function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [mod, setMod] = useState<Module | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [attachments, setAttachments] = useState<AssignmentAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAssignmentById(id).then((asgn) => {
      if (!asgn) return;
      setAssignment(asgn);
      setProgress(asgn.progress);
      fetchModuleById(asgn.moduleId).then(setMod);
      fetchStudySessionsByAssignment(id).then(setSessions);
      fetchNotesByModule(asgn.moduleId).then(setNotes);
      fetchAssignmentAttachments(id).then(setAttachments);
    });
  }, [id]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    for (const file of Array.from(e.target.files)) {
      const attachment = await uploadAssignmentFile(id, file);
      if (attachment) setAttachments((prev) => [attachment, ...prev]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDeleteAttachment(attachmentId: string) {
    await deleteAssignmentAttachment(attachmentId);
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleProgressChange(newProgress: number) {
    const clamped = Math.min(100, Math.max(0, newProgress));
    setProgress(clamped);
    setSaving(true);
    await updateAssignmentProgress(id, clamped);
    if (assignment) setAssignment({ ...assignment, progress: clamped });
    setSaving(false);
  }

  async function handleStatusChange(newStatus: Assignment["status"]) {
    setSaving(true);
    await updateAssignmentStatus(id, newStatus);
    if (assignment) {
      const updated = { ...assignment, status: newStatus };
      if (newStatus === "completed") {
        updated.progress = 100;
        setProgress(100);
      }
      setAssignment(updated);
    }
    setSaving(false);
  }

  if (!assignment) {
    return (
      <AppShell showNav={false}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-grey-text">Loading assignment...</p>
        </div>
      </AppShell>
    );
  }

  const daysLeft = daysUntil(assignment.dueDate);
  const overdue = isOverdue(assignment.dueDate);
  const urgent = isDueSoon(assignment.dueDate, 3);
  const progressPct = progress;

  return (
    <AppShell showNav={false}>
      {/* Header */}
      <header className="flex items-center justify-between py-3">
        <Link href="/assignments" className="rounded-full p-2">
          <ArrowLeft size={21} />
        </Link>
        <h1 className="truncate text-center text-base font-semibold">
          Assignment
        </h1>
        <div className="w-10" />
      </header>

      {/* Title card */}
      <Card padding="md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {mod && (
              <Link href={`/modules/${mod.id}`} className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-grey-text hover:text-deep-black">
                {mod.name} <ChevronRight size={11} />
              </Link>
            )}
            <h2 className="text-lg font-semibold leading-snug">{assignment.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={priorityVariant(assignment.priority)}>
                {priorityLabel(assignment.priority)} priority
              </Badge>
              <Badge variant={assignment.status === "completed" ? "success" : "default"}>
                {statusLabel(assignment.status)}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Due date urgency card */}
      <Card
        padding="md"
        className={cn(
          "mt-3",
          overdue && "border-muted-blush bg-muted-blush/5",
          urgent && !overdue && "border-muted-gold bg-muted-gold/5"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              overdue ? "bg-muted-blush/30" : urgent ? "bg-muted-gold/30" : "bg-sage/30"
            )}
          >
            <CalendarDays size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              {overdue
                ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""}`
                : daysLeft === 0
                  ? "Due today"
                  : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`}
            </p>
            <p className="mt-0.5 text-xs text-grey-text">
              Due {formatDate(assignment.dueDate)}
            </p>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              overdue
                ? "bg-muted-blush/40 text-deep-black"
                : urgent
                  ? "bg-muted-gold/40 text-deep-black"
                  : "bg-sage/40 text-deep-black"
            )}
          >
            {overdue ? "!" : daysLeft === 0 ? "!" : daysLeft}
          </div>
        </div>
      </Card>

      {/* Progress section */}
      <Card padding="md" className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Progress</h3>
          <span className={cn("text-xs font-semibold", saving && "animate-pulse")}>
            {saving ? "Saving..." : `${progressPct}% complete`}
          </span>
        </div>

        {/* Progress circle and steps */}
        <div className="mt-4 flex items-center justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-grey-surface"
              />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(progressPct / 100) * 264} 264`}
                className={cn(
                  progressPct >= 100 ? "text-sage" : progressPct >= 50 ? "text-muted-gold" : "text-deep-black"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{progressPct}%</span>
              <span className="text-[10px] text-grey-text">done</span>
            </div>
          </div>
        </div>

        {/* Quick progress buttons */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            onClick={() => handleProgressChange(progressPct - 10)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-grey-border bg-soft-white hover:bg-grey-surface transition"
            aria-label="Decrease progress"
          >
            <Minus size={15} />
          </button>
          <div className="flex-1">
            <Progress value={progressPct} className="h-2" />
          </div>
          <button
            onClick={() => handleProgressChange(progressPct + 10)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-grey-border bg-soft-white hover:bg-grey-surface transition"
            aria-label="Increase progress"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Quick-set progress steps */}
        <div className="mt-3 flex gap-2">
          {progressSteps.map((step) => (
            <button
              key={step}
              onClick={() => handleProgressChange(step)}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-[11px] font-medium transition",
                progressPct >= step
                  ? "bg-deep-black text-soft-white"
                  : "bg-grey-surface text-grey-text"
              )}
            >
              {step}%
            </button>
          ))}
        </div>
      </Card>

      {/* Status toggle */}
      <Card padding="md" className="mt-3">
        <h3 className="text-sm font-semibold">Status</h3>
        <div className="mt-3 flex gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-xs font-medium transition",
                assignment.status === s
                  ? "bg-deep-black text-soft-white"
                  : "border border-grey-border bg-soft-white text-grey-text"
              )}
            >
              {statusLabel(s)}
            </button>
          ))}
        </div>
      </Card>

      {/* Description + Details */}
      <Card padding="md" className="mt-3">
        <h3 className="text-sm font-semibold">Details</h3>

        {assignment.description && (
          <p className="mt-3 text-sm leading-relaxed text-grey-text">
            {assignment.description}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-grey-surface p-3">
            <p className="text-[10px] text-grey-text">Est. Hours</p>
            <p className="mt-0.5 text-sm font-semibold">{assignment.estimatedHours}h</p>
          </div>
          <div className="rounded-xl bg-grey-surface p-3">
            <p className="text-[10px] text-grey-text">Module</p>
            <p className="mt-0.5 text-sm font-semibold truncate">
              {mod?.name ?? "—"}
            </p>
          </div>
          <div className="rounded-xl bg-grey-surface p-3">
            <p className="text-[10px] text-grey-text">Due Date</p>
            <p className="mt-0.5 text-sm font-semibold">{formatDate(assignment.dueDate)}</p>
          </div>
          <div className="rounded-xl bg-grey-surface p-3">
            <p className="text-[10px] text-grey-text">Priority</p>
            <p className="mt-0.5 text-sm font-semibold">{priorityLabel(assignment.priority)}</p>
          </div>
        </div>

        {assignment.notes && (
          <div className="mt-4 rounded-xl bg-soft-beige/30 p-3">
            <p className="text-[10px] font-medium text-grey-text">Notes</p>
            <p className="mt-1 text-xs leading-relaxed">{assignment.notes}</p>
          </div>
        )}
      </Card>

      {/* Linked study sessions */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold">Study Sessions</h3>
        {sessions.length === 0 ? (
          <Card padding="sm" className="mt-2 text-center">
            <div className="flex flex-col items-center gap-1.5 py-6">
              <GraduationCap size={24} className="text-grey-text" strokeWidth={1.2} />
              <p className="text-xs text-grey-text">No study sessions linked yet.</p>
              <Link href="/study-sessions/new">
                <Button size="sm" variant="ghost">Plan a session</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="mt-2 space-y-2">
            {sessions.map((session) => (
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
                    <p className="mt-1 text-grey-text">{session.goal}</p>
                    <div className="mt-1.5">
                      <Badge>{session.status}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Attachments */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold">Files</h3>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-grey-border bg-soft-white text-sm text-grey-text hover:bg-grey-surface transition"
        >
          <Upload size={15} />
          Upload files (PDF, docs, images, spreadsheets)
        </button>

        {attachments.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between rounded-lg bg-grey-surface px-3 py-2.5 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip size={13} className="shrink-0 text-grey-text" />
                  <span className="truncate">{att.fileName}</span>
                  <span className="shrink-0 text-grey-text">
                    {formatFileSize(att.fileSize)}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteAttachment(att.id)}
                  aria-label={`Delete ${att.fileName}`}
                  className="ml-2 shrink-0 text-grey-text hover:text-deep-black"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {attachments.length === 0 && (
          <Card padding="sm" className="mt-2 text-center">
            <div className="flex flex-col items-center gap-1 py-4">
              <FileText size={20} className="text-grey-text" strokeWidth={1.2} />
              <p className="text-xs text-grey-text">No files yet. Upload briefs, drafts, or research.</p>
            </div>
          </Card>
        )}
      </div>

      {/* Related notes */}
      {notes.length > 0 && (
        <div className="mt-4 pb-4">
          <h3 className="text-sm font-semibold">Module Notes</h3>
          <div className="mt-2 space-y-2">
            {notes.slice(0, 3).map((note) => (
              <Card key={note.id} padding="sm">
                <div className="flex items-start gap-2">
                  <StickyNote size={13} className="mt-0.5 shrink-0 text-grey-text" />
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
        </div>
      )}
    </AppShell>
  );
}
