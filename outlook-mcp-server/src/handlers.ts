/**
 * Tool Handlers - Implementation of MCP tools
 */

import {
  parseEmail,
  parseMsgBuffer,
  parseEmlBuffer,
  isValidMsgFile,
  isValidEmlFile,
  getSupportedExtensions,
} from "outlook-email-parser";
import type { ParsedEmail, EmailAttachment } from "outlook-email-parser";
import {
  ParseEmailInputSchema,
  ValidateEmailFileInputSchema,
  ExtractAttachmentsInputSchema,
  GetEmailMetadataInputSchema,
  FormatEmailContentInputSchema,
} from "./types.js";

/**
 * Parse email file and return full content
 */
export async function handleParseEmail(args: unknown) {
  const input = ParseEmailInputSchema.parse(args);
  const buffer = Buffer.from(input.content, "base64");
  const includeAttachmentContent = input.includeAttachmentContent ?? true;
  const maxAttachmentSize = input.maxAttachmentSize ?? 10 * 1024 * 1024;

  const result = await parseEmail(buffer, input.fileName, {
    includeAttachmentContent,
    maxAttachmentSize,
  });

  return {
    success: true,
    fileType: result.type,
    fileName: result.fileName,
    email: {
      subject: result.data.subject,
      from: result.data.from,
      to: result.data.to,
      cc: result.data.cc,
      bcc: result.data.bcc,
      replyTo: result.data.replyTo,
      sentDate: result.data.sentDate,
      receivedDate: result.data.receivedDate,
      priority: result.data.priority,
      importance: result.data.importance,
      textContent: result.data.textContent,
      htmlContent: result.data.htmlContent,
      attachmentCount: result.data.attachments.length,
      attachments: result.data.attachments.map((att) => ({
        filename: att.filename,
        size: att.size,
        mimeType: att.mimeType,
        contentId: att.contentId,
        hasContent: !!att.content,
        content: includeAttachmentContent ? att.content : undefined,
      })),
    },
  };
}

/**
 * Validate email file format
 */
export async function handleValidateEmailFile(args: unknown) {
  const input = ValidateEmailFileInputSchema.parse(args);
  const buffer = Buffer.from(input.content, "base64");
  const expectedType = input.expectedType ?? "any";

  const isMsgValid = isValidMsgFile(buffer);
  const isEmlValid = isValidEmlFile(buffer);

  let isValid = false;
  let detectedType: string | null = null;

  if (expectedType === "msg") {
    isValid = isMsgValid;
    detectedType = isMsgValid ? "msg" : null;
  } else if (expectedType === "eml") {
    isValid = isEmlValid;
    detectedType = isEmlValid ? "eml" : null;
  } else {
    isValid = isMsgValid || isEmlValid;
    detectedType = isMsgValid ? "msg" : isEmlValid ? "eml" : null;
  }

  return {
    isValid,
    detectedType,
    expectedType,
    checks: {
      isMsgFormat: isMsgValid,
      isEmlFormat: isEmlValid,
    },
  };
}

/**
 * Get supported file formats
 */
export async function handleGetSupportedFormats() {
  return {
    extensions: getSupportedExtensions(),
    formats: [
      {
        extension: ".msg",
        name: "Microsoft Outlook Message",
        description: "Native Outlook email format using CFB (Compound File Binary)",
        features: ["Full metadata", "Attachments", "Embedded images", "RTF content"],
      },
      {
        extension: ".eml",
        name: "Email Message (RFC 822)",
        description: "Standard email format supported by most email clients",
        features: ["Universal compatibility", "MIME attachments", "HTML content"],
      },
      {
        extension: ".oft",
        name: "Outlook Template",
        description: "Outlook email template, same format as MSG",
        features: ["Same as MSG", "Used for email templates"],
      },
    ],
  };
}

/**
 * Extract only attachments from email
 */
