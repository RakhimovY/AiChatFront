import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-500/80",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
      },
      size: {
        default: "text-xs",
        sm: "text-[10px]",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
  id?: string;
  icon?: React.ReactNode;
}

function Badge({ 
  className, 
  variant, 
  size,
  error,
  label,
  helperText,
  containerClassName,
  id,
  icon,
  children,
  ...props 
}: BadgeProps) {
  const badgeId = id || React.useId();
  const errorId = `${badgeId}-error`;
  const helperId = `${badgeId}-helper`;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label
          htmlFor={badgeId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <div
        id={badgeId}
        className={cn(
          badgeVariants({ variant, size }),
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
        {icon && <span className="mr-1">{icon}</span>}
        {children}
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
}

export { Badge, badgeVariants };