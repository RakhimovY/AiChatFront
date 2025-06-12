"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        error: "text-destructive",
        success: "text-green-500",
        warning: "text-yellow-500",
        info: "text-blue-500",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
        xl: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  error?: string;
  helperText?: string;
  containerClassName?: string;
  id?: string;
  required?: boolean;
  optional?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ 
  className, 
  variant,
  size,
  error,
  helperText,
  containerClassName,
  id,
  required,
  optional,
  children,
  ...props 
}, ref) => {
  const labelId = id || React.useId();
  const errorId = `${labelId}-error`;
  const helperId = `${labelId}-helper`;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <LabelPrimitive.Root
        ref={ref}
        id={labelId}
        className={cn(
          labelVariants({ variant, size }),
          error && "text-destructive",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={cn(
          error && errorId,
          helperText && helperId
        )}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ml-1">*</span>}
        {optional && <span className="text-muted-foreground ml-1">(optional)</span>}
      </LabelPrimitive.Root>
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
})
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }