"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";

interface AppShellProps {
  children: ReactNode;
  showNav?: boolean;
  variant?: "light" | "dark";
  className?: string;
}

export function AppShell({
  children,
  showNav = true,
  variant = "light",
  className,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen w-full max-w-md flex-col",
        variant === "dark" ? "bg-soft-black text-soft-white" : "bg-off-white text-deep-black",
        className
      )}
    >
      <main className={cn("flex-1 px-4 pt-4", showNav && "pb-24")}>
        {children}
      </main>
      {showNav && <BottomNavigation variant={variant} />}
    </div>
  );
}
