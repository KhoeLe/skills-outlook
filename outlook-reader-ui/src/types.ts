/**
 * Core types for email parsing and display
 * Compatible with outlook-email-parser package
 */

export interface EmailAddress {
  name?: string;
  email?: string;
}

export interface EmailAttachment {
  filename: string;
  size: number;
  contentId?: string;
  content?: string;
  mimeType?: string;
}

export interface ParsedEmail {
  subject: string;
  from: EmailAddress;
  to?: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  sentDate?: string;
  receivedDate?: string;
  priority?: number;
  importance?: number;
  textContent?: string;
  htmlContent?: string;
  attachments: EmailAttachment[];
}

export interface PstMessageSummary {
  subject: string;
  from: string;
  to: string;
  date: string;
  hasAttachments: boolean;
}

export interface PstData {
  messageCount: number;
  messages: PstMessageSummary[];
  truncated: boolean;
}

export type EmailViewTab = "formatted" | "plain" | "source";

export type FileUploadState = "idle" | "dragging" | "loading" | "error";
