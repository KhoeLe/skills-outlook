/**
 * Outlook Reader UI - Headless hooks and utilities for displaying parsed Outlook emails
 *
 * This package provides:
 * - Headless hooks with all logic, no UI opinions
 * - Utility functions for formatting and HTML processing
 * - TypeScript types compatible with outlook-email-parser
 *
 * @example
 * ```tsx
 * import { useEmailViewer, useFileUpload } from 'outlook-reader-ui';
 *
 * function MyEmailViewer({ email }) {
 *   const { formattedHtml, senderInitials, downloadAttachment } = useEmailViewer(email);
 *
 *   return (
 *     <div>
 *       <div className="avatar">{senderInitials}</div>
 *       <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
 *     </div>
 *   );
 * }
 *
 * function MyUploader() {
 *   const { getRootProps, getInputProps, isDragging } = useFileUpload({
 *     onFileSelect: (file) => console.log(file),
 *   });
 *
 *   return (
 *     <div {...getRootProps()}>
 *       <input {...getInputProps()} />
 *       Drop files here
 *     </div>
 *   );
 * }
 * ```
 */

// ============================================
// HOOKS (headless logic)
// ============================================
export {
  useEmailViewer,
  type UseEmailViewerOptions,
  type UseEmailViewerReturn,
} from "./hooks/useEmailViewer";

export {
  useFileUpload,
  type UseFileUploadOptions,
  type UseFileUploadReturn,
} from "./hooks/useFileUpload";

export {
  usePstViewer,
  type UsePstViewerOptions,
  type UsePstViewerReturn,
  type PstSortField,
  type PstSortOrder,
} from "./hooks/usePstViewer";

// ============================================
// UTILITIES (pure functions)
// ============================================
export { formatFileSize, getInitials, formatDate, cn } from "./utils";
export { cleanupHtml, textToFormattedHtml, replaceCidUrls } from "./html-utils";

// ============================================
// TYPES
// ============================================
export type {
  ParsedEmail,
  EmailAddress,
  EmailAttachment,
  PstMessageSummary,
  PstData,
  EmailViewTab,
  FileUploadState,
} from "./types";

// ============================================
// LEGACY: Styled components (for backward compatibility)
// Will be deprecated in future versions
// ============================================
export { EmailViewer, type EmailViewerProps } from "./components/EmailViewer";
export { FileUpload, type FileUploadProps } from "./components/FileUpload";
