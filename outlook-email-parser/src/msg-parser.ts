/**
 * MSG Parser - Parses Microsoft Outlook .MSG files (CFB/OLE format)
 */

import { MAPI_PROPS, MIME_TYPES } from "./constants";
import { parseCfb, findLargestEntry, findEntries, readStream, type CfbFile, type DirectoryEntry } from "./cfb";
import { decodeUtf16Le, decodeWindows1252Buffer, decodeBuffer, normalizeVietnamese } from "./encoding";
import { decompressRtf, extractHtmlFromRtf, rtfToPlainText, htmlToText } from "./rtf";
import type { ParsedEmail, EmailAttachment, ParserOptions } from "./types";

const DEFAULT_OPTIONS: Required<ParserOptions> = {
  includeAttachmentContent: true,
  maxAttachmentSize: 10 * 1024 * 1024, // 10MB
  maxPstMessages: 100,
};

/**
 * Parse an MSG file buffer and return structured email data
 */
export function parseMsgBuffer(buffer: Buffer, options?: ParserOptions): ParsedEmail {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const parser = new MsgParser(buffer, opts);
  return parser.parse();
}

class MsgParser {
  private cfb: CfbFile;
  private options: Required<ParserOptions>;

  constructor(buffer: Buffer, options: Required<ParserOptions>) {
    this.cfb = parseCfb(buffer);
    this.options = options;
  }

  parse(): ParsedEmail {
    return this.extractMessage();
  }

  private extractMessage(): ParsedEmail {
    const result: ParsedEmail = {
      subject: this.normalize(this.getString(MAPI_PROPS.SUBJECT) || "(No subject)"),
      from: {
        name: this.normalize(this.getString(MAPI_PROPS.SENDER_NAME) || this.getString(MAPI_PROPS.SENDER_NAME_ALT)),
        email:
          this.getString(MAPI_PROPS.SENDER_EMAIL) ||
          this.getString(MAPI_PROPS.SENDER_EMAIL_ALT1) ||
          this.getString(MAPI_PROPS.SENDER_EMAIL_ALT2),
      },
      to: this.normalize(this.getString(MAPI_PROPS.TO)),
      cc: this.normalize(this.getString(MAPI_PROPS.CC)),
      bcc: this.normalize(this.getString(MAPI_PROPS.BCC)),
      sentDate: this.getString(MAPI_PROPS.SENT_DATE),
      attachments: [],
    };

    const { textContent, htmlContent } = this.extractBody();
    result.textContent = textContent ? this.normalize(textContent) : undefined;
    result.htmlContent = htmlContent ? this.normalize(htmlContent) : undefined;
    result.attachments = this.extractAttachments();

    return result;
  }

  private extractBody(): { textContent: string; htmlContent: string } {
    let textContent = "";
    let htmlContent = "";

    textContent = this.extractTextBody();
    htmlContent = this.extractHtmlBody();

    if (!htmlContent || !textContent) {
      const rtfResult = this.extractRtfBody();
      if (!htmlContent && rtfResult.html) htmlContent = rtfResult.html;
      if (!textContent && rtfResult.text) textContent = rtfResult.text;
    }

    if (textContent && !htmlContent) {
      htmlContent = this.textToHtml(textContent);
    }
    if (!textContent && htmlContent) {
      textContent = htmlToText(htmlContent);
    }

    return { textContent, htmlContent };
  }

  private extractTextBody(): string {
    const textDirs = findEntries(this.cfb.directories, (name) => {
      return (
        name.startsWith(`__substg1.0_${MAPI_PROPS.BODY_TEXT}${MAPI_PROPS.TYPE_UNICODE}`) ||
        name.startsWith(`__substg1.0_${MAPI_PROPS.BODY_TEXT}${MAPI_PROPS.TYPE_ANSI}`) ||
        (name.startsWith(`__substg1.0_${MAPI_PROPS.BODY_TEXT}`) && !name.includes(MAPI_PROPS.TYPE_BINARY))
      );
    });

    const textDir = textDirs.length > 0 ? textDirs.reduce((a, b) => (a.size >= b.size ? a : b)) : null;
    if (!textDir || textDir.size === 0) return "";

    const data = this.readDirectoryStream(textDir);
    const isUnicode = textDir.name.toLowerCase().includes(MAPI_PROPS.TYPE_UNICODE);
    const content = isUnicode ? decodeUtf16Le(data) : decodeBuffer(data);

    return this.cleanupText(content);
  }

  private extractHtmlBody(): string {
    const htmlDirs = findEntries(this.cfb.directories, (name) => {
      return (
        (name.startsWith(`__substg1.0_${MAPI_PROPS.BODY_HTML}${MAPI_PROPS.TYPE_UNICODE}`) ||
          name.startsWith(`__substg1.0_${MAPI_PROPS.BODY_HTML}${MAPI_PROPS.TYPE_ANSI}`) ||
          name.startsWith(`__substg1.0_${MAPI_PROPS.BODY_HTML_ALT}${MAPI_PROPS.TYPE_UNICODE}`) ||
          name.startsWith(`__substg1.0_${MAPI_PROPS.BODY_HTML_ALT}${MAPI_PROPS.TYPE_ANSI}`)) &&
        !name.includes(MAPI_PROPS.TYPE_BINARY)
      );
    });

    const htmlDir = htmlDirs.length > 0 ? htmlDirs.reduce((a, b) => (a.size >= b.size ? a : b)) : null;
    if (htmlDir && htmlDir.size > 0) {
      const data = this.readDirectoryStream(htmlDir);
      const isUnicode = htmlDir.name.toLowerCase().includes(MAPI_PROPS.TYPE_UNICODE);
      const str = isUnicode ? decodeUtf16Le(data) : decodeBuffer(data);
      if (this.looksLikeHtml(str)) return str;
    }

    const htmlBinDirs = findEntries(this.cfb.directories, (name) => {
      return (
        name.startsWith(`__substg1.0_${MAPI_PROPS.BODY_HTML}${MAPI_PROPS.TYPE_BINARY}`) ||
        name.startsWith(`__substg1.0_${MAPI_PROPS.BODY_HTML_ALT}${MAPI_PROPS.TYPE_BINARY}`)
      );
    });

    const htmlBinDir = htmlBinDirs.length > 0 ? htmlBinDirs.reduce((a, b) => (a.size >= b.size ? a : b)) : null;
    if (htmlBinDir && htmlBinDir.size > 100) {
      const data = this.readDirectoryStream(htmlBinDir);
      const str = decodeBuffer(data);
      if (this.looksLikeHtml(str)) return str;
    }

    return "";
  }

  private extractRtfBody(): { html: string; text: string } {
    const rtfDirs = findEntries(this.cfb.directories, (name) =>
      name.startsWith(`__substg1.0_${MAPI_PROPS.BODY_RTF}${MAPI_PROPS.TYPE_BINARY}`)
    );

    const rtfDir = rtfDirs.length > 0 ? rtfDirs.reduce((a, b) => (a.size >= b.size ? a : b)) : null;
    if (!rtfDir || rtfDir.size <= 16) return { html: "", text: "" };

    const data = this.readDirectoryStream(rtfDir);
    const decompressed = decompressRtf(data);
    if (!decompressed) return { html: "", text: "" };

    let html = "";
    let text = "";

    if (decompressed.includes("\\fromhtml")) {
      const extracted = extractHtmlFromRtf(decompressed);
      if (extracted && extracted.length > 50) html = extracted;
    }

    if (!html) {
      const htmlMatch = decompressed.match(/<html[^>]*>[\s\S]*<\/html>/i);
      if (htmlMatch) {
        html = htmlMatch[0];
      } else {
        const bodyMatch = decompressed.match(/<body[^>]*>[\s\S]*<\/body>/i);
        if (bodyMatch) html = bodyMatch[0];
      }
    }

    const extracted = rtfToPlainText(decompressed);
    if (extracted && extracted.length > 10) text = extracted;

    return { html, text };
  }

  private extractAttachments(): EmailAttachment[] {
    // Match attachment directories - format is __attach_version1.0_#XXXXXXXX where X is hex digit
    const attachDirs = this.cfb.directories.filter((d) => 
      /^__attach_version1\.0_#[0-9a-f]+$/i.test(d.name)
    );

    if (attachDirs.length === 0) {
      return [];
    }

    return attachDirs.map((dir, index) => this.extractAttachmentFromDir(dir, index));
  }

