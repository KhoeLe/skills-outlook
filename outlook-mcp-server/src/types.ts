/**
 * MCP Server Types for Outlook Parser
 * These types define the tool schemas for AI agents
 */

import { z } from "zod";

// ============================================
// Tool Input Schemas
// ============================================

export const ParseEmailInputSchema = z.object({
  content: z.string().describe("Base64 encoded email file content"),
  fileName: z.string().describe("Original filename with extension (.msg, .eml, .oft)"),
  includeAttachmentContent: z
    .boolean()
    .optional()
    .describe("Include base64 attachment content in response"),
  maxAttachmentSize: z
    .number()
    .optional()
    .describe("Max attachment size in bytes to include content"),
});

export const ValidateEmailFileInputSchema = z.object({
  content: z.string().describe("Base64 encoded file content to validate"),
  expectedType: z
    .enum(["msg", "eml", "any"])
    .optional()
    .describe("Expected file type to validate against"),
});

export const GetSupportedFormatsInputSchema = z.object({});

export const ExtractAttachmentsInputSchema = z.object({
  content: z.string().describe("Base64 encoded email file content"),
  fileName: z.string().describe("Original filename with extension"),
  filterByMimeType: z
    .string()
    .optional()
    .describe("Filter attachments by MIME type prefix (e.g., 'image/')"),
  includeEmbedded: z
    .boolean()
    .optional()
    .describe("Include embedded images (CID attachments)"),
});

export const GetEmailMetadataInputSchema = z.object({
  content: z.string().describe("Base64 encoded email file content"),
  fileName: z.string().describe("Original filename with extension"),
});

export const FormatEmailContentInputSchema = z.object({
  htmlContent: z.string().optional().describe("HTML content to clean up"),
  textContent: z.string().optional().describe("Plain text to convert to HTML"),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        contentId: z.string().optional(),
        content: z.string().optional(),
        mimeType: z.string().optional(),
      })
    )
    .optional()
    .describe("Attachments for CID URL replacement"),
});

// ============================================
// Type Exports
// ============================================

export type ParseEmailInput = z.infer<typeof ParseEmailInputSchema>;
export type ValidateEmailFileInput = z.infer<typeof ValidateEmailFileInputSchema>;
export type GetSupportedFormatsInput = z.infer<typeof GetSupportedFormatsInputSchema>;
export type ExtractAttachmentsInput = z.infer<typeof ExtractAttachmentsInputSchema>;
export type GetEmailMetadataInput = z.infer<typeof GetEmailMetadataInputSchema>;
export type FormatEmailContentInput = z.infer<typeof FormatEmailContentInputSchema>;
