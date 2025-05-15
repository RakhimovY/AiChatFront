import { Loader2 } from "lucide-react";

type MessageProps = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
};

export default function Message({ id, role, content, isLoading = false }: MessageProps) {
  // Function to format the message content with proper paragraphs and lists
  const formatContent = (text: string) => {
    // Split the text by double line breaks to create paragraphs
    const paragraphs = text.split(/\n\s*\n/);

    return paragraphs.map((paragraph, index) => {
      // Check if the paragraph is a list
      if (paragraph.trim().match(/^[*-]\s/m)) {
        // Split the list items
        const items = paragraph.split(/\n/).filter(item => item.trim());
        return (
          <ul key={`list-${index}`} className="list-disc pl-5 space-y-1 my-2">
            {items.map((item, itemIndex) => (
              <li key={`item-${index}-${itemIndex}`}>
                {item.replace(/^[*-]\s/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Check if the paragraph is a numbered list
      if (paragraph.trim().match(/^\d+\.\s/m)) {
        // Split the list items
        const items = paragraph.split(/\n/).filter(item => item.trim());
        return (
          <ol key={`list-${index}`} className="list-decimal pl-5 space-y-1 my-2">
            {items.map((item, itemIndex) => (
              <li key={`item-${index}-${itemIndex}`}>
                {item.replace(/^\d+\.\s/, '')}
              </li>
            ))}
          </ol>
        );
      }

      // Handle regular paragraphs
      // Split by single line breaks to handle line breaks within paragraphs
      const lines = paragraph.split(/\n/).filter(line => line.trim());

      if (lines.length === 1) {
        return <p key={`p-${index}`} className="mb-2">{paragraph}</p>;
      }

      return (
        <div key={`p-${index}`} className="mb-2">
          {lines.map((line, lineIndex) => (
            <p key={`line-${index}-${lineIndex}`} className={lineIndex < lines.length - 1 ? "mb-1" : ""}>
              {line}
            </p>
          ))}
        </div>
      );
    });
  };

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
          <div className="flex-1 message-content">
            {formatContent(content)}
          </div>
        </div>
      )}
    </div>
  );
}
