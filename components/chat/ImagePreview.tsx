import { useState, useEffect } from "react";
import { X, Maximize2, FileImage } from "lucide-react";

type ImagePreviewProps = {
  image: File;
  onRemove: () => void;
  className?: string;
};

export default function ImagePreview({
  image,
  onRemove,
  className = "",
}: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate preview URL when image changes
  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    setIsLoading(true);
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    // Clean up the URL when component unmounts or image changes
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  // Handle image load completion
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Toggle fullscreen preview
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  // Close fullscreen on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  if (!previewUrl) {
    return null;
  }

  return (
    <>
      <div 
        className={`relative rounded-lg overflow-hidden bg-muted shadow-md transition-all duration-200 hover:shadow-lg w-full sm:w-auto ${className}`}
      >
        <div className="relative group">
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="animate-pulse flex flex-col items-center">
                <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Loading...</span>
              </div>
            </div>
          )}

          {/* Image preview - responsive sizing */}
          <div className="flex justify-center bg-black/5 p-1.5 sm:p-2">
            <img
              src={previewUrl}
              alt={`Preview of ${image.name}`}
              className="max-h-36 sm:max-h-48 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              onLoad={handleImageLoad}
            />
          </div>

          {/* Control buttons - visible on hover for desktop, always visible on mobile */}
          <div className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
            {/* Fullscreen button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 bg-background/90 rounded-full hover:bg-primary/20 active:bg-primary/30 transition-colors shadow-sm"
              aria-label="View full image"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Remove button */}
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 bg-background/90 rounded-full hover:bg-destructive/20 active:bg-destructive/30 transition-colors shadow-sm"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Image info - responsive layout */}
        <div className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs flex justify-between items-center bg-muted/80 border-t border-border/50">
          <div className="flex flex-col flex-1 min-w-0 mr-2">
            <span className="truncate font-medium">{image.name}</span>
            <span className="text-muted-foreground text-[10px]">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <span className="text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
            {Math.round(image.size / 1024)} KB
          </span>
        </div>
      </div>

      {/* Fullscreen preview modal - improved for mobile */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-200"
          onClick={() => setIsFullscreen(false)}
          data-state="open"
        >
          <div className="relative max-w-4xl max-h-[95vh] sm:max-h-[90vh] w-full data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:duration-300">
            <img
              src={previewUrl}
              alt={`${image.name} - Full view`}
              className="w-full max-h-[95vh] sm:max-h-[90vh] max-w-full object-contain rounded-lg shadow-xl"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 bg-background/90 rounded-full hover:bg-destructive/20 active:bg-destructive/30 transition-colors shadow-md"
              aria-label="Close fullscreen view"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-md max-w-[90%] truncate text-center">
              <span className="truncate block">{image.name} ({Math.round(image.size / 1024)} KB)</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
