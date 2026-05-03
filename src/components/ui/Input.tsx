import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  label,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-grey-text"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "rounded-xl border border-grey-border bg-soft-white px-4 py-2.5 text-sm text-deep-black placeholder:text-grey-text/60 transition-colors duration-150 focus:border-deep-black focus:outline-none focus:ring-1 focus:ring-deep-black",
          error && "border-muted-blush focus:border-muted-blush focus:ring-muted-blush",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-muted-blush">{error}</p>
      )}
    </div>
  );
}
