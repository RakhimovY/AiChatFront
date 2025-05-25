import { Loader2 } from "lucide-react";
import DOMPurify from 'isomorphic-dompurify';
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useMemo } from 'react';
import DocumentIcon from "@/components/icons/DocumentIcon";
import { 
  ListItem, 
  processList, 
  getIndentationLevel, 
  applyTextFormatting 
} from "@/lib/messageFormatters";

type MessageProps = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
  documentUrl?: string;
  documentName?: string;
};

// Render a list item with its nested content
const renderListItem = (item: ListItem, index: number, parentKey: string): JSX.Element => {
  const key = `${parentKey}-${index}`;

  // Render bullet point
  if (item.type === 'bullet') {
    return (
      <li key={key}>
        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }} />
        {item.nested.length > 0 && (
          <ul className="list-disc pl-5 mt-1 space-y-1">
            {item.nested.map((nestedItem, nestedIndex) => 
              renderListItem(nestedItem, nestedIndex, key)
            )}
          </ul>
        )}
      </li>
    );
  }

  // Render numbered item
  return (
    <div key={key} className="flex mb-1">
      <span className="mr-2 flex-shrink-0 w-5 text-right">{item.number}.</span>
      <div className="flex-1">
        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }} />
        {item.nested.length > 0 && (
          <div className="pl-5 mt-1 space-y-1">
            {item.nested.map((nestedItem, nestedIndex) => 
              renderListItem(nestedItem, nestedIndex, key)
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// Function to format the message content with proper paragraphs and lists
const formatMessageContent = (text: string) => {
  // Apply all text formatting (bold, code blocks, headers, quotes, links)
  const formattedText = applyTextFormatting(text);

  // Split the text by double line breaks to create paragraphs
  const paragraphs = formattedText.split(/\n\s*\n/);

  return paragraphs.map((paragraph, index) => {
    // Check if the paragraph contains list items
    if (paragraph.trim().match(/^(\s*)[*-]\s/m) || paragraph.trim().match(/^(\s*)\d+\.\s/m)) {
      // Split into lines and process as a list
      const lines = paragraph.split(/\n/).filter(line => line.trim());
      const listItems = processList(lines, 0, getIndentationLevel(lines[0]));

      // Determine if this is primarily a bullet list or numbered list
      const isBulletList = listItems.length > 0 && listItems[0].type === 'bullet';

      if (isBulletList) {
        return (
          <ul key={`list-${index}`} className="list-disc pl-5 space-y-1 my-4">
            {listItems.map((item, itemIndex) => 
              renderListItem(item, itemIndex, `list-${index}`)
            )}
          </ul>
        );
      } else {
        return (
          <div key={`numbered-list-${index}`} className="pl-5 space-y-1 my-4">
            {listItems.map((item, itemIndex) => 
              renderListItem(item, itemIndex, `numbered-list-${index}`)
            )}
          </div>
        );
      }
    }

    // Handle regular paragraphs
    // Split by single line breaks to handle line breaks within paragraphs
    const lines = paragraph.split(/\n/).filter(line => line.trim());

    if (lines.length === 1) {
      return <p key={`p-${index}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraph) }} />;
    }

    return (
      <div key={`p-${index}`} >
        {lines.map((line, lineIndex) => (
          <p key={`line-${index}-${lineIndex}`} 
             className={lineIndex < lines.length - 1 ? "mb-1" : ""}
             dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(line) }} 
          />
        ))}
      </div>
    );
  });
};

export default function Message({ id, role, content, isLoading = false, documentUrl, documentName }: MessageProps) {
  const { t } = useLanguage();

  // Memoize the formatted content to prevent unnecessary re-rendering
  const formattedContent = useMemo(() => {
    return formatMessageContent(content);
  }, [content]);

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
          <p>{t.assistantTyping}</p>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-start">
            <div className="flex-1 message-content">
              {formattedContent}
            </div>
          </div>

          {/* Document attachment */}
          {documentUrl && documentName && (
            <div className="mt-2 flex">
              <a 
                href={documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-md"
              >
                <DocumentIcon />
                <span>{documentName}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
