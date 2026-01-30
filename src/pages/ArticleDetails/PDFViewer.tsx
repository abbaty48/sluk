import { useState } from "react";
import {
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  fileUrl: string;
}

export function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [scale, setScale] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 20, 200));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 20, 50));
  };

  const resetZoom = () => {
    setScale(100);
  };

  // Use Google Docs Viewer as it's more reliable
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">PDF Viewer</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={zoomOut}
            disabled={scale <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={resetZoom}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {scale}%
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={zoomIn}
            disabled={scale >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </a>

          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* PDF Display */}
      <div className="flex-1 relative bg-muted/30">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading PDF...</p>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
              <p className="text-destructive mb-2 font-semibold">
                Unable to load PDF
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                The PDF viewer encountered an error. Please try downloading the
                file or opening it in a new tab.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href={fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </a>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in New Tab
                  </Button>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
            <div
              style={{
                width: `${scale}%`,
                height: "100%",
                minHeight: "600px",
                transition: "width 0.2s ease",
              }}
            >
              {/* Primary: Google Docs Viewer */}
              <iframe
                src={googleViewerUrl}
                className="w-full h-full border-0 bg-white rounded shadow-sm"
                onLoad={handleLoad}
                onError={handleError}
                title="PDF Viewer"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />

              {/* Fallback: Direct PDF embed */}
              {hasError && (
                <object
                  data={fileUrl}
                  type="application/pdf"
                  className="w-full h-full"
                  onError={handleError}
                >
                  <embed
                    src={fileUrl}
                    type="application/pdf"
                    className="w-full h-full"
                  />
                </object>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info bar */}
      {!hasError && (
        <div className="p-3 bg-muted/50 border-t text-xs text-muted-foreground text-center">
          <p>
            Viewing PDF via Google Docs Viewer • Use zoom controls or download
            for full features
          </p>
        </div>
      )}
    </div>
  );
}
