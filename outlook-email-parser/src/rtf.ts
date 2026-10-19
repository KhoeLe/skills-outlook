/**
 * RTF (Rich Text Format) processing utilities
 * Handles LZFu decompression and HTML extraction from encapsulated RTF
 */

import iconv from "iconv-lite";
import { RTF_MAGIC, RTF_PREBUFFER, WIN1252_SPECIAL_CHARS } from "./constants";
import { detectRtfCodepage } from "./encoding";

/**
 * Decode a single RTF byte using smart Vietnamese detection
 * Uses iconv-lite for proper codepage handling
 */
function decodeRtfByte(byte: number, codepage: string): string {
  if (byte < 0x80) {
    return String.fromCharCode(byte);
  }

  // Vietnamese-specific characters in Windows-1258
  const vietnamese1258Bytes: Record<number, string> = {
    0xc3: "Ă",
    0xd0: "Đ",
    0xd5: "Ơ",
    0xe3: "ă",
    0xf0: "đ",
    0xf5: "ơ",
    0xfd: "ư",
  };

  // Bytes that should stay as Windows-1252
  const keep1252Bytes = new Set([
    0xc0, 0xc1, 0xc2, 0xc8, 0xc9, 0xca, 0xcc, 0xcd, 0xd2, 0xd3, 0xd4, 0xd9, 0xda, 0xdc, 0xdd,
    0xe0, 0xe1, 0xe2, 0xe8, 0xe9, 0xea, 0xec, 0xed, 0xf2, 0xf3, 0xf4, 0xf9, 0xfa, 0xfc,
  ]);

  if (vietnamese1258Bytes[byte]) {
    return vietnamese1258Bytes[byte];
  }

  if (keep1252Bytes.has(byte)) {
    try {
      return iconv.decode(Buffer.from([byte]), "windows-1252");
    } catch {
      return String.fromCharCode(byte);
    }
  }

  // For Windows-1252 special chars (0x80-0x9F)
  if (byte >= 0x80 && byte <= 0x9f && WIN1252_SPECIAL_CHARS[byte] !== undefined) {
    return String.fromCharCode(WIN1252_SPECIAL_CHARS[byte]);
  }

  try {
    return iconv.decode(Buffer.from([byte]), codepage);
  } catch {
    return String.fromCharCode(byte);
  }
}

/**
 * Decode Windows-1252 encoded bytes to Unicode string
 */
function decodeWindows1252(bytes: number[]): string {
  let result = "";
  for (const byte of bytes) {
    if (byte < 0x80) {
      result += String.fromCharCode(byte);
    } else if (byte >= 0x80 && byte <= 0x9f && WIN1252_SPECIAL_CHARS[byte]) {
      result += String.fromCharCode(WIN1252_SPECIAL_CHARS[byte]);
    } else {
      result += String.fromCharCode(byte);
    }
  }
  return result;
}

/**
 * Decompress RTF using LZFu algorithm (MS-OXRTFCP)
 */
export function decompressRtf(data: Buffer): string {
  if (data.length < 16) return "";

  const view = new DataView(data.buffer, data.byteOffset);
  const compSize = view.getUint32(0, true);
  const rawSize = view.getUint32(4, true);
  const magic = view.getUint32(8, true);

  if (magic === RTF_MAGIC.UNCOMPRESSED) {
    return data.subarray(16).toString("utf8");
  }

  if (magic !== RTF_MAGIC.COMPRESSED) {
    return "";
  }

  // LZFu decompression
  const dict = Buffer.alloc(4096);
  Buffer.from(RTF_PREBUFFER).copy(dict);
  let dictPos = RTF_PREBUFFER.length;

  const output: number[] = [];
  let pos = 16;
  const end = Math.min(data.length, compSize + 4);

  while (pos < end && output.length < rawSize) {
    const flags = data[pos++];
    for (let i = 0; i < 8 && pos < end && output.length < rawSize; i++) {
      if (flags & (1 << i)) {
        if (pos + 1 >= end) break;
        const ref = (data[pos] << 8) | data[pos + 1];
        pos += 2;
        const offset = ref >>> 4;
        const length = (ref & 0x0f) + 2;
        for (let j = 0; j < length && output.length < rawSize; j++) {
          const byte = dict[(offset + j) % 4096];
          output.push(byte);
          dict[dictPos++ % 4096] = byte;
        }
      } else {
        const byte = data[pos++];
        output.push(byte);
        dict[dictPos++ % 4096] = byte;
      }
    }
  }

  return decodeWindows1252(output);
}


/**
 * Extract HTML from RTF with encapsulated HTML (\fromhtml1 format)
 */
