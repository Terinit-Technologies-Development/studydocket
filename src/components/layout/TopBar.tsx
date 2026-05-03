import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TopBarProps {
  title: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  variant?: "light" | "dark";
  className?: string;
}

export function TopBar({
  title,
  leftAction,
  rightAction,
  variant = "light",
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-1 py-3",
        variant === "dark" ? "text-soft-white" : "text-deep-black",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {leftAction}
        <h1 className="truncate text-xl font-semibold tracking-tight">
          {title}
        </h1>
      </div>
      {rightAction && <div className="flex items-center">{rightAction}</div>}
    </header>
  );
}
