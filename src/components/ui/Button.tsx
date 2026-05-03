import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-deep-black text-soft-white hover:bg-soft-black active:bg-deep-black",
  secondary:
    "bg-soft-white text-deep-black border border-grey-border hover:bg-grey-surface active:bg-grey-border",
  ghost:
    "bg-transparent text-deep-black hover:bg-grey-surface active:bg-grey-border",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-base rounded-xl",
  lg: "px-6 py-3 text-lg rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-deep-black focus-visible:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-40 pointer-events-none",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
