"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, error, label, helperText, containerClassName, id, ...props }, ref) => {
  const checkboxId = id || React.useId();
  const errorId = `${checkboxId}-error`;
  const helperId = `${checkboxId}-helper`;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className="flex items-start space-x-2">
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={cn(
            error && errorId,
            helperText && helperId
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={cn("flex items-center justify-center text-current")}
          >
            <Check className="h-4 w-4" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          id={helperId}
          className="text-sm text-muted-foreground"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox }; 