  private extractAttachmentFromDir(attachDir: DirectoryEntry, index: number): EmailAttachment {
    // Get all child entries of this attachment directory using tree traversal
    const children = this.getChildEntries(attachDir);
    
    // Find filename - try 3707 (long filename), 3704 (short filename), 3001 (display name)
    let filename = "";
    for (const prop of ["3707", "3704", "3001"]) {
      const fnDir = children.find(d => 
        d.name.toLowerCase().startsWith(`__substg1.0_${prop}`)
      );
      if (fnDir && fnDir.size > 0) {
        filename = this.readStringFromDir(fnDir);
        if (filename) break;
      }
    }

    // Find Content-ID (3712)
    let contentId = "";
    const cidDir = children.find(d => d.name.toLowerCase().startsWith("__substg1.0_3712"));
    if (cidDir && cidDir.size > 0) {
      contentId = this.readStringFromDir(cidDir);
    }

    // Find MIME type (370E)
    let mimeType = "";
    const mimeDir = children.find(d => d.name.toLowerCase().startsWith("__substg1.0_370e"));
    if (mimeDir && mimeDir.size > 0) {
      mimeType = this.readStringFromDir(mimeDir);
    }

    // Find attachment data (37010102)
    let content = "";
    let size = 0;
    const dataDir = children.find(d => d.name.toLowerCase() === "__substg1.0_37010102");
    if (dataDir && dataDir.size > 0) {
      size = dataDir.size;
      if (this.options.includeAttachmentContent && dataDir.size <= this.options.maxAttachmentSize) {
        const data = this.readDirectoryStream(dataDir);
        content = data.toString("base64");
      }
      if (!mimeType && filename) {
        mimeType = this.getMimeType(filename);
      }
    }

    // Check for embedded message (3701000D)
    if (size === 0) {
      const embeddedDir = children.find(d => d.name.toLowerCase() === "__substg1.0_3701000d");
      if (embeddedDir) {
        size = embeddedDir.size;
        if (!filename) filename = "Embedded Message.msg";
      }
    }

    const attachment: EmailAttachment = {
      filename: filename || `Attachment ${index + 1}`,
      size,
    };

    if (contentId) attachment.contentId = contentId;
    if (content) attachment.content = content;
    if (mimeType) attachment.mimeType = mimeType;

    return attachment;
  }

  private getChildEntries(parent: DirectoryEntry): DirectoryEntry[] {
    if (parent.childId === undefined || parent.childId < 0) return [];
    
    // Build index map
    const byIndex = new Map<number, DirectoryEntry>();
    for (const d of this.cfb.directories) {
      if (d.index !== undefined) {
        byIndex.set(d.index, d);
      }
    }
    
    // Traverse the red-black tree starting from childId
    const children: DirectoryEntry[] = [];
    const visited = new Set<number>();
    
    const traverse = (idx: number) => {
      if (idx < 0 || visited.has(idx)) return;
      visited.add(idx);
      
      const entry = byIndex.get(idx);
      if (!entry) return;
      
      children.push(entry);
      
      // Traverse left and right siblings
      if (entry.leftSibling !== undefined && entry.leftSibling >= 0) {
        traverse(entry.leftSibling);
      }
      if (entry.rightSibling !== undefined && entry.rightSibling >= 0) {
        traverse(entry.rightSibling);
      }
    };
    
    traverse(parent.childId);
    return children;
  }

  private getString(propId: string): string {
    const dir = findLargestEntry(this.cfb.directories, `__substg1.0_${propId}`);
    if (!dir || dir.size === 0) return "";
    return this.readStringFromDir(dir);
  }

  private readStringFromDir(dir: DirectoryEntry): string {
    const data = this.readDirectoryStream(dir);
    if (dir.name.toLowerCase().includes("001f")) {
      return decodeUtf16Le(data);
    } else {
      return decodeWindows1252Buffer(data);
    }
  }

  private readDirectoryStream(dir: DirectoryEntry): Buffer {
    const useMini = dir.size < this.cfb.miniCutoff;
    return readStream(
      this.cfb.buffer,
      this.cfb.fat,
      dir.start,
      dir.size,
      this.cfb.sectorSize,
      useMini,
      this.cfb.miniStream,
      this.cfb.miniFat,
      this.cfb.miniSectorSize
    );
  }

  private normalize(text: string): string {
    return normalizeVietnamese(text);
  }

  private cleanupText(text: string): string {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+$/gm, "")
      .trim();
  }

  private textToHtml(text: string): string {
    const cleaned = this.cleanupText(text);
    return `<div style="white-space: pre-wrap;">${cleaned.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
  }

  private looksLikeHtml(str: string): boolean {
    return str.includes("<html") || str.includes("<body") || str.includes("<div") || str.includes("<p");
  }

  private getMimeType(filename: string): string {
    const ext = filename.toLowerCase().split(".").pop() || "";
    return MIME_TYPES[ext] || "application/octet-stream";
  }
}
