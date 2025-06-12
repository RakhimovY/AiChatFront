"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        destructive: "border-destructive bg-destructive/10",
        success: "border-green-500 bg-green-500/10",
        warning: "border-yellow-500 bg-yellow-500/10",
        info: "border-blue-500 bg-blue-500/10",
      },
      size: {
        default: "p-0",
        sm: "p-2",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type BaseCardProps = {
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
  id?: string;
}

type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> &
  BaseCardProps & {
    icon?: React.ReactNode;
    isHoverable?: boolean;
    isClickable?: boolean;
    onClick?: () => void;
  }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant,
    size,
    error,
    label,
    helperText,
    containerClassName,
    id,
    icon,
    isHoverable,
    isClickable,
    onClick,
    children,
    ...props 
  }, ref) => {
    const cardId = id || React.useId();
    const errorId = `${cardId}-error`;
    const helperId = `${cardId}-helper`;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={cardId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div
          ref={ref}
          id={cardId}
          className={cn(
            cardVariants({ variant, size }),
            error && "border-destructive focus:ring-destructive",
            isHoverable && "transition-colors hover:bg-accent hover:text-accent-foreground",
            isClickable && "cursor-pointer",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={cn(
            error && errorId,
            helperText && helperId
          )}
          onClick={isClickable ? onClick : undefined}
          role={isClickable ? "button" : undefined}
          tabIndex={isClickable ? 0 : undefined}
          {...props}
        >
          {icon && <div className="mb-4">{icon}</div>}
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
)
Card.displayName = "Card"

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & BaseCardProps;

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ 
    className, 
    error,
    label,
    helperText,
    containerClassName,
    id,
    children,
    ...props 
  }, ref) => {
    const headerId = id || React.useId();
    const errorId = `${headerId}-error`;
    const helperId = `${headerId}-helper`;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={headerId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div
          ref={ref}
          id={headerId}
          className={cn(
            "flex flex-col space-y-1.5 p-6",
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
)
CardHeader.displayName = "CardHeader"

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & BaseCardProps;

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ 
    className, 
    error,
    label,
    helperText,
    containerClassName,
    id,
    children,
    ...props 
  }, ref) => {
    const titleId = id || React.useId();
    const errorId = `${titleId}-error`;
    const helperId = `${titleId}-helper`;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={titleId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <h3
          ref={ref}
          id={titleId}
          className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
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
        </h3>
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
)
CardTitle.displayName = "CardTitle"

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & BaseCardProps;

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ 
    className, 
    error,
    label,
    helperText,
    containerClassName,
    id,
    children,
    ...props 
  }, ref) => {
    const descriptionId = id || React.useId();
    const errorId = `${descriptionId}-error`;
    const helperId = `${descriptionId}-helper`;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={descriptionId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <p
          ref={ref}
          id={descriptionId}
          className={cn(
            "text-sm text-muted-foreground",
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
        </p>
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
)
CardDescription.displayName = "CardDescription"

type CardContentProps = React.HTMLAttributes<HTMLDivElement> & BaseCardProps;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ 
    className, 
    error,
    label,
    helperText,
    containerClassName,
    id,
    children,
    ...props 
  }, ref) => {
    const contentId = id || React.useId();
    const errorId = `${contentId}-error`;
    const helperId = `${contentId}-helper`;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={contentId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div
          ref={ref}
          id={contentId}
          className={cn(
            "p-6 pt-0",
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
)
CardContent.displayName = "CardContent"

type CardFooterProps = React.HTMLAttributes<HTMLDivElement> & BaseCardProps;

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ 
    className, 
    error,
    label,
    helperText,
    containerClassName,
    id,
    children,
    ...props 
  }, ref) => {
    const footerId = id || React.useId();
    const errorId = `${footerId}-error`;
    const helperId = `${footerId}-helper`;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={footerId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div
          ref={ref}
          id={footerId}
          className={cn(
            "flex items-center p-6 pt-0",
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
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }