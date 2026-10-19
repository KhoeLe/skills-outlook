"use client";

import { useState, useCallback, useRef } from "react";
import type { FileUploadState } from "../types";

export interface UseFileUploadOptions {
  /** Accepted file extensions */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Callback when file is selected */
  onFileSelect?: (file: File) => void | Promise<void>;
  /** Callback on error */
  onError?: (error: string) => void;
}

export interface UseFileUploadReturn {
  // State
  state: FileUploadState;
  isDragging: boolean;
  isLoading: boolean;
  error: string | null;

  // Refs
  inputRef: React.RefObject<HTMLInputElement | null>;

  // Event handlers (spread these on your elements)
  getRootProps: () => {
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onClick: () => void;
    role: string;
    tabIndex: number;
    "aria-label": string;
  };

  getInputProps: () => {
    ref: React.RefObject<HTMLInputElement | null>;
    type: "file";
    accept: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    style: React.CSSProperties;
  };

  // Actions
  reset: () => void;
  setLoading: (loading: boolean) => void;
}

const HIDDEN_INPUT_STYLE: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  border: 0,
};

/**
 * Headless hook for file upload logic
 * Provides drag & drop and click-to-upload functionality
 *
 * @example
 * ```tsx
 * function MyFileUpload() {
 *   const { getRootProps, getInputProps, isDragging, isLoading } = useFileUpload({
 *     accept: ".msg,.eml",
 *     onFileSelect: (file) => console.log(file),
 *   });
 *
 *   return (
 *     <div {...getRootProps()} className={isDragging ? "dragging" : ""}>
 *       <input {...getInputProps()} />
 *       <p>Drop files here or click to upload</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    accept = ".msg,.oft,.eml",
    maxSize = 50 * 1024 * 1024, // 50MB default
    onFileSelect,
    onError,
  } = options;

  const [state, setState] = useState<FileUploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file extension
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      const acceptedExts = accept.split(",").map((e) => e.trim().toLowerCase());
      if (!acceptedExts.includes(ext)) {
        return `Invalid file type. Accepted: ${accept}`;
      }

      // Check file size
      if (file.size > maxSize) {
        return `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setState("error");
        onError?.(validationError);
        return;
      }

      setError(null);
      setState("loading");

      try {
        await onFileSelect?.(file);
        setState("idle");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to process file";
        setError(message);
        setState("error");
        onError?.(message);
      }
    },
    [validateFile, onFileSelect, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState("dragging");
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState("idle");
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFile]
  );

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(loading ? "loading" : "idle");
  }, []);

  const getRootProps = useCallback(
    () => ({
      onDrop: handleDrop,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onClick: handleClick,
      role: "button" as const,
      tabIndex: 0,
      "aria-label": "Upload email file",
    }),
    [handleDrop, handleDragOver, handleDragLeave, handleClick]
  );

  const getInputProps = useCallback(
    () => ({
      ref: inputRef,
      type: "file" as const,
      accept,
      onChange: handleChange,
      disabled: state === "loading",
      style: HIDDEN_INPUT_STYLE,
    }),
    [accept, handleChange, state]
  );

  return {
    state,
    isDragging: state === "dragging",
    isLoading: state === "loading",
    error,
    inputRef,
    getRootProps,
    getInputProps,
    reset,
    setLoading,
  };
}
