/**
 * Outlook Parser - Parse Microsoft Outlook email files
 *
 * Supports:
 * - MSG files (Microsoft Outlook Message)
 * - EML files (Standard email format)
 * - OFT files (Outlook Template - same as MSG)
 *
 * @example
 * ```typescript
 * import { parseEmail, parseMsgBuffer, parseEmlBuffer } from 'outlook-email-parser';
 *
 * // Auto-detect file type
 * const email = await parseEmail(buffer, 'message.msg');
 *
 * // Or parse specific format
 * const msgEmail = parseMsgBuffer(buffer);
 * const emlEmail = await parseEmlBuffer(buffer);
 * ```
 */

import { parseMsgBuffer } from "./msg-parser";
import { parseEmlBuffer } from "./eml-parser";
import { CFB } from "./constants";
import type { ParsedEmail, ParseResult, EmailFileType, ParserOptions } from "./types";

// Re-export types
export type {
  ParsedEmail,
  ParseResult,
  EmailAddress,
  EmailAttachment,
  EmailFileType,
  ParserOptions,
  PstMessageSummary,
  PstParseResult,
} from "./types";

// Re-export parsers
export { parseMsgBuffer } from "./msg-parser";
export { parseEmlBuffer } from "./eml-parser";

/**
 * Parse an email file buffer with automatic format detection
 *
 * @param buffer - The file content as a Buffer
 * @param fileName - The filename (used for format detection)
 * @param options - Parser options
 * @returns Parsed email data
 *
 * @example
 * ```typescript
 * import { parseEmail } from 'outlook-email-parser';
 * import { readFileSync } from 'fs';
 *
 * const buffer = readFileSync('email.msg');
 * const email = await parseEmail(buffer, 'email.msg');
 *
 * console.log(email.data.subject);
 * console.log(email.data.from);
 * console.log(email.data.attachments);
 * ```
 */
export async function parseEmail(
  buffer: Buffer,
  fileName: string,
  options?: ParserOptions
): Promise<ParseResult> {
  const extension = getFileExtension(fileName);
  const type = getFileType(extension, buffer);

  let data: ParsedEmail;

  switch (type) {
    case "msg":
    case "oft":
      data = parseMsgBuffer(buffer, options);
      break;
    case "eml":
      data = await parseEmlBuffer(buffer, options);
      break;
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }

  return {
    type,
    fileName,
    data,
  };
}

/**
 * Detect the file type from extension and content
 */
function getFileType(extension: string, buffer: Buffer): EmailFileType {
  // Check by extension first
  if (extension === ".msg" || extension === ".oft") {
    return extension === ".oft" ? "oft" : "msg";
  }

  if (extension === ".eml") {
    return "eml";
  }

  // Try to detect by content
  if (isMsgFile(buffer)) {
    return "msg";
  }

  if (isEmlFile(buffer)) {
    return "eml";
  }

  throw new Error(`Cannot determine file type for extension: ${extension}`);
}

/**
 * Check if buffer is a valid MSG file (CFB format)
 */
function isMsgFile(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;
  return CFB.SIGNATURE.every((byte, i) => buffer[i] === byte);
}

/**
 * Check if buffer looks like an EML file
 */
function isEmlFile(buffer: Buffer): boolean {
  const headerStart = buffer.slice(0, 100).toString("utf-8");
  return /^(From:|Received:|Date:|Subject:|MIME-Version:|Message-ID:|Return-Path:)/im.test(headerStart);
}

/**
 * Get file extension from filename
 */
function getFileExtension(fileName: string): string {
  return fileName.toLowerCase().slice(fileName.lastIndexOf("."));
}

/**
 * Validate if a buffer is a valid MSG file
 */
export function isValidMsgFile(buffer: Buffer): boolean {
  return isMsgFile(buffer);
}

/**
 * Validate if a buffer is a valid EML file
 */
export function isValidEmlFile(buffer: Buffer): boolean {
  return isEmlFile(buffer);
}

/**
 * Get supported file extensions
 */
export function getSupportedExtensions(): string[] {
  return [".msg", ".eml", ".oft"];
}
