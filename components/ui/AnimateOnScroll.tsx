"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AnimateOnScrollProps = {
  children: React.ReactNode;
  animation: string;
  className?: string;
  threshold?: number;
  delay?: number;
  once?: boolean;
};

export default function AnimateOnScroll({
  children,
  animation,
  className,
  threshold = 0.1,
  delay = 0,
  once = true,
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
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
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={cn(
        isVisible ? animation : "opacity-0",
        delay > 0 ? `delay-${delay}` : "",
        "transition-all duration-700",
        className
      )}
    >
      {children}
    </div>
  );
}