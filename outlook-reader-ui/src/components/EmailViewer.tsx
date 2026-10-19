import React, { useState, useCallback } from "react";
import { cn, formatFileSize, getInitials, formatDate } from "../utils";
import { cleanupHtml, textToFormattedHtml, replaceCidUrls } from "../html-utils";

/** Email address interface */
interface EmailAddress {
  name?: string;
  email?: string;
}

/** Email attachment interface */
interface EmailAttachment {
  filename: string;
  size: number;
  contentId?: string;
  content?: string;
  mimeType?: string;
}

/** Parsed email interface */
interface ParsedEmail {
  subject: string;
  from: EmailAddress;
  to?: string;
  cc?: string;
  bcc?: string;
  sentDate?: string;
  textContent?: string;
  htmlContent?: string;
  attachments: EmailAttachment[];
}

export interface EmailViewerProps {
  /** Parsed email data */
  email: ParsedEmail;
  /** Optional filename for display */
  fileName?: string;
  /** Custom class name */
  className?: string;
  /** Theme: light or dark */
  theme?: "light" | "dark";
  /** Callback when attachment is downloaded */
  onDownloadAttachment?: (attachment: EmailAttachment) => void;
}

/**
 * Email viewer component that displays parsed email content beautifully
 */
export function EmailViewer({
  email,
  fileName,
  className,
  theme = "light",
  onDownloadAttachment,
}: EmailViewerProps) {
  const [activeTab, setActiveTab] = useState<"formatted" | "plain" | "source">("formatted");

  const processedHtml = email.htmlContent
    ? replaceCidUrls(email.htmlContent, email.attachments)
    : null;

  const formattedHtml = processedHtml
    ? cleanupHtml(processedHtml)
    : email.textContent
      ? textToFormattedHtml(email.textContent)
      : "";

  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "email-viewer",
        isDark ? "email-viewer--dark" : "email-viewer--light",
        className
      )}
    >
      {/* Header */}
      <div className="email-viewer__header">
        <div className="email-viewer__header-content">
          {fileName && (
            <span className="email-viewer__badge">{fileName.split(".").pop()?.toUpperCase()}</span>
          )}
          <h2 className="email-viewer__subject">{email.subject}</h2>
        </div>
      </div>

      {/* Sender Info */}
      <div className="email-viewer__sender">
        <div className="email-viewer__avatar">
          {getInitials(email.from.name, email.from.email)}
        </div>
        <div className="email-viewer__sender-details">
          <div className="email-viewer__sender-name">
            <span className="email-viewer__sender-name-text">
              {email.from.name || "Unknown Sender"}
            </span>
            {email.from.email && (
              <span className="email-viewer__sender-email">&lt;{email.from.email}&gt;</span>
            )}
          </div>
          {email.to && (
            <div className="email-viewer__recipient">
              <span className="email-viewer__recipient-label">To:</span>
              <span className="email-viewer__recipient-value">{email.to}</span>
            </div>
          )}
          {email.cc && (
            <div className="email-viewer__recipient">
              <span className="email-viewer__recipient-label">Cc:</span>
              <span className="email-viewer__recipient-value">{email.cc}</span>
            </div>
          )}
        </div>
        {email.sentDate && (
          <div className="email-viewer__date">{formatDate(email.sentDate)}</div>
        )}
      </div>

      {/* Attachments */}
      {email.attachments.length > 0 && (
        <AttachmentList
          attachments={email.attachments}
          onDownload={onDownloadAttachment}
        />
      )}

      {/* Body Tabs */}
      <div className="email-viewer__tabs">
        <button
          className={cn("email-viewer__tab", activeTab === "formatted" && "email-viewer__tab--active")}
          onClick={() => setActiveTab("formatted")}
        >
          Formatted
        </button>
        <button
          className={cn("email-viewer__tab", activeTab === "plain" && "email-viewer__tab--active")}
          onClick={() => setActiveTab("plain")}
        >
          Plain Text
        </button>
        {email.htmlContent && (
          <button
            className={cn("email-viewer__tab", activeTab === "source" && "email-viewer__tab--active")}
            onClick={() => setActiveTab("source")}
          >
            HTML Source
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="email-viewer__body">
        {activeTab === "formatted" && (
          formattedHtml ? (
            <div
              className="email-viewer__content email-content"
              dangerouslySetInnerHTML={{ __html: formattedHtml }}
            />
          ) : (
            <EmptyState />
          )
        )}
        {activeTab === "plain" && (
          email.textContent ? (
            <pre className="email-viewer__plain-text">{email.textContent}</pre>
          ) : (
            <EmptyState />
          )
        )}
        {activeTab === "source" && (
          email.htmlContent ? (
            <pre className="email-viewer__source">{email.htmlContent}</pre>
          ) : (
            <EmptyState />
          )
        )}
      </div>
    </div>
  );
}

function AttachmentList({
  attachments,
  onDownload,
}: {
  attachments: EmailAttachment[];
  onDownload?: (attachment: EmailAttachment) => void;
}) {
  return (
    <div className="email-viewer__attachments">
      <div className="email-viewer__attachments-header">
        📎 {attachments.length} Attachment{attachments.length > 1 ? "s" : ""}
      </div>
      <div className="email-viewer__attachments-list">
        {attachments.map((att, i) => (
          <AttachmentItem key={i} attachment={att} onDownload={onDownload} />
        ))}
      </div>
    </div>
  );
}

function AttachmentItem({
  attachment,
  onDownload,
}: {
  attachment: EmailAttachment;
  onDownload?: (attachment: EmailAttachment) => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (onDownload) {
      onDownload(attachment);
      return;
    }

    if (!attachment.content) return;

    setIsDownloading(true);
    try {
      const byteCharacters = atob(attachment.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: attachment.mimeType || "application/octet-stream",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }, [attachment, onDownload]);

  const hasContent = !!attachment.content || !!onDownload;

  return (
    <div className="email-viewer__attachment">
      <span className="email-viewer__attachment-icon">📄</span>
      <span className="email-viewer__attachment-name">{attachment.filename}</span>
      <span className="email-viewer__attachment-size">{formatFileSize(attachment.size)}</span>
      {hasContent && (
        <button
          className="email-viewer__attachment-download"
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download"
        >
          {isDownloading ? "..." : "⬇"}
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="email-viewer__empty">
      <div className="email-viewer__empty-icon">📧</div>
      <p className="email-viewer__empty-text">No readable content found</p>
      <p className="email-viewer__empty-subtext">
        This email may contain only embedded messages or attachments.
      </p>
    </div>
  );
}
