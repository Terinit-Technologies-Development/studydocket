"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, X, Upload } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { fetchModules, createNote } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Module } from "@/lib/types";

interface AddNoteFormProps {
  open: boolean;
  onClose: () => void;
}

export function AddNoteForm({ open, onClose }: AddNoteFormProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetchModules().then(setModules);
    }
  }, [open]);

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  }

  function removeFile(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!moduleId) return;
    setSubmitting(true);

    try {
      const note = await createNote({ title, moduleId, content, tags });
      if (!note) throw new Error("Failed to create note");

      for (const file of files) {
        const filePath = `${note.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("note-attachments")
          .upload(filePath, file);

        if (!uploadError) {
          const { error: attachError } = await supabase
            .from("note_attachments")
            .insert({
              note_id: note.id,
              user_id: "00000000-0000-0000-0000-000000000001",
              file_name: file.name,
              file_path: filePath,
              file_size: file.size,
              file_type: file.type || "application/octet-stream",
            });

          if (attachError) console.error("Failed to save attachment record:", attachError);
        } else {
          console.error("Failed to upload file:", uploadError);
        }
      }

      onClose();
    } catch (err) {
      console.error("Error creating note:", err);
    } finally {
      setSubmitting(false);
    }
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

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-grey-text">Attachments</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-grey-border bg-soft-white text-sm text-grey-text hover:bg-grey-surface transition"
          >
            <Paperclip size={15} />
            Attach files (PDF, images, docs)
          </button>
          {files.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-grey-surface px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Upload size={13} className="shrink-0 text-grey-text" />
                    <span className="truncate">{file.name}</span>
                    <span className="shrink-0 text-grey-text">{formatFileSize(file.size)}</span>
                  </div>
                  <button type="button" onClick={() => removeFile(i)}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