export function extractHtmlFromRtf(rtf: string): string {
  const codepage = detectRtfCodepage(rtf);
  const htmlParts: string[] = [];
  let i = 0;

  while (i < rtf.length) {
    // Skip \htmlrtf groups (RTF-only content)
    if (rtf.substring(i, i + 8) === "\\htmlrtf") {
      i += 8;
      if (rtf[i] === "0") {
        i++;
        if (rtf[i] === " ") i++;
        continue;
      }
      if (rtf[i] === " ") i++;

      let depth = 0;
      while (i < rtf.length) {
        if (rtf[i] === "{") depth++;
        else if (rtf[i] === "}") {
          if (depth === 0) break;
          depth--;
        } else if (rtf.substring(i, i + 9) === "\\htmlrtf0") {
          i += 9;
          if (rtf[i] === " ") i++;
          break;
        }
        i++;
      }
      continue;
    }

    // Extract {\*\htmltag...} content
    if (rtf.substring(i, i + 11) === "{\\*\\htmltag") {
      i += 11;
      while (i < rtf.length && /\d/.test(rtf[i])) i++;
      if (rtf[i] === " ") i++;

      let depth = 1;
      let tagContent = "";
      while (i < rtf.length && depth > 0) {
        if (rtf[i] === "{") {
          depth++;
          i++;
        } else if (rtf[i] === "}") {
          depth--;
          if (depth > 0) i++;
          else break;
        } else if (rtf[i] === "\\") {
          i++;
          if (rtf[i] === "'") {
            i++;
            const hex = rtf.substring(i, i + 2);
            if (/^[0-9a-f]{2}$/i.test(hex)) {
              tagContent += decodeRtfByte(parseInt(hex, 16), codepage);
              i += 2;
            }
          } else if (rtf[i] === "\\" || rtf[i] === "{" || rtf[i] === "}") {
            tagContent += rtf[i++];
          } else {
            while (i < rtf.length && /[a-z]/i.test(rtf[i])) i++;
            while (i < rtf.length && /[\d-]/.test(rtf[i])) i++;
            if (rtf[i] === " ") i++;
          }
        } else {
          tagContent += rtf[i++];
        }
      }
      i++;
      htmlParts.push(tagContent);
      continue;
    }

    // Skip other {\*\...} groups
    if (rtf.substring(i, i + 3) === "{\\*") {
      let depth = 1;
      i += 3;
      while (i < rtf.length && depth > 0) {
        if (rtf[i] === "{") depth++;
        else if (rtf[i] === "}") depth--;
        i++;
      }
      continue;
    }

    // Skip font/color tables
    if (rtf[i] === "{") {
      const ahead = rtf.substring(i, i + 20);
      if (
        ahead.includes("\\fonttbl") ||
        ahead.includes("\\colortbl") ||
        ahead.includes("\\stylesheet") ||
        ahead.includes("\\*\\")
      ) {
        let depth = 1;
        i++;
        while (i < rtf.length && depth > 0) {
          if (rtf[i] === "{") depth++;
          else if (rtf[i] === "}") depth--;
          i++;
        }
        continue;
      }
      i++;
      continue;
    }

    if (rtf[i] === "}") {
      i++;
      continue;
    }

    // Handle RTF commands
    if (rtf[i] === "\\") {
      i++;
      if (i < rtf.length && rtf[i] === "'") {
        i++;
        const hex = rtf.substring(i, i + 2);
        if (/^[0-9a-f]{2}$/i.test(hex)) {
          htmlParts.push(decodeRtfByte(parseInt(hex, 16), codepage));
          i += 2;
        }
        continue;
      }

      let cmd = "";
      while (i < rtf.length && /[a-z]/i.test(rtf[i])) cmd += rtf[i++];
      let num = "";
      while (i < rtf.length && /[\d-]/.test(rtf[i])) num += rtf[i++];
      if (rtf[i] === " ") i++;

      if (cmd === "u") {
        const code = parseInt(num, 10);
        if (!isNaN(code)) {
          htmlParts.push(String.fromCharCode(code < 0 ? code + 65536 : code));
        }
        if (rtf[i] === "?") i++;
      }
      continue;
    }

    if (rtf[i] !== "\r" && rtf[i] !== "\n") {
      htmlParts.push(rtf[i]);
    }
    i++;
  }

  return htmlParts
    .join("")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}


/**
 * Convert RTF to plain text
 */
export function rtfToPlainText(rtf: string): string {
  if (rtf.includes("\\fromhtml")) {
    return extractPlainTextFromHtmlRtf(rtf);
  }

  const codepage = detectRtfCodepage(rtf);
  let text = "";
  let i = 0;
  let skipGroup = 0;

  while (i < rtf.length) {
    const ch = rtf[i];

    if (ch === "{") {
      const ahead = rtf.substring(i, i + 20);
      if (
        ahead.includes("\\*\\") ||
        ahead.includes("\\fonttbl") ||
        ahead.includes("\\colortbl") ||
        ahead.includes("\\stylesheet")
      ) {
        skipGroup++;
      }
      i++;
    } else if (ch === "}") {
      if (skipGroup > 0) skipGroup--;
      i++;
    } else if (skipGroup > 0) {
      i++;
    } else if (ch === "\\") {
      i++;
      if (i < rtf.length && rtf[i] === "'") {
        i++;
        const hex = rtf.substring(i, i + 2);
        if (/^[0-9a-f]{2}$/i.test(hex)) {
          text += decodeRtfByte(parseInt(hex, 16), codepage);
          i += 2;
        }
        continue;
      }

      let cmd = "";
      while (i < rtf.length && /[a-z]/i.test(rtf[i])) cmd += rtf[i++];
      let num = "";
      while (i < rtf.length && /[\d-]/.test(rtf[i])) num += rtf[i++];
      if (i < rtf.length && rtf[i] === " ") i++;

      if (cmd === "par" || cmd === "line") text += "\n";
      else if (cmd === "tab") text += "\t";
      else if (cmd === "u") {
        const code = parseInt(num, 10);
        if (!isNaN(code)) {
          text += String.fromCharCode(code < 0 ? code + 65536 : code);
        }
        if (i < rtf.length && rtf[i] === "?") i++;
      }
    } else {
      text += ch;
      i++;
    }
  }

  return text.trim();
}