export async function handleExtractAttachments(args: unknown) {
  const input = ExtractAttachmentsInputSchema.parse(args);
  const buffer = Buffer.from(input.content, "base64");
  const includeEmbedded = input.includeEmbedded ?? true;

  const result = await parseEmail(buffer, input.fileName, {
    includeAttachmentContent: true,
  });

  let attachments = result.data.attachments;

  // Filter embedded images if requested
  if (!includeEmbedded) {
    attachments = attachments.filter((att) => !att.contentId);
  }

  // Filter by MIME type if specified
  if (input.filterByMimeType) {
    attachments = attachments.filter(
      (att) => att.mimeType?.startsWith(input.filterByMimeType!) ?? false
    );
  }

  return {
    success: true,
    totalCount: result.data.attachments.length,
    filteredCount: attachments.length,
    attachments: attachments.map((att) => ({
      filename: att.filename,
      size: att.size,
      mimeType: att.mimeType,
      contentId: att.contentId,
      isEmbedded: !!att.contentId,
      content: att.content,
    })),
  };
}

/**
 * Get email metadata only (lightweight)
 */
export async function handleGetEmailMetadata(args: unknown) {
  const input = GetEmailMetadataInputSchema.parse(args);
  const buffer = Buffer.from(input.content, "base64");

  const result = await parseEmail(buffer, input.fileName, {
    includeAttachmentContent: false,
  });

  return {
    success: true,
    fileType: result.type,
    metadata: {
      subject: result.data.subject,
      from: result.data.from,
      to: result.data.to,
      cc: result.data.cc,
      bcc: result.data.bcc,
      replyTo: result.data.replyTo,
      sentDate: result.data.sentDate,
      receivedDate: result.data.receivedDate,
      priority: result.data.priority,
      importance: result.data.importance,
      hasHtmlContent: !!result.data.htmlContent,
      hasTextContent: !!result.data.textContent,
      attachmentCount: result.data.attachments.length,
      attachmentSummary: result.data.attachments.map((att) => ({
        filename: att.filename,
        size: att.size,
        mimeType: att.mimeType,
        isEmbedded: !!att.contentId,
      })),
    },
  };
}

/**
 * Format email content for display
 */
export async function handleFormatEmailContent(args: unknown) {
  const input = FormatEmailContentInputSchema.parse(args);

  const result: {
    formattedHtml?: string;
    convertedHtml?: string;
    cidReplacements?: number;
  } = {};

  // Clean up HTML content
  if (input.htmlContent) {
    result.formattedHtml = cleanupHtml(input.htmlContent);
  }

  // Convert plain text to HTML
  if (input.textContent) {
    result.convertedHtml = textToFormattedHtml(input.textContent);
  }

  // Replace CID URLs with data URIs
  if (result.formattedHtml && input.attachments) {
    const { html, replacements } = replaceCidUrls(result.formattedHtml, input.attachments);
    result.formattedHtml = html;
    result.cidReplacements = replacements;
  }

  return {
    success: true,
    ...result,
  };
}

// ============================================
// Utility functions (inline to avoid dependency on outlook-reader-ui)
// ============================================

function cleanupHtml(html: string): string {
  // Remove script tags
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  // Remove event handlers
  cleaned = cleaned.replace(/\s*on\w+="[^"]*"/gi, "");
  cleaned = cleaned.replace(/\s*on\w+='[^']*'/gi, "");
  return cleaned;
}

function textToFormattedHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Convert URLs to links
  const withLinks = escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Convert newlines to <br>
  return withLinks.replace(/\n/g, "<br>");
}

function replaceCidUrls(
  html: string,
  attachments: Array<{ filename: string; contentId?: string; content?: string; mimeType?: string }>
): { html: string; replacements: number } {
  let replacements = 0;

  const result = html.replace(/cid:([^"'\s>]+)/gi, (match, cid) => {
    const attachment = attachments.find(
      (att) => att.contentId === cid || att.contentId === `<${cid}>`
    );

    if (attachment?.content && attachment.mimeType) {
      replacements++;
      return `data:${attachment.mimeType};base64,${attachment.content}`;
    }

    return match;
  });

  return { html: result, replacements };
}
