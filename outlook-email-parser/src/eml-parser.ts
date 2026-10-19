/**
 * EML Parser - Parses standard email files (.eml)
 */

import { simpleParser, type ParsedMail, type AddressObject } from "mailparser";
import type { ParsedEmail, EmailAddress, EmailAttachment, ParserOptions } from "./types";

const DEFAULT_OPTIONS: Required<ParserOptions> = {
  includeAttachmentContent: true,
  maxAttachmentSize: 10 * 1024 * 1024, // 10MB
  maxPstMessages: 100,
};

/**
 * Parse an EML file buffer and return structured email data
 */
export async function parseEmlBuffer(buffer: Buffer, options?: ParserOptions): Promise<ParsedEmail> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const parsed: ParsedMail = await simpleParser(buffer);

  return {
    subject: parsed.subject || "(No subject)",
    from: extractFirstAddress(parsed.from),
    to: formatAddresses(parsed.to),
    cc: formatAddresses(parsed.cc),
    bcc: formatAddresses(parsed.bcc),
    sentDate: parsed.date?.toISOString(),
    priority: extractPriority(parsed),
    textContent: parsed.text || undefined,
    htmlContent: parsed.html || undefined,
    attachments: extractAttachments(parsed, opts),
  };
}

function formatAddresses(addresses: AddressObject | AddressObject[] | undefined): string {
  if (!addresses) return "";

  const addressList = Array.isArray(addresses) ? addresses : [addresses];

  return addressList
    .flatMap((addr) => addr.value || [])
    .map((a) => (a.name ? `${a.name} <${a.address}>` : a.address))
    .join(", ");
}

function extractFirstAddress(addresses: AddressObject | AddressObject[] | undefined): EmailAddress {
  if (!addresses) return {};

  const addressList = Array.isArray(addresses) ? addresses : [addresses];
  const first = addressList[0]?.value?.[0];

  if (!first) return {};

  return {
    name: first.name || undefined,
    email: first.address || undefined,
  };
}

function extractPriority(parsed: ParsedMail): number | undefined {
  const xPriority = parsed.headers?.get("x-priority");
  if (!xPriority) return undefined;

  const priorityStr = typeof xPriority === "string" ? xPriority : String(xPriority);
  const priorityNum = parseInt(priorityStr, 10);

  return isNaN(priorityNum) ? undefined : priorityNum;
}

function extractAttachments(parsed: ParsedMail, options: Required<ParserOptions>): EmailAttachment[] {
  return (parsed.attachments || []).map((att) => {
    const attachment: EmailAttachment = {
      filename: att.filename || "unnamed",
      size: att.size || 0,
      mimeType: att.contentType,
    };

    if (att.contentId) {
      attachment.contentId = att.contentId;
    }

    if (options.includeAttachmentContent && att.content && att.size <= options.maxAttachmentSize) {
      attachment.content = att.content.toString("base64");
    }

    return attachment;
  });
}
