"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

type BaseTabsProps = {
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
  id?: string;
}

type TabsProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & BaseTabsProps;

const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ className, error, label, helperText, containerClassName, id, ...props }, ref) => {
    const tabsId = id || React.useId();
    const errorId = `${tabsId}-error`;
    const helperId = `${tabsId}-helper`;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={tabsId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <TabsPrimitive.Root
          ref={ref}
          id={tabsId}
          className={cn(
            "relative",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={cn(
            error && errorId,
            helperText && helperId
          )}
          {...props}
        />
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
);
Tabs.displayName = TabsPrimitive.Root.displayName;

type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  variant?: "default" | "pills" | "underline";
};

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        variant === "pills" && "space-x-1",
        variant === "underline" && "border-b border-border bg-transparent p-0",
        className
      )}
      {...props}
    />
  )
)
TabsList.displayName = TabsPrimitive.List.displayName

type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  variant?: "default" | "pills" | "underline";
  icon?: React.ReactNode;
};

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant = "default", icon, children, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        variant === "pills" && "rounded-full",
        variant === "underline" && "rounded-none border-b-2 border-transparent px-1 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:shadow-none",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </TabsPrimitive.Trigger>
  )
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
  variant?: "default" | "pills" | "underline";
};

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variant === "pills" && "mt-4",
        variant === "underline" && "mt-4",
        className
      )}
      {...props}
    />
  )
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }