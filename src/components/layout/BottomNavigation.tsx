"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  ClipboardList,
  StickyNote,
} from "lucide-react";

interface BottomNavigationProps {
  variant?: "light" | "dark";
}

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/modules", label: "Modules", icon: BookOpen },
  { href: "/assignments", label: "Tasks", icon: ClipboardList },
  { href: "/overview", label: "Notes", icon: StickyNote },
];

export function BottomNavigation({
  variant = "light",
}: BottomNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-md border-t px-2 pb-safe",
        variant === "dark"
          ? "border-soft-black bg-soft-black"
          : "border-grey-border bg-soft-white"
      )}
    >
      <div className="flex items-center justify-between py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors duration-150",
                active
                  ? variant === "dark"
                    ? "text-muted-gold"
                    : "text-deep-black"
                  : variant === "dark"
                    ? "text-grey-text hover:text-soft-white"
                    : "text-grey-text hover:text-deep-black"
              )}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.75}
                className={cn(
                  "transition-all duration-150",
                  active && "scale-110"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
