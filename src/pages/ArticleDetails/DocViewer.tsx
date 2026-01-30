import { Download, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DocViewerProps {
  fileUrl: string;
}

export function DocViewer({ fileUrl }: DocViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Use Google Docs Viewer or Office Online Viewer as fallback
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="flex flex-col h-full min-h-150">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </div>
      )}

      {hasError ? (
        <div className="flex flex-col items-center justify-center h-full bg-muted/30 rounded-lg p-8">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Unable to Display Document
          </h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            This document format cannot be displayed in the browser. Please
            download the file to view it on your device.
          </p>
          <div className="flex gap-4">
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Document
              </Button>
            </a>
            <a
              href={googleDocsViewerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Google Docs
              </Button>
            </a>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative">
          <iframe
            src={googleDocsViewerUrl}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            onError={handleError}
            title="Document Viewer"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />

          {/* Fallback to Office Viewer if Google Docs fails */}
          {hasError && (
            <iframe
              src={officeViewerUrl}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              title="Document Viewer (Office)"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )}
        </div>
      )}

      {/* Bottom Action Bar */}
      {!hasError && (
        <div className="flex items-center justify-between p-4 bg-muted/50 border-t">
          <p className="text-sm text-muted-foreground">
            Viewing document via Google Docs Viewer
          </p>
          <div className="flex gap-2">
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </a>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
