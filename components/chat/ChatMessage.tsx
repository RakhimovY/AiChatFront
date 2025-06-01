import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface ChatMessageProps {
    icon?: LucideIcon;
    iconText?: string;
    children: ReactNode;
    isUser?: boolean;
}

export default function ChatMessage({
    icon: Icon,
    iconText,
    children,
    isUser = false
}: ChatMessageProps) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {Icon ? (
                    <Icon className="h-4 w-4 text-primary" />
                ) : (
                    <span className="text-primary font-medium">{iconText}</span>
                )}
            </div>
            <div className={`p-2 md:p-3 rounded-lg ${isUser ? "bg-muted" : "bg-primary/10"}`}>
                {children}
            </div>
        </div>
    );
} 