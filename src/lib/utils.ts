import type { Priority } from "./types";

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function daysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isOverdue(dateString: string): boolean {
  return daysUntil(dateString) < 0;
}

export function isDueSoon(dateString: string, thresholdDays = 3): boolean {
  const days = daysUntil(dateString);
  return days >= 0 && days <= thresholdDays;
}

export function priorityVariant(
  priority: Priority
): "priority-high" | "priority-medium" | "priority-low" {
  const map: Record<Priority, "priority-high" | "priority-medium" | "priority-low"> = {
    high: "priority-high",
    medium: "priority-medium",
    low: "priority-low",
  };
  return map[priority];
}

export function priorityLabel(priority: Priority): string {
  const map: Record<Priority, string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return map[priority];
}
