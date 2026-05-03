"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Clock3, MapPin, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

type View = "Day" | "Week" | "Month" | "Agenda";

const views: View[] = ["Day", "Week", "Month", "Agenda"];

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayNumbers = ["12", "13", "14", "15", "16", "17", "18"];
const weekHours = [
  "All-day",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
];

const weekBlocks = [
  {
    title: "Con Law Lecture",
    detail: "10:00 - 12:00\nRoom 204",
    className:
      "left-[18%] top-[120px] h-[86px] w-[23%] bg-deep-black text-soft-white",
  },
  {
    title: "Legal Research Tutorial",
    detail: "1:00 - 2:00\nOnline",
    className:
      "left-[18%] top-[245px] h-[78px] w-[23%] bg-grey-surface text-deep-black",
  },
  {
    title: "Criminal Law Lecture",
    detail: "3:00 - 4:00\nRoom 101",
    className:
      "left-[54%] top-[332px] h-[78px] w-[23%] bg-soft-white text-deep-black border border-grey-border",
  },
  {
    title: "Study Session",
    detail: "Contract Law\n6:00 - 8:00",
    className:
      "left-[18%] top-[475px] h-[92px] w-[23%] bg-deep-black text-soft-white",
  },
  {
    title: "Work",
    detail: "10:00 - 2:00",
    className:
      "left-[78%] top-[120px] h-[215px] w-[20%] bg-grey-surface text-deep-black",
  },
  {
    title: "Family Dinner",
    detail: "7:00 - 9:00",
    className:
      "left-[78%] top-[520px] h-[88px] w-[20%] bg-grey-surface text-deep-black",
  },
];

const dayBlocks = [
  {
    title: "Con Law Lecture",
    detail: "10:00 - 12:00\nRoom 204",
    className:
      "left-[8%] top-[198px] h-[86px] w-[84%] bg-deep-black text-soft-white",
  },
  {
    title: "Study Session",
    detail: "Contract Law\n6:00 - 8:00",
    className:
      "left-[8%] top-[560px] h-[92px] w-[84%] bg-grey-surface text-deep-black",
  },
];

const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
const monthStartDay = 2;
const monthEventMarkers: Record<number, number[]> = {
  5: [0],
  6: [1],
  7: [1],
  12: [0],
  13: [1],
  14: [0, 1],
  15: [0],
  19: [1],
  20: [0],
  21: [1],
};

const markerColors = [
  "bg-muted-gold",
  "bg-sage",
];

const agendaItems = [
  { id: "a-1", title: "Con Law Lecture", module: "Constitutional Law", time: "10:00 - 12:00", location: "Room 204", date: "Wed, 14 May" },
  { id: "a-2", title: "Legal Research Tutorial", module: "Legal Research", time: "1:00 - 2:00", location: "Online", date: "Wed, 14 May" },
  { id: "a-3", title: "Criminal Law Lecture", module: "Criminal Law", time: "3:00 - 4:00", location: "Room 101", date: "Wed, 14 May" },
  { id: "a-4", title: "Study Session", module: "Contract Law", time: "6:00 - 8:00", location: "Library", date: "Wed, 14 May" },
  { id: "a-5", title: "Skills Workshop", module: "Legal Skills", time: "11:00 - 13:00", location: "Room 305", date: "Thu, 15 May" },
  { id: "a-6", title: "Criminal Law — Study Group", module: "Criminal Law", time: "15:00 - 17:00", location: "Cafe Nero", date: "Thu, 15 May" },
  { id: "a-7", title: "Contract Law Tutorial", module: "Contract Law", time: "14:00 - 15:00", location: "Room 104", date: "Fri, 16 May" },
];

export default function CalendarPage() {
  const [view, setView] = useState<View>("Week");

  return (
    <AppShell showNav>
      <header className="flex items-center justify-between py-3">
        <button className="flex items-center gap-1 text-xl font-semibold">
          May 2025 <ChevronDown size={18} />
        </button>
        <button aria-label="Today" className="rounded-full p-2">
          <Clock3 size={20} />
        </button>
      </header>

      <div className="grid grid-cols-4 gap-1 rounded-full bg-grey-surface p-1 text-xs font-medium">
        {views.map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={cn(
              "rounded-full py-2 transition",
              view === tab
                ? "bg-deep-black text-soft-white"
                : "text-deep-black"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {view === "Day" && <DayView />}
      {view === "Week" && <WeekView />}
      {view === "Month" && <MonthView />}
      {view === "Agenda" && <AgendaView />}
    </AppShell>
  );
}

function DayView() {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-xs text-grey-text">Wed</p>
          <p className="flex h-10 w-10 items-center justify-center rounded-full bg-deep-black text-sm font-semibold text-soft-white">
            14
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[11px] text-grey-text">3 events today</p>
          <p className="text-xs font-medium">6.5 hours scheduled</p>
        </div>
      </div>

      <div className="relative mt-5 min-h-[640px] overflow-hidden rounded-t-2xl border-t border-grey-border bg-paper-white">
        {weekHours.map((hour, index) => (
          <div
            key={hour}
            className="grid grid-cols-[48px_1fr] border-b border-grey-border/70 text-[11px] text-grey-text"
            style={{ height: index === 0 ? 36 : 48 }}
          >
            <span className="pt-1">{hour}</span>
            <span />
          </div>
        ))}

        {dayBlocks.map((block) => (
          <div
            key={block.title}
            className={cn(
              "absolute rounded-md p-2 text-[10px] leading-tight shadow-sm",
              block.className
            )}
          >
            <p className="font-semibold">{block.title}</p>
            <p className="mt-1 whitespace-pre-line opacity-80">{block.detail}</p>
          </div>
        ))}

        <Link
          href="/events/new"
          className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-deep-black text-soft-white shadow-lg"
          aria-label="Add event"
        >
          <Plus size={26} />
        </Link>
      </div>
    </section>
  );
}

function WeekView() {
  return (
    <section className="mt-5">
      <div className="ml-12 grid grid-cols-7 text-center">
        {dayLabels.map((label, index) => (
          <div key={label} className="space-y-1 text-xs">
            <p className="text-grey-text">{label}</p>
            <p
              className={cn(
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full font-semibold",
                dayNumbers[index] === "14" && "bg-deep-black text-soft-white"
              )}
            >
              {dayNumbers[index]}
            </p>
          </div>
        ))}
      </div>

      <div className="relative mt-5 min-h-[640px] overflow-hidden rounded-t-2xl border-t border-grey-border bg-paper-white">
        <div className="absolute left-12 right-0 top-0 grid h-full grid-cols-7">
          {dayNumbers.map((day) => (
            <div key={day} className="border-l border-grey-border/70" />
          ))}
        </div>

        {weekHours.map((hour, index) => (
          <div
            key={hour}
            className="grid grid-cols-[48px_1fr] border-b border-grey-border/70 text-[11px] text-grey-text"
            style={{ height: index === 0 ? 36 : 48 }}
          >
            <span className="pt-1">{hour}</span>
            <span />
          </div>
        ))}

        {weekBlocks.map((block) => (
          <div
            key={block.title}
            className={cn(
              "absolute rounded-md p-2 text-[10px] leading-tight shadow-sm",
              block.className
            )}
          >
            <p className="font-semibold">{block.title}</p>
            <p className="mt-1 whitespace-pre-line opacity-80">{block.detail}</p>
          </div>
        ))}

        <Link
          href="/events/new"
          className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-deep-black text-soft-white shadow-lg"
          aria-label="Add event"
        >
          <Plus size={26} />
        </Link>
      </div>
    </section>
  );
}

function MonthView() {
  return (
    <section className="mt-5">
      <div className="grid grid-cols-7 text-center">
        {dayLabels.map((label) => (
          <p key={label} className="pb-2 text-[11px] font-medium text-grey-text">
            {label}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 border-t border-l border-grey-border">
        {Array.from({ length: monthStartDay }).map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square border-r border-b border-grey-border bg-grey-surface/30" />
        ))}

        {monthDays.map((day) => {
          const markers = monthEventMarkers[day] ?? [];
          const isToday = day === 14;

          return (
            <div
              key={day}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 aspect-square border-r border-b border-grey-border text-xs",
                isToday && "bg-grey-surface/40"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs",
                  isToday && "bg-deep-black font-semibold text-soft-white"
                )}
              >
                {day}
              </span>

              {markers.length > 0 && (
                <div className="flex gap-0.5">
                  {markers.map((colorIdx, i) => (
                    <span
                      key={i}
                      className={cn("h-1.5 w-1.5 rounded-full", markerColors[colorIdx])}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="text-sm font-semibold">Events on Wed, 14 May</h3>
        {agendaItems.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-xl border border-grey-border bg-soft-white p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-grey-surface">
              <Clock3 size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-0.5 text-xs text-grey-text">{item.module}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-grey-text">
                <span>{item.time}</span>
                <span className="flex items-center gap-0.5">
                  <MapPin size={10} /> {item.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/events/new"
        className="fixed bottom-24 right-[calc(50%-12rem)] flex h-14 w-14 items-center justify-center rounded-full bg-deep-black text-soft-white shadow-lg"
        aria-label="Add event"
      >
        <Plus size={26} />
      </Link>
    </section>
  );
}

function AgendaView() {
  return (
    <section className="mt-5 space-y-6">
      {(["Wed, 14 May", "Thu, 15 May", "Fri, 16 May"] as const).map((dateLabel) => {
        const dayItems = agendaItems.filter((item) => item.date === dateLabel);
        if (dayItems.length === 0) return null;

        return (
          <div key={dateLabel}>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-semibold">{dateLabel}</h3>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-grey-surface text-[10px] font-semibold">
                {dayItems.length}
              </span>
            </div>

            <div className="space-y-2">
              {dayItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-grey-border bg-soft-white p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-grey-surface">
                    <Clock3 size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-xs text-grey-text">{item.module}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-grey-text">
                      <span>{item.time}</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin size={10} /> {item.location}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={15} className="mt-2 text-grey-text" />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <Link
        href="/events/new"
        className="fixed bottom-24 right-[calc(50%-12rem)] flex h-14 w-14 items-center justify-center rounded-full bg-deep-black text-soft-white shadow-lg"
        aria-label="Add event"
      >
        <Plus size={26} />
      </Link>
    </section>
  );
}
