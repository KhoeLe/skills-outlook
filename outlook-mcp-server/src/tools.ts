/**
 * MCP Tool Definitions for Outlook Parser
 * Each tool is designed for AI agent consumption with clear descriptions
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TOOLS: Tool[] = [
  {
    name: "parse_email",
    description: `Parse a Microsoft Outlook email file (MSG, EML, or OFT format) and extract all content.

Returns:
- Subject, sender, recipients (to, cc, bcc)
- Sent/received dates
- Priority and importance levels
- Plain text and HTML content
- All attachments with optional base64 content

Supported formats:
- .msg - Microsoft Outlook Message
- .eml - Standard email format (RFC 822)
- .oft - Outlook Template (same as MSG)`,
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "Base64 encoded email file content",
        },
        fileName: {
          type: "string",
          description: "Original filename with extension (.msg, .eml, .oft)",
        },
        includeAttachmentContent: {
          type: "boolean",
          description: "Include base64 attachment content in response (default: true)",
        },
        maxAttachmentSize: {
          type: "number",
          description: "Max attachment size in bytes to include content (default: 10MB)",
        },
      },
      required: ["content", "fileName"],
    },
  },
  {
    name: "validate_email_file",
    description: `Validate if a file is a valid Outlook email format.

Checks:
- MSG files: Validates CFB (Compound File Binary) signature
- EML files: Validates RFC 822 email headers

Use this before parsing to ensure file compatibility.`,
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "Base64 encoded file content to validate",
        },
        expectedType: {
          type: "string",
          enum: ["msg", "eml", "any"],
          description: "Expected file type to validate against (default: any)",
        },
      },
      required: ["content"],
    },
  },
  {
    name: "get_supported_formats",
    description: `Get list of supported email file formats and their descriptions.

Returns information about:
- File extensions supported
- Format descriptions
- Typical use cases`,
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "extract_attachments",
    description: `Extract only attachments from an email file.

Features:
- Filter by MIME type (e.g., 'image/', 'application/pdf')
- Option to include/exclude embedded images (CID attachments)
- Returns filename, size, MIME type, and optional content

Useful when you only need attachments without full email parsing.`,
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "Base64 encoded email file content",
        },
        fileName: {
          type: "string",
          description: "Original filename with extension",
        },
        filterByMimeType: {
          type: "string",
          description: "Filter attachments by MIME type prefix (e.g., 'image/')",
        },
        includeEmbedded: {
          type: "boolean",
          description: "Include embedded images/CID attachments (default: true)",
        },
      },
      required: ["content", "fileName"],
    },
  },
  {
    name: "get_email_metadata",
    description: `Get only metadata from an email without full content parsing.

Returns lightweight info:
- Subject
- Sender name and email
- Recipients
- Dates
- Priority
- Attachment count (without content)

Faster than full parsing when you only need headers.`,
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "Base64 encoded email file content",
        },
        fileName: {
          type: "string",
          description: "Original filename with extension",
        },
      },
      required: ["content", "fileName"],
    },
  },
  {
    name: "format_email_content",
    description: `Format and clean email content for display.

Features:
- Clean up HTML (remove scripts, sanitize)
- Convert plain text to formatted HTML
- Replace CID URLs with data URIs for embedded images

Use after parsing to prepare content for rendering.`,
    inputSchema: {
      type: "object",
      properties: {
        htmlContent: {
          type: "string",
          description: "HTML content to clean up",
        },
        textContent: {
          type: "string",
          description: "Plain text to convert to HTML",
        },
        attachments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              filename: { type: "string" },
              contentId: { type: "string" },
              content: { type: "string" },
              mimeType: { type: "string" },
            },
            required: ["filename"],
          },
          description: "Attachments for CID URL replacement",
        },
      },
      required: [],
    },
  },
];
