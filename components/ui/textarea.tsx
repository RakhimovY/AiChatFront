"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  helperText?: string
  containerClassName?: string
  maxLength?: number
  showCharacterCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    error,
    label,
    helperText,
    containerClassName,
    id,
    maxLength,
    showCharacterCount,
    ...props 
  }, ref) => {
    const textareaId = id || React.useId()
    const errorId = `${textareaId}-error`
    const helperId = `${textareaId}-helper`
    const [charCount, setCharCount] = React.useState(0)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setCharCount(value.length)
      props.onChange?.(e)
    }

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId
            )}
            maxLength={maxLength}
            onChange={handleChange}
            {...props}
          />
          {showCharacterCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {charCount}/{maxLength}
            </div>
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
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }