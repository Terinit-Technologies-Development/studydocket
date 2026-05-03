"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Priority, Module } from "@/lib/types";
import { fetchModules } from "@/lib/data";

interface AddTaskFormProps {
  open: boolean;
  onClose: () => void;
}

const priorities: { value: Priority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function AddTaskForm({ open, onClose }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (open) fetchModules().then(setModules);
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="task-title" className="text-xs font-medium text-grey-text">Title</label>
          <input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Tort Law Essay"
            className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="task-module" className="text-xs font-medium text-grey-text">Module</label>
          <select
            id="task-module"
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
          <label htmlFor="task-desc" className="text-xs font-medium text-grey-text">Description</label>
          <textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the task..."
            rows={2}
            className="w-full rounded-xl border border-grey-border bg-soft-white px-3 py-2 text-sm outline-none transition focus:border-deep-black resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="task-due" className="text-xs font-medium text-grey-text">Due Date</label>
            <input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="task-hours" className="text-xs font-medium text-grey-text">Est. Hours</label>
            <input
              id="task-hours"
              type="number"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="e.g. 8"
              min="1"
              className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="task-priority" className="text-xs font-medium text-grey-text">Priority</label>
          <div className="flex gap-2">
            {priorities.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={
                  priority === p.value
                    ? "flex-1 rounded-xl bg-deep-black py-2 text-xs font-medium text-soft-white"
                    : "flex-1 rounded-xl border border-grey-border bg-soft-white py-2 text-xs font-medium text-grey-text"
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">Add Task</Button>
        </div>
      </form>
    </Modal>
  );
}
