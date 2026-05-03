"use client";

import { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Paperclip,
  StickyNote,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  fetchNoteById,
  fetchModuleById,
  fetchNoteAttachments,
  uploadNoteFile,
  deleteNoteAttachment,
  deleteNote,
} from "@/lib/data";
import type { Module, Note, NoteAttachment } from "@/lib/types";

function formatDateStr(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const moduleColors: Record<string, { bg: string; text: string }> = {
  "00000000-0000-0000-0000-000000000101": { bg: "bg-deep-black", text: "text-soft-white" },
  "00000000-0000-0000-0000-000000000102": { bg: "bg-muted-gold/20", text: "text-deep-black" },
  "00000000-0000-0000-0000-000000000103": { bg: "bg-muted-blush/30", text: "text-deep-black" },
  "00000000-0000-0000-0000-000000000104": { bg: "bg-sage/30", text: "text-deep-black" },
  "00000000-0000-0000-0000-000000000105": { bg: "bg-soft-beige/60", text: "text-deep-black" },
};

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [mod, setMod] = useState<Module | null>(null);
  const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNoteById(id).then((n) => {
      if (!n) return;
      setNote(n);
      fetchModuleById(n.moduleId).then(setMod);
      fetchNoteAttachments(id).then(setAttachments);
    });
  }, [id]);

  async function handleDelete() {
    if (!confirm("Delete this note?")) return;
    setDeleting(true);
    await deleteNote(id);
    router.push("/overview");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    for (const file of Array.from(e.target.files)) {
      const attachment = await uploadNoteFile(id, file);
      if (attachment) setAttachments((prev) => [attachment, ...prev]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleRemoveAttachment(attachmentId: string) {
    await deleteNoteAttachment(attachmentId);
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  }

  if (!note) {
    return (
      <AppShell showNav={false}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-grey-text">Loading note...</p>
        </div>
      </AppShell>
    );
  }

  const color = mod ? moduleColors[mod.id] : { bg: "bg-grey-surface", text: "text-deep-black" };

  return (
    <AppShell showNav={false}>
      {/* Header */}
      <header className="flex items-center justify-between py-3">
        <Link href="/overview" className="rounded-full p-2">
          <ArrowLeft size={21} />
        </Link>
        <h1 className="text-center text-base font-semibold">Note</h1>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-full p-2 text-grey-text hover:text-muted-blush transition"
          aria-label="Delete note"
        >
          <Trash2 size={18} />
        </button>
      </header>

      {/* Module context */}
      {mod && (
        <Link
          href={`/modules/${mod.id}`}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-grey-text hover:text-deep-black"
        >
          <div className={`flex h-5 w-5 items-center justify-center rounded ${color.bg} ${color.text}`}>
            <StickyNote size={10} strokeWidth={2} />
          </div>
          {mod.name}
        </Link>
      )}

      {/* Title */}
      <h2 className="text-xl font-semibold leading-snug">{note.title}</h2>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="default">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Dates */}
      <div className="mt-3 flex items-center gap-3 text-[11px] text-grey-text">
        <span>Created {formatDateStr(note.createdAt)}</span>
        <span className="text-grey-border">|</span>
        <span>Updated {formatDateStr(note.updatedAt)}</span>
      </div>

      {/* Content */}
      <Card padding="md" className="mt-4">
        <div className="whitespace-pre-line text-sm leading-relaxed">
          {note.content}
        </div>
      </Card>

      {/* Attachments */}
      <div className="mt-5 pb-8">
        <h3 className="text-sm font-semibold">Attachments</h3>

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
          Upload files (PDF, docs, images)
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
                  onClick={() => handleRemoveAttachment(att.id)}
                  aria-label={`Delete ${att.fileName}`}
                  className="ml-2 shrink-0 text-grey-text hover:text-deep-black transition"
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
              <p className="text-xs text-grey-text">No files attached. Upload PDFs, docs, or images.</p>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
