"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TacticalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const TacticalButton = forwardRef<HTMLButtonElement, TacticalButtonProps>(
  ({ variant = "primary", size = "md", children, className, ...props }, ref) => {
    const sizeClass = {
      sm: "h-8 px-4 text-xs",
      md: "h-10 px-6 text-sm",
      lg: "h-12 px-8 text-sm",
    }[size];

    const isPrimary = variant === "primary";

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2",
          "font-mono uppercase tracking-widest",
          "tactical-shape transition-all duration-200",
          "before:absolute before:inset-0 before:tactical-shape before:transition-all before:duration-300",
          "overflow-hidden group",
          isPrimary
            ? "text-primary-foreground before:bg-primary hover:before:bg-primary/90"
            : "text-primary before:bg-transparent before:border before:border-primary/40 hover:before:border-primary",
          sizeClass,
          className
        )}
        {...props}
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
TacticalButton.displayName = "TacticalButton";
