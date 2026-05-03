"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, FileText, Gavel, Menu, Plus, Scale, Search, Shield } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { AddModuleForm } from "@/components/forms/AddModuleForm";
import { fetchModules } from "@/lib/data";
import type { Module } from "@/lib/types";

const iconMap = {
  scale: Scale,
  "file-text": FileText,
  shield: Shield,
  "book-open": BookOpen,
  search: Search,
};

const lecturerOverrides: Record<string, string> = {
  "00000000-0000-0000-0000-000000000101": "Prof. A. Williams",
  "00000000-0000-0000-0000-000000000102": "Dr. M. Johnson",
  "00000000-0000-0000-0000-000000000103": "Dr. L. Adams",
  "00000000-0000-0000-0000-000000000104": "Prof. S. Patel",
  "00000000-0000-0000-0000-000000000105": "Dr. T. Moore",
};

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [showAddModule, setShowAddModule] = useState(false);

  useEffect(() => {
    fetchModules().then(setModules);
  }, []);

  return (
    <AppShell showNav>
      <header className="grid grid-cols-3 items-center py-3">
        <button aria-label="Open menu" className="justify-self-start rounded-full p-2">
          <Menu size={21} />
        </button>
        <h1 className="text-center text-lg font-semibold">Modules</h1>
        <button
          aria-label="Add module"
          onClick={() => setShowAddModule(true)}
          className="justify-self-end rounded-full bg-deep-black p-1 text-soft-white"
        >
          <Plus size={17} />
        </button>
      </header>

      <section className="mt-4 space-y-3">
        {modules.map((mod, index) => {
          const Icon = iconMap[mod.icon as keyof typeof iconMap] ?? Gavel;
          const active = index === 0;

          return (
            <Link key={mod.id} href={`/modules/${mod.id}`}>
              <Card padding="sm" className="flex items-center gap-4 rounded-xl">
                <div
                  className={
                    active
                      ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-deep-black text-soft-white"
                      : "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-grey-surface text-grey-text"
                  }
                >
                  <Icon size={25} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold">{mod.name}</h2>
                  <p className="mt-1 text-xs text-grey-text">
                    {lecturerOverrides[mod.id] ?? mod.lecturerName}
                  </p>
                </div>
                {index < 3 ? (
                  <span
                    className={
                      active
                        ? "h-3 w-3 rounded-full bg-deep-black"
                        : "h-3 w-3 rounded-full bg-grey-text"
                    }
                  />
                ) : (
                  <ChevronRight size={18} className="text-grey-text" />
                )}
              </Card>
            </Link>
          );
        })}
      </section>

      <AddModuleForm open={showAddModule} onClose={() => setShowAddModule(false)} />
    </AppShell>
  );
}
