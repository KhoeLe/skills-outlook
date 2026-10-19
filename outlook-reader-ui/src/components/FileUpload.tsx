import React, { useState, useCallback, useRef } from "react";
import { cn } from "../utils";

export interface FileUploadProps {
  /** Callback when a file is selected */
  onFileSelect: (file: File) => void;
  /** Whether the component is in loading state */
  isLoading?: boolean;
  /** Accepted file extensions */
  accept?: string;
  /** Custom class name */
  className?: string;
  /** Theme: light or dark */
  theme?: "light" | "dark";
}

/**
 * File upload component with drag and drop support
 */
export function FileUpload({
  onFileSelect,
  isLoading = false,
  accept = ".msg,.oft,.eml",
  className,
  theme = "light",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "file-upload",
        isDark ? "file-upload--dark" : "file-upload--light",
        isDragging && "file-upload--dragging",
        isLoading && "file-upload--loading",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload email file"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="file-upload__input"
        disabled={isLoading}
      />

      <div className="file-upload__content">
        <div className="file-upload__icon">
          {isLoading ? "⏳" : isDragging ? "📄" : "📤"}
        </div>

        <div className="file-upload__text">
          <p className="file-upload__title">
            {isLoading
              ? "Processing your file..."
              : isDragging
                ? "Drop it here!"
                : "Drop your Outlook file"}
          </p>
          <p className="file-upload__subtitle">
            or click to browse • MSG, OFT, EML supported
          </p>
        </div>

        <div className="file-upload__badges">
          {[".MSG", ".OFT", ".EML"].map((ext) => (
            <span key={ext} className="file-upload__badge">
              {ext}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
