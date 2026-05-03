"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { modules } from "@/lib/mock-data";
import { X } from "lucide-react";

interface AddNoteFormProps {
  open: boolean;
  onClose: () => void;
}

export function AddNoteForm({ open, onClose }: AddNoteFormProps) {
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  function addTag() {
    const trimmed = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleTagKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Note">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="note-title" className="text-xs font-medium text-grey-text">Title</label>
          <input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Judicial Review — Key Grounds"
            className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="note-module" className="text-xs font-medium text-grey-text">Module</label>
          <select
            id="note-module"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
            required
          >
            <option value="">Select module</option>
            {modules.map((mod) => (
              <option key={mod.id} value={mod.id}>{mod.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="note-content" className="text-xs font-medium text-grey-text">Content</label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your notes here..."
            rows={5}
            className="w-full rounded-xl border border-grey-border bg-soft-white px-3 py-2 text-sm outline-none transition focus:border-deep-black resize-none"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="note-tags" className="text-xs font-medium text-grey-text">Tags</label>
          <div className="flex gap-2">
            <input
              id="note-tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              placeholder="e.g. exam, flowchart"
              className="h-11 flex-1 rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
            />
            <button
              type="button"
              onClick={addTag}
              className="h-11 rounded-xl border border-grey-border bg-grey-surface px-4 text-sm font-medium hover:bg-grey-border transition"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-grey-surface px-2.5 py-1 text-[11px] font-medium"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">Save Note</Button>
        </div>
      </form>
    </Modal>
  );
}
