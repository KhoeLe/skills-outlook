/**
 * Email address with optional name
 */
export interface EmailAddress {
  name?: string;
  email?: string;
}

/**
 * Email attachment with optional content
 */
export interface EmailAttachment {
  /** Filename of the attachment */
  filename: string;
  /** Size in bytes */
  size: number;
  /** Content-ID for embedded images (cid:) */
  contentId?: string;
  /** Base64 encoded content */
  content?: string;
  /** MIME type (e.g., "image/png") */
  mimeType?: string;
}

/**
 * Parsed email data structure
 */
export interface ParsedEmail {
  /** Email subject */
  subject: string;
  /** Sender information */
  from: EmailAddress;
  /** Recipients (To field) */
  to?: string;
  /** CC recipients */
  cc?: string;
  /** BCC recipients */
  bcc?: string;
  /** Reply-To address */
  replyTo?: string;
  /** Date the email was sent */
  sentDate?: string;
  /** Date the email was received */
  receivedDate?: string;
  /** Priority (1=High, 3=Normal, 5=Low) */
  priority?: number;
  /** Importance level */
  importance?: number;
  /** Plain text content */
  textContent?: string;
  /** HTML content */
  htmlContent?: string;
  /** List of attachments */
  attachments: EmailAttachment[];
}

/**
 * Supported email file types
 */
export type EmailFileType = "msg" | "eml" | "pst" | "oft";

/**
 * Result of parsing an email file
 */
export interface ParseResult {
  /** Type of file that was parsed */
  type: EmailFileType;
  /** Original filename */
  fileName: string;
  /** Parsed email data */
  data: ParsedEmail;
}

/**
 * PST message summary (for listing)
 */
export interface PstMessageSummary {
  subject: string;
  from: string;
  to: string;
  date: string;
  hasAttachments: boolean;
}

/**
 * Result of parsing a PST file
 */
export interface PstParseResult {
  type: "pst";
  fileName: string;
  data: {
    messageCount: number;
    messages: PstMessageSummary[];
    truncated: boolean;
  };
}

/**
 * Parser options
 */
export interface ParserOptions {
  /** Include attachment content (base64). Default: true */
  includeAttachmentContent?: boolean;
  /** Maximum attachment size to include content (bytes). Default: 10MB */
  maxAttachmentSize?: number;
  /** Maximum messages to extract from PST. Default: 100 */
  maxPstMessages?: number;
}
