"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const animationVariants = cva(
  "transition-all duration-700",
  {
    variants: {
      animation: {
        "slide-up": "animate-slide-up",
        "slide-down": "animate-slide-down",
        "slide-left": "animate-slide-left",
        "slide-right": "animate-slide-right",
        "fade-in": "animate-fade-in",
        "fade-out": "animate-fade-out",
        "zoom-in": "animate-zoom-in",
        "zoom-out": "animate-zoom-out",
        "bounce": "animate-bounce",
        "pulse": "animate-pulse",
        "spin": "animate-spin",
        "ping": "animate-ping",
      },
      duration: {
        fast: "duration-300",
        default: "duration-700",
        slow: "duration-1000",
      },
      easing: {
        linear: "ease-linear",
        in: "ease-in",
        out: "ease-out",
        "in-out": "ease-in-out",
      },
    },
    defaultVariants: {
      animation: "fade-in",
      duration: "default",
      easing: "in-out",
    },
  }
);

export interface AnimateOnScrollProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof animationVariants> {
  children: React.ReactNode;
  threshold?: number;
  delay?: number;
  once?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
  id?: string;
  onVisibilityChange?: (isVisible: boolean) => void;
  onIntersection?: (entry: IntersectionObserverEntry) => void;
}

export default function AnimateOnScroll({
  children,
  animation,
  duration,
  easing,
  className,
  threshold = 0.1,
  delay = 0,
  once = true,
  error,
  label,
  helperText,
  containerClassName,
  id,
  onVisibilityChange,
  onIntersection,
  ...props
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const animationId = id || React.useId();
  const errorId = `${animationId}-error`;
  const helperId = `${animationId}-helper`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisibilityChange?.(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
          onVisibilityChange?.(false);
        }
        onIntersection?.(entry);
      },
      {
        threshold,
        rootMargin: "0px",
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once, onVisibilityChange, onIntersection]);

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label
          htmlFor={animationId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <div
        ref={ref}
        id={animationId}
        className={cn(
          animationVariants({ animation, duration, easing }),
          isVisible ? animation : "opacity-0",
          delay > 0 ? `delay-${delay}` : "",
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