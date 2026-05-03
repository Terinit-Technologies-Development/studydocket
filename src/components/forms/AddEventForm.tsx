"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { EventType, Priority } from "@/lib/types";
import { modules } from "@/lib/mock-data";

interface AddEventFormProps {
  open: boolean;
  onClose: () => void;
}

const eventTypes: { value: EventType; label: string }[] = [
  { value: "class", label: "Class" },
  { value: "assignment", label: "Assignment" },
  { value: "assessment", label: "Test / Exam" },
  { value: "study-session", label: "Study Session" },
  { value: "reading", label: "Reading" },
  { value: "personal", label: "Personal" },
];

const priorities: { value: Priority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function AddEventForm({ open, onClose }: AddEventFormProps) {
  const [type, setType] = useState<EventType>("class");
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Event">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {eventTypes.map((et) => (
            <button
              key={et.value}
              type="button"
              onClick={() => setType(et.value)}
              className={
                type === et.value
                  ? "shrink-0 rounded-full bg-deep-black px-3 py-1.5 text-xs font-medium text-soft-white"
                  : "shrink-0 rounded-full border border-grey-border bg-soft-white px-3 py-1.5 text-xs font-medium text-grey-text"
              }
            >
              {et.label}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="event-title" className="text-xs font-medium text-grey-text">Title</label>
          <input
            id="event-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Con Law Lecture"
            className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="event-module" className="text-xs font-medium text-grey-text">Module</label>
          <select
            id="event-module"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
          >
            <option value="">No module</option>
            {modules.map((mod) => (
              <option key={mod.id} value={mod.id}>{mod.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="event-date" className="text-xs font-medium text-grey-text">Date</label>
            <input
              id="event-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="event-priority" className="text-xs font-medium text-grey-text">Priority</label>
            <select
              id="event-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
            >
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="event-start" className="text-xs font-medium text-grey-text">Start</label>
            <input
              id="event-start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="event-end" className="text-xs font-medium text-grey-text">End</label>
            <input
              id="event-end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="event-location" className="text-xs font-medium text-grey-text">Location</label>
          <input
            id="event-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Room 204, Law Building"
            className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="event-notes" className="text-xs font-medium text-grey-text">Notes</label>
          <textarea
            id="event-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes..."
            rows={2}
            className="w-full rounded-xl border border-grey-border bg-soft-white px-3 py-2 text-sm outline-none transition focus:border-deep-black resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">Add Event</Button>
        </div>
      </form>
    </Modal>
  );
}
