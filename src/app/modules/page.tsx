import Link from "next/link";
import { BookOpen, ChevronRight, FileText, Gavel, Menu, Plus, Scale, Search, Shield } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { modules } from "@/lib/mock-data";

const iconMap = {
  scale: Scale,
  "file-text": FileText,
  shield: Shield,
  "book-open": BookOpen,
  search: Search,
};

const lecturerOverrides: Record<string, string> = {
  "mod-conlaw": "Prof. A. Williams",
  "mod-contracts": "Dr. M. Johnson",
  "mod-criminal": "Dr. L. Adams",
  "mod-skills": "Prof. S. Patel",
  "mod-research": "Dr. T. Moore",
};

export default function ModulesPage() {
  return (
    <AppShell showNav>
      <header className="grid grid-cols-3 items-center py-3">
        <button aria-label="Open menu" className="justify-self-start rounded-full p-2">
          <Menu size={21} />
        </button>
        <h1 className="text-center text-lg font-semibold">Modules</h1>
        <button aria-label="Add module" className="justify-self-end rounded-full bg-deep-black p-1 text-soft-white">
          <Plus size={17} />
        </button>
      </header>

      <section className="mt-4 space-y-3">
        {modules.map((module, index) => {
          const Icon = iconMap[module.icon as keyof typeof iconMap] ?? Gavel;
          const active = index === 0;

          return (
            <Link key={module.id} href={`/modules/${module.id}`}>
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
                  <h2 className="truncate text-sm font-semibold">{module.name}</h2>
                  <p className="mt-1 text-xs text-grey-text">
                    {lecturerOverrides[module.id] ?? module.lecturerName}
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
    </AppShell>
  );
}
