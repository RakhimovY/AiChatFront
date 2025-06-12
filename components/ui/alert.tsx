"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500/50 text-green-500 dark:border-green-500 [&>svg]:text-green-500",
        warning:
          "border-yellow-500/50 text-yellow-500 dark:border-yellow-500 [&>svg]:text-yellow-500",
        info:
          "border-blue-500/50 text-blue-500 dark:border-blue-500 [&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
  id?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  dismissible?: boolean;
}

const Alert = React.forwardRef<
  HTMLDivElement,
  AlertProps
>(({ 
  className, 
  variant, 
  error,
  label,
  helperText,
  containerClassName,
  id,
  icon,
  onClose,
  dismissible,
  children,
  ...props 
}, ref) => {
  const alertId = id || React.useId();
  const errorId = `${alertId}-error`;
  const helperId = `${alertId}-helper`;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label
          htmlFor={alertId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <div
        ref={ref}
        id={alertId}
        role="alert"
        className={cn(
          alertVariants({ variant }),
          error && "border-destructive focus:ring-destructive",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={cn(
          error && errorId,
          helperText && helperId
        )}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
        {dismissible && (
          <button
            type="button"
            className="absolute right-4 top-4 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={onClose}
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
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
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }