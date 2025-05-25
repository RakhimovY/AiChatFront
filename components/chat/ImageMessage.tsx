import { useState, useMemo } from "react";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import {env} from "@polar-sh/sdk/lib/env";

type ImageMessageProps = {
  imageId: string;
  altText?: string;
  className?: string;
};

export default function ImageMessage({
  imageId,
  altText = "Image",
  className = "",
}: ImageMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formattedImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/images/${imageId}`;

  // If expanded, show a modal with the full-size image
  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="relative max-w-[90vw] max-h-[90vh]">
          {/* Close button */}
          <button
            onClick={toggleExpand}
            className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-muted transition-colors z-10"
            aria-label="Close image"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Full-size image */}
          <img
            src={formattedImageUrl}
            alt={altText}
            className="max-w-full max-h-[90vh] object-contain rounded-md"
          />
        </div>
      </div>
    );
  }

  // Regular thumbnail view
  return (
    <div className={`relative group rounded-md overflow-hidden ${className}`}>
      {/* Thumbnail image */}
      <img
        src={formattedImageUrl}
        alt={altText}
        className="max-h-60 w-auto object-contain rounded-md cursor-pointer"
        onClick={toggleExpand}
      />

      {/* Zoom button */}
      <button
        onClick={toggleExpand}
        className="absolute bottom-2 right-2 p-1.5 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Expand image"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
    </div>
  );
}