/**
 * Extract plain text from HTML-encapsulated RTF
 */
function extractPlainTextFromHtmlRtf(rtf: string): string {
  const codepage = detectRtfCodepage(rtf);
  const result: string[] = [];
  let i = 0;

  while (i < rtf.length) {
    // Skip \htmlrtf groups
    if (rtf.substring(i, i + 8) === "\\htmlrtf") {
      i += 8;
      if (rtf[i] === "0") {
        i++;
        if (rtf[i] === " ") i++;
        continue;
      }
      if (rtf[i] === " ") i++;

      let depth = 0;
      while (i < rtf.length) {
        if (rtf[i] === "{") depth++;
        else if (rtf[i] === "}") {
          if (depth === 0) break;
          depth--;
        } else if (rtf.substring(i, i + 9) === "\\htmlrtf0") {
          i += 9;
          if (rtf[i] === " ") i++;
          break;
        }
        i++;
      }
      continue;
    }

    // Handle {\*\htmltag...} - check for line break tags
    if (rtf.substring(i, i + 11) === "{\\*\\htmltag") {
      i += 11;
      while (i < rtf.length && /\d/.test(rtf[i])) i++;
      if (rtf[i] === " ") i++;

      let depth = 1;
      let tagContent = "";
      while (i < rtf.length && depth > 0) {
        if (rtf[i] === "{") depth++;
        else if (rtf[i] === "}") depth--;
        else if (depth === 1) tagContent += rtf[i];
        i++;
      }

      const lowerTag = tagContent.toLowerCase();
      if (
        lowerTag.includes("<br") ||
        lowerTag.includes("</p") ||
        lowerTag.includes("</div") ||
        lowerTag.includes("</tr")
      ) {
        result.push("\n");
      }
      continue;
    }

    // Skip other {\*\...} groups
    if (rtf.substring(i, i + 3) === "{\\*") {
      let depth = 1;
      i += 3;
      while (i < rtf.length && depth > 0) {
        if (rtf[i] === "{") depth++;
        else if (rtf[i] === "}") depth--;
        i++;
      }
      continue;
    }

    // Skip font/color tables
    if (rtf[i] === "{") {
      const ahead = rtf.substring(i, i + 15);
      if (
        ahead.includes("\\fonttbl") ||
        ahead.includes("\\colortbl") ||
        ahead.includes("\\stylesheet") ||
        ahead.includes("\\*\\")
      ) {
        let depth = 1;
        i++;
        while (i < rtf.length && depth > 0) {
          if (rtf[i] === "{") depth++;
          else if (rtf[i] === "}") depth--;
          i++;
        }
        continue;
      }
      i++;
      continue;
    }

    if (rtf[i] === "}") {
      i++;
      continue;
    }

    // Handle RTF commands
    if (rtf[i] === "\\") {
      i++;
      if (i < rtf.length && rtf[i] === "'") {
        i++;
        const hex = rtf.substring(i, i + 2);
        if (/^[0-9a-f]{2}$/i.test(hex)) {
          result.push(decodeRtfByte(parseInt(hex, 16), codepage));
          i += 2;
        }
        continue;
      }

      let cmd = "";
      while (i < rtf.length && /[a-z]/i.test(rtf[i])) cmd += rtf[i++];
      let num = "";
      while (i < rtf.length && /[\d-]/.test(rtf[i])) num += rtf[i++];
      if (i < rtf.length && rtf[i] === " ") i++;

      if (cmd === "par" || cmd === "line") result.push("\n");
      else if (cmd === "tab") result.push("\t");
      else if (cmd === "u") {
        const code = parseInt(num, 10);
        if (!isNaN(code)) {
          result.push(String.fromCharCode(code < 0 ? code + 65536 : code));
        }
        if (i < rtf.length && rtf[i] === "?") i++;
      }
      continue;
    }

    if (rtf[i] !== "\r" && rtf[i] !== "\n") {
      result.push(rtf[i]);
    }
    i++;
  }

  return result
    .join("")
    .replace(/\n{2,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n /g, "\n")
    .replace(/ \n/g, "\n")
    .replace(/^\s+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Convert HTML to plain text
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
