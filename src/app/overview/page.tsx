"use client";

import { useState } from "react";
import { ChevronRight, Menu, Plus, Search, StickyNote } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AddNoteForm } from "@/components/forms/AddNoteForm";
import { modules, notes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function moduleById(id: string) {
  return modules.find((mod) => mod.id === id);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const moduleColors: Record<string, { bg: string; text: string }> = {
  "mod-conlaw": { bg: "bg-deep-black", text: "text-soft-white" },
  "mod-contracts": { bg: "bg-muted-gold/20", text: "text-deep-black" },
  "mod-criminal": { bg: "bg-muted-blush/30", text: "text-deep-black" },
  "mod-skills": { bg: "bg-sage/30", text: "text-deep-black" },
  "mod-research": { bg: "bg-soft-beige/60", text: "text-deep-black" },
};

export default function NotesPage() {
  const [showAddNote, setShowAddNote] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      !search ||
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesModule = !selectedModule || note.moduleId === selectedModule;
    return matchesSearch && matchesModule;
  });

  return (
    <AppShell showNav>
      <header className="grid grid-cols-3 items-center py-3">
        <button aria-label="Open menu" className="justify-self-start rounded-full p-2">
          <Menu size={21} />
        </button>
        <h1 className="text-center text-lg font-semibold">Notes</h1>
        <button
          aria-label="Add note"
          onClick={() => setShowAddNote(true)}
          className="justify-self-end rounded-full bg-deep-black p-1 text-soft-white"
        >
          <Plus size={17} />
        </button>
      </header>

      <div className="relative mt-1">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-text"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="h-10 w-full rounded-xl border border-grey-border bg-soft-white pl-9 pr-3 text-sm outline-none transition focus:border-deep-black"
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedModule(null)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition",
            !selectedModule
              ? "bg-deep-black text-soft-white"
              : "border border-grey-border bg-soft-white text-grey-text"
          )}
        >
          All Notes
        </button>
        {modules.map((mod) => {
          const count = notes.filter((n) => n.moduleId === mod.id).length;
          return (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition flex items-center gap-1.5",
                selectedModule === mod.id
                  ? "bg-deep-black text-soft-white"
                  : "border border-grey-border bg-soft-white text-grey-text"
              )}
            >
              {mod.name.split(" ")[0]}
              {count > 0 && (
                <span
                  className={cn(
                    "flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                    selectedModule === mod.id
                      ? "bg-soft-white/20 text-soft-white"
                      : "bg-grey-surface text-grey-text"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <section className="mt-4 space-y-3">
        {filteredNotes.length === 0 && (
          <Card className="text-center">
            <div className="flex flex-col items-center gap-2 py-8">
              <StickyNote size={36} className="text-grey-text" strokeWidth={1.2} />
              <p className="text-sm font-medium">No notes found</p>
              <p className="text-xs text-grey-text">
                {search ? "Try a different search term." : "Tap + to add your first note."}
              </p>
            </div>
          </Card>
        )}

        {filteredNotes.map((note) => {
          const mod = moduleById(note.moduleId);
          const color = mod ? moduleColors[mod.id] : { bg: "bg-grey-surface", text: "text-deep-black" };

          return (
            <Card key={note.id} padding="sm" className="rounded-xl">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    color.bg,
                    color.text
                  )}
                >
                  <StickyNote size={15} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="truncate text-sm font-semibold">{note.title}</h2>
                    <ChevronRight size={14} className="shrink-0 text-grey-text" />
                  </div>

                  {mod && (
                    <p className="mt-0.5 text-xs text-grey-text">{mod.name}</p>
                  )}

                  <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-grey-text">
                    {note.content}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-[11px] text-grey-text">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <AddNoteForm open={showAddNote} onClose={() => setShowAddNote(false)} />
    </AppShell>
  );
}
