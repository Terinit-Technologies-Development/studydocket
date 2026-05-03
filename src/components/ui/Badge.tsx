import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "priority-high"
  | "priority-medium"
  | "priority-low"
  | "success"
  | "warning";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-grey-surface text-grey-text",
  "priority-high": "bg-muted-blush/40 text-deep-black",
  "priority-medium": "bg-muted-gold/30 text-deep-black",
  "priority-low": "bg-sage/40 text-deep-black",
  success: "bg-sage/40 text-deep-black",
  warning: "bg-muted-blush/40 text-deep-black",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
