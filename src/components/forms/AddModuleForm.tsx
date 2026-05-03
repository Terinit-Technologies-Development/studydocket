"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface AddModuleFormProps {
  open: boolean;
  onClose: () => void;
}

const colors = [
  { value: "#050505", label: "Black" },
  { value: "#C8A24A", label: "Gold" },
  { value: "#F3C6BD", label: "Blush" },
  { value: "#CAD2C5", label: "Sage" },
  { value: "#EFE7D0", label: "Beige" },
  { value: "#6B6B6B", label: "Grey" },
];

export function AddModuleForm({ open, onClose }: AddModuleFormProps) {
  const [name, setName] = useState("");
  const [lecturerName, setLecturerName] = useState("");
  const [color, setColor] = useState("#050505");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Module">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="mod-name" className="text-xs font-medium text-grey-text">Module Name</label>
          <input
            id="mod-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tort Law"
            className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="mod-lecturer" className="text-xs font-medium text-grey-text">Lecturer</label>
          <input
            id="mod-lecturer"
            value={lecturerName}
            onChange={(e) => setLecturerName(e.target.value)}
            placeholder="e.g. Prof. J. Smith"
            className="h-11 w-full rounded-xl border border-grey-border bg-soft-white px-3 text-sm outline-none transition focus:border-deep-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-grey-text">Colour</label>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className="flex flex-col items-center gap-1"
                title={c.label}
              >
                <span
                  className="h-8 w-8 rounded-full border-2 transition"
                  style={{
                    backgroundColor: c.value,
                    borderColor: color === c.value ? "#050505" : "transparent",
                    boxShadow: color === c.value ? "0 0 0 2px #E5E5E5" : "none",
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="mod-notes" className="text-xs font-medium text-grey-text">Notes</label>
          <textarea
            id="mod-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Monday and Wednesday lectures..."
            rows={2}
            className="w-full rounded-xl border border-grey-border bg-soft-white px-3 py-2 text-sm outline-none transition focus:border-deep-black resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">Add Module</Button>
        </div>
      </form>
    </Modal>
  );
}
