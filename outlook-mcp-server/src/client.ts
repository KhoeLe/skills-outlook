/**
 * Typed SDK Client for Outlook MCP Server
 *
 * This provides a typed interface for AI agents to interact with the
 * outlook-mcp-server without needing to know the raw MCP protocol.
 *
 * @example
 * ```typescript
 * import { OutlookMcpClient } from 'outlook-mcp-server/client';
 *
 * const client = new OutlookMcpClient(mcpConnection);
 *
 * // Parse an email
 * const email = await client.parseEmail({
 *   content: base64Content,
 *   fileName: 'message.msg'
 * });
 *
 * console.log(email.subject);
 * ```
 */

import type {
  ParseEmailInput,
  ValidateEmailFileInput,
  ExtractAttachmentsInput,
  GetEmailMetadataInput,
  FormatEmailContentInput,
} from "./types.js";

// ============================================
// Response Types
// ============================================

export interface EmailAddress {
  name?: string;
  email?: string;
}

export interface AttachmentInfo {
  filename: string;
  size: number;
  mimeType?: string;
  contentId?: string;
  isEmbedded?: boolean;
  hasContent?: boolean;
  content?: string;
}

export interface ParseEmailResponse {
  success: boolean;
  fileType: "msg" | "eml" | "oft";
  fileName: string;
  email: {
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
    attachmentCount: number;
    attachments: AttachmentInfo[];
  };
}

export interface ValidateEmailFileResponse {
  isValid: boolean;
  detectedType: string | null;
  expectedType: string;
  checks: {
    isMsgFormat: boolean;
    isEmlFormat: boolean;
  };
}

export interface SupportedFormat {
  extension: string;
  name: string;
  description: string;
  features: string[];
}

export interface GetSupportedFormatsResponse {
  extensions: string[];
  formats: SupportedFormat[];
}

export interface ExtractAttachmentsResponse {
  success: boolean;
  totalCount: number;
  filteredCount: number;
  attachments: AttachmentInfo[];
}

export interface EmailMetadata {
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
  hasHtmlContent: boolean;
  hasTextContent: boolean;
  attachmentCount: number;
  attachmentSummary: Array<{
    filename: string;
    size: number;
    mimeType?: string;
    isEmbedded: boolean;
  }>;
}

export interface GetEmailMetadataResponse {
  success: boolean;
  fileType: string;
  metadata: EmailMetadata;
}

export interface FormatEmailContentResponse {
  success: boolean;
  formattedHtml?: string;
  convertedHtml?: string;
  cidReplacements?: number;
}

// ============================================
// MCP Connection Interface
// ============================================

export interface McpConnection {
  callTool(name: string, args: Record<string, unknown>): Promise<{ content: Array<{ text: string }> }>;
}

// ============================================
// Typed Client
// ============================================

export class OutlookMcpClient {
  constructor(private connection: McpConnection) {}

  /**
   * Parse a complete email file
   */
  async parseEmail(input: ParseEmailInput): Promise<ParseEmailResponse> {
    const result = await this.connection.callTool("parse_email", input as Record<string, unknown>);
    return JSON.parse(result.content[0].text);
  }

  /**
   * Validate if a file is a valid email format
   */
  async validateEmailFile(input: ValidateEmailFileInput): Promise<ValidateEmailFileResponse> {
    const result = await this.connection.callTool("validate_email_file", input as Record<string, unknown>);
    return JSON.parse(result.content[0].text);
  }

  /**
   * Get list of supported email formats
   */
  async getSupportedFormats(): Promise<GetSupportedFormatsResponse> {
    const result = await this.connection.callTool("get_supported_formats", {});
    return JSON.parse(result.content[0].text);
  }

  /**
   * Extract only attachments from an email
   */
  async extractAttachments(input: ExtractAttachmentsInput): Promise<ExtractAttachmentsResponse> {
    const result = await this.connection.callTool("extract_attachments", input as Record<string, unknown>);
    return JSON.parse(result.content[0].text);
  }

  /**
   * Get email metadata without full content
   */
  async getEmailMetadata(input: GetEmailMetadataInput): Promise<GetEmailMetadataResponse> {
    const result = await this.connection.callTool("get_email_metadata", input as Record<string, unknown>);
    return JSON.parse(result.content[0].text);
  }

  /**
   * Format email content for display
   */
  async formatEmailContent(input: FormatEmailContentInput): Promise<FormatEmailContentResponse> {
    const result = await this.connection.callTool("format_email_content", input as Record<string, unknown>);
    return JSON.parse(result.content[0].text);
  }

  // ============================================
  // Convenience Methods
  // ============================================

  /**
   * Parse email from a file path (Node.js only)
   */
  async parseEmailFromFile(filePath: string): Promise<ParseEmailResponse> {
    const fs = await import("fs");
    const path = await import("path");

    const buffer = fs.readFileSync(filePath);
    const content = buffer.toString("base64");
    const fileName = path.basename(filePath);

    return this.parseEmail({ content, fileName });
  }

  /**
   * Quick check if content is a valid email
   */
  async isValidEmail(content: string): Promise<boolean> {
    const result = await this.validateEmailFile({ content, expectedType: "any" });
    return result.isValid;
  }

  /**
   * Get just the subject and sender (most common use case)
   */
  async getEmailSummary(
    content: string,
    fileName: string
  ): Promise<{ subject: string; from: EmailAddress; date?: string }> {
    const result = await this.getEmailMetadata({ content, fileName });
    return {
      subject: result.metadata.subject,
      from: result.metadata.from,
      date: result.metadata.sentDate || result.metadata.receivedDate,
    };
  }

  /**
   * Get all images from an email
   */
  async getEmailImages(content: string, fileName: string): Promise<AttachmentInfo[]> {
    const result = await this.extractAttachments({
      content,
      fileName,
      filterByMimeType: "image/",
      includeEmbedded: true,
    });
    return result.attachments;
  }
}

// Export types for consumers
export type {
  ParseEmailInput,
  ValidateEmailFileInput,
  ExtractAttachmentsInput,
  GetEmailMetadataInput,
  FormatEmailContentInput,
} from "./types.js";
