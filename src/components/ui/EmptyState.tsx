import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      <h3 className="text-lg font-semibold text-deep-black">{title}</h3>
      <p className="max-w-xs text-sm text-grey-text leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
