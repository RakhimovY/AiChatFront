"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
  id?: string;
  orientation?: "vertical" | "horizontal" | "both";
  scrollHideDelay?: number;
  type?: "auto" | "always" | "scroll" | "hover";
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ 
  className, 
  children, 
  error,
  label,
  helperText,
  containerClassName,
  id,
  orientation = "vertical",
  scrollHideDelay,
  type = "auto",
  ...props 
}, ref) => {
  const scrollAreaId = id || React.useId();
  const errorId = `${scrollAreaId}-error`;
  const helperId = `${scrollAreaId}-helper`;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label
          htmlFor={scrollAreaId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <ScrollAreaPrimitive.Root
        ref={ref}
        id={scrollAreaId}
        className={cn(
          "relative overflow-hidden",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={cn(
          error && errorId,
          helperText && helperId
        )}
        type={type}
        scrollHideDelay={scrollHideDelay}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport 
          className="h-full w-full rounded-[inherit]"
          role="presentation"
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        {orientation !== "horizontal" && <ScrollBar orientation="vertical" />}
        {orientation !== "vertical" && <ScrollBar orientation="horizontal" />}
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
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
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
  id?: string;
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ 
  className, 
  orientation = "vertical", 
  error,
  label,
  helperText,
  containerClassName,
  id,
  ...props 
}, ref) => {
  const scrollBarId = id || React.useId();
  const errorId = `${scrollBarId}-error`;
  const helperId = `${scrollBarId}-helper`;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label
          htmlFor={scrollBarId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        id={scrollBarId}
        orientation={orientation}
        className={cn(
          "flex touch-none select-none transition-colors",
          orientation === "vertical" &&
            "h-full w-2.5 border-l border-l-transparent p-[1px]",
          orientation === "horizontal" &&
            "h-2.5 border-t border-t-transparent p-[1px]",
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
        <ScrollAreaPrimitive.ScrollAreaThumb 
          className="relative flex-1 rounded-full bg-border"
          role="presentation"
        />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
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
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }