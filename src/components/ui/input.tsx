import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="grid gap-2 text-sm font-medium">
        {label ? <label htmlFor={inputId}>{label}</label> : null}
        <input
          id={inputId}
          className={cn(
            "h-10 rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? (
          <span className="text-xs font-normal text-destructive">{error}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
