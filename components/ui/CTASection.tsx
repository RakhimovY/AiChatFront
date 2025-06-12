"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import AnimateOnScroll from "@/components/ui/AnimateOnScroll"
import { cn } from "@/lib/utils"

const ctaVariants = cva(
  "py-16",
  {
    variants: {
      variant: {
        default: "bg-primary/5",
        destructive: "bg-destructive/5",
        success: "bg-green-500/5",
        warning: "bg-yellow-500/5",
        info: "bg-blue-500/5",
      },
      size: {
        default: "py-16",
        sm: "py-8",
        lg: "py-24",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const buttonVariants = cva(
  "inline-flex items-center px-6 py-3 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "bg-green-500 text-green-50 hover:bg-green-500/90",
        warning: "bg-yellow-500 text-yellow-50 hover:bg-yellow-500/90",
        info: "bg-blue-500 text-blue-50 hover:bg-blue-500/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CTASectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof ctaVariants> {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon?: React.ReactNode;
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
  id?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
  buttonSize?: VariantProps<typeof buttonVariants>["size"];
  animation?: "animate-slide-up" | "animate-slide-down" | "animate-fade-in";
  threshold?: number;
  onButtonClick?: () => void;
}

export default function CTASection({
  title,
  description,
  buttonText,
  buttonLink,
  icon = <ArrowRight className="ml-2 h-5 w-5" />,
  variant,
  size,
  error,
  label,
  helperText,
  containerClassName,
  id,
  buttonVariant,
  buttonSize,
  animation = "animate-slide-up",
  threshold = 0.3,
  onButtonClick,
  className,
  ...props
}: CTASectionProps) {
  const ctaId = id || React.useId();
  const errorId = `${ctaId}-error`;
  const helperId = `${ctaId}-helper`;

  return (
    <section
      id={ctaId}
      className={cn(
        ctaVariants({ variant, size }),
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
      <div className="container">
        <AnimateOnScroll animation={animation} threshold={threshold}>
          <div className="max-w-3xl mx-auto text-center">
            {label && (
              <label
                htmlFor={ctaId}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            )}
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {description}
            </p>
            <Link 
              href={buttonLink} 
              className={cn(
                buttonVariants({ variant: buttonVariant, size: buttonSize })
              )}
              onClick={onButtonClick}
              aria-label={buttonText}
            >
              {buttonText} {icon}
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
      {error && (
        <p
          id={errorId}
          className="text-sm font-medium text-destructive text-center mt-4"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          id={helperId}
          className="text-sm text-muted-foreground text-center mt-4"
        >
          {helperText}
        </p>
      )}
    </section>
  );
}
