import { Loader2 } from "lucide-react";

type MessageProps = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
};

export default function Message({ id, role, content, isLoading = false }: MessageProps) {
  return (
    <div
      key={id}
      className={`message ${
        role === "user" ? "user-message" : "assistant-message"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Ассистент печатает...</p>
        </div>
      ) : (
        <div className="flex items-start">
          <div className="flex-1">
            <p>{content}</p>
          </div>
        </div>
      )}
    </div>
  );
}