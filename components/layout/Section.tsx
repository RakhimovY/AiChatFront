import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string;
    background?: "default" | "muted";
}

export default function Section({
    children,
    className = "",
    background = "default"
}: SectionProps) {
    const backgroundClasses = background === "muted" ? "bg-muted/50" : "";

    return (
        <section className={`py-8 md:py-16 px-2 md:px-4 ${backgroundClasses} ${className}`}>
            <div className="container mx-auto max-w-6xl">
                {children}
            </div>
        </section>
    );
} 