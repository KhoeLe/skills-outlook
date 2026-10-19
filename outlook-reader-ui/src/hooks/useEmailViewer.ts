"use client";

import { useState, useMemo, useCallback } from "react";
import type { ParsedEmail, EmailAttachment, EmailViewTab } from "../types";
import { cleanupHtml, textToFormattedHtml, replaceCidUrls } from "../html-utils";
import { formatFileSize, getInitials, formatDate } from "../utils";

export interface UseEmailViewerOptions {
  /** Initial active tab */
  defaultTab?: EmailViewTab;
}

export interface UseEmailViewerReturn {
  // Tab state
  activeTab: EmailViewTab;
  setActiveTab: (tab: EmailViewTab) => void;
  availableTabs: EmailViewTab[];

  // Processed content
  formattedHtml: string;
  plainText: string | undefined;
  htmlSource: string | undefined;
  hasContent: boolean;

  // Sender info
  senderInitials: string;
  senderName: string;
  senderEmail: string | undefined;
  formattedDate: string;

  // Attachments
  attachments: EmailAttachment[];
  hasAttachments: boolean;
  attachmentCount: number;
  downloadAttachment: (attachment: EmailAttachment) => Promise<void>;
  getAttachmentSize: (attachment: EmailAttachment) => string;

  // Actions
  copyContent: () => Promise<boolean>;
  print: () => void;
}

/**
 * Headless hook for email viewer logic
 * Provides all state and actions without any UI
 *
 * @example
 * ```tsx
 * function MyEmailViewer({ email }) {
 *   const {
 *     activeTab,
 *     setActiveTab,
 *     formattedHtml,
 *     senderInitials,
 *     downloadAttachment,
 *   } = useEmailViewer(email);
 *
 *   return (
 *     <div>
 *       <div className="avatar">{senderInitials}</div>
 *       <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useEmailViewer(
  email: ParsedEmail,
  options: UseEmailViewerOptions = {}
): UseEmailViewerReturn {
  const { defaultTab = "formatted" } = options;
  const [activeTab, setActiveTab] = useState<EmailViewTab>(defaultTab);

  // Process HTML content with CID replacement
  const formattedHtml = useMemo(() => {
    if (email.htmlContent) {
      const withCids = replaceCidUrls(email.htmlContent, email.attachments);
      return cleanupHtml(withCids);
    }
    if (email.textContent) {
      return textToFormattedHtml(email.textContent);
    }
    return "";
  }, [email.htmlContent, email.textContent, email.attachments]);

  // Available tabs based on content
  const availableTabs = useMemo<EmailViewTab[]>(() => {
    const tabs: EmailViewTab[] = ["formatted"];
    if (email.textContent) tabs.push("plain");
    if (email.htmlContent) tabs.push("source");
    return tabs;
  }, [email.textContent, email.htmlContent]);

  // Sender info
  const senderInitials = useMemo(
    () => getInitials(email.from.name, email.from.email),
    [email.from.name, email.from.email]
  );

  const senderName = email.from.name || "Unknown Sender";
  const senderEmail = email.from.email;

  const formattedDate = useMemo(
    () => (email.sentDate ? formatDate(email.sentDate) : ""),
    [email.sentDate]
  );

  // Attachments
  const hasAttachments = email.attachments.length > 0;
  const attachmentCount = email.attachments.length;

  const downloadAttachment = useCallback(async (attachment: EmailAttachment) => {
    if (!attachment.content) return;

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
  }, []);

  const getAttachmentSize = useCallback(
    (attachment: EmailAttachment) => formatFileSize(attachment.size),
    []
  );

  // Actions
  const copyContent = useCallback(async (): Promise<boolean> => {
    const content = email.textContent || email.htmlContent || "";
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch {
      return false;
    }
  }, [email.textContent, email.htmlContent]);

  const print = useCallback(() => {
    window.print();
  }, []);

  return {
    // Tab state
    activeTab,
    setActiveTab,
    availableTabs,

    // Processed content
    formattedHtml,
    plainText: email.textContent,
    htmlSource: email.htmlContent,
    hasContent: !!formattedHtml || !!email.textContent,

    // Sender info
    senderInitials,
    senderName,
    senderEmail,
    formattedDate,

    // Attachments
    attachments: email.attachments,
    hasAttachments,
    attachmentCount,
    downloadAttachment,
    getAttachmentSize,

    // Actions
    copyContent,
    print,
  };
}
