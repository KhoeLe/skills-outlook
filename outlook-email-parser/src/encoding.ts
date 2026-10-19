/**
 * Encoding utilities for handling various character sets
 * Supports Vietnamese (Windows-1258), Western European (Windows-1252), UTF-8, UTF-16LE, etc.
 */

import iconv from "iconv-lite";
import { WIN1252_SPECIAL_CHARS, WIN1258_VIETNAMESE_CHARS, CODEPAGE_MAP, CHARSET_ALIASES } from "./constants";

/**
 * Decode UTF-16LE buffer to string (supports Vietnamese and other Unicode)
 */
export function decodeUtf16Le(buffer: Buffer): string {
  let result = "";
  for (let i = 0; i < buffer.length - 1; i += 2) {
    const code = buffer[i] | (buffer[i + 1] << 8);
    if (code === 0) continue;

    // Handle surrogate pairs for characters outside BMP (emoji, etc.)
    if (code >= 0xd800 && code <= 0xdbff && i + 3 < buffer.length) {
      const high = code;
      const low = buffer[i + 2] | (buffer[i + 3] << 8);
      if (low >= 0xdc00 && low <= 0xdfff) {
        const codePoint = 0x10000 + ((high - 0xd800) << 10) + (low - 0xdc00);
        result += String.fromCodePoint(codePoint);
        i += 2;
        continue;
      }
    }

    result += String.fromCharCode(code);
  }
  return result;
}

/**
 * Decode Windows-1252 encoded bytes to Unicode string
 */
export function decodeWindows1252(bytes: number[]): string {
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
 * Decode Windows-1252 encoded Buffer to Unicode string
 */
export function decodeWindows1252Buffer(buffer: Buffer): string {
  return iconv.decode(buffer, "windows-1252").replace(/\0/g, "");
}

/**
 * Decode buffer using iconv-lite with charset detection
 */
export function decodeBuffer(buffer: Buffer, charset?: string): string {
  const cleanBuffer = Buffer.from(buffer.filter((b) => b !== 0));

  if (charset) {
    try {
      return iconv.decode(cleanBuffer, charset);
    } catch {
      // Fall through to auto-detection
    }
  }

  const detectedCharset = detectCharset(cleanBuffer);

  try {
    return iconv.decode(cleanBuffer, detectedCharset);
  } catch {
    return iconv.decode(cleanBuffer, "windows-1252");
  }
}

/**
 * Detect charset from buffer content or HTML meta tags
 */
export function detectCharset(buffer: Buffer): string {
  // Check for BOM (Byte Order Mark)
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return "utf-8";
  }
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    return "utf-16le";
  }
  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    return "utf-16be";
  }

  // Try to find charset in HTML content
  const sample = buffer.slice(0, Math.min(buffer.length, 2048)).toString("ascii");
  const charsetMatch = sample.match(/charset\s*=\s*["']?([^"'\s;>]+)/i);

  if (charsetMatch) {
    const charset = charsetMatch[1].toLowerCase();
    const mapped = CHARSET_ALIASES[charset];
    if (mapped) return mapped;
    return charset;
  }

  // Check if content looks like valid UTF-8 with Vietnamese characters
  if (isValidUtf8(buffer)) {
    // Check for Vietnamese UTF-8 sequences (U+1EA0-U+1EF9)
    for (let i = 0; i < buffer.length - 2; i++) {
      if (buffer[i] === 0xe1 && buffer[i + 1] >= 0xba && buffer[i + 1] <= 0xbb) {
        return "utf-8";
      }
    }
    return "utf-8";
  }

  // Check for Vietnamese-specific byte patterns in Windows-1258
  if (detectVietnameseContent(buffer)) {
    return "windows-1258";
  }

  return "windows-1252";
}

/**
 * Check if buffer contains valid UTF-8 sequences
 */
export function isValidUtf8(buffer: Buffer): boolean {
  let i = 0;
  let hasMultibyte = false;

  while (i < buffer.length) {
    const byte = buffer[i];

    if (byte < 0x80) {
      i++;
    } else if ((byte & 0xe0) === 0xc0) {
      if (i + 1 >= buffer.length || (buffer[i + 1] & 0xc0) !== 0x80) {
        return false;
      }
      hasMultibyte = true;
      i += 2;
    } else if ((byte & 0xf0) === 0xe0) {
      if (i + 2 >= buffer.length || (buffer[i + 1] & 0xc0) !== 0x80 || (buffer[i + 2] & 0xc0) !== 0x80) {
        return false;
      }
      hasMultibyte = true;
      i += 3;
    } else if ((byte & 0xf8) === 0xf0) {
      if (
        i + 3 >= buffer.length ||
        (buffer[i + 1] & 0xc0) !== 0x80 ||
        (buffer[i + 2] & 0xc0) !== 0x80 ||
        (buffer[i + 3] & 0xc0) !== 0x80
      ) {
        return false;
      }
      hasMultibyte = true;
      i += 4;
    } else {
      return false;
    }
  }

  return hasMultibyte;
}

/**
 * Detect Vietnamese content by analyzing byte patterns
 * Uses Windows-1258 Vietnamese-specific byte values
 */
function detectVietnameseContent(buffer: Buffer): boolean {
  // All Vietnamese-specific bytes in Windows-1258 that differ from Windows-1252
  const vietnameseBytes = Object.keys(WIN1258_VIETNAMESE_CHARS).map(Number);

  let score = 0;
  const sampleSize = Math.min(buffer.length, 4096);

  for (let i = 0; i < sampleSize; i++) {
    if (vietnameseBytes.includes(buffer[i])) {
      score++;
    }
  }

  return score >= 3;
}

/**
 * Detect RTF codepage from header
 * Checks multiple indicators including font charset for Vietnamese
 */
export function detectRtfCodepage(rtf: string): string {
  // Check for explicit Vietnamese codepage
  if (rtf.includes("\\cpg1258")) {
    return "windows-1258";
  }

  // Check for Vietnamese font charset (163 = Vietnamese)
  // This is more reliable than ansicpg for Vietnamese content
  if (/\\fcharset163\b/.test(rtf)) {
    return "windows-1258";
  }

  // Check for Vietnamese font patterns
  const vietnameseFontPatterns = [/\\f\d+[^}]*VNI/i, /\\f\d+[^}]*TCVN/i, /\\f\d+[^}]*\.Vn/i];
  for (const pattern of vietnameseFontPatterns) {
    if (pattern.test(rtf)) {
      return "windows-1258";
    }
  }

  // Check for Vietnamese Unicode escapes (common Vietnamese characters)
  // These indicate Vietnamese content even if ansicpg says 1252
  const vietnameseUnicodes = [
    /\\u7841\b/,  // ạ
    /\\u7843\b/,  // ả
    /\\u7845\b/,  // ấ
    /\\u7847\b/,  // ầ
    /\\u7849\b/,  // ẩ
    /\\u7851\b/,  // ẫ
    /\\u7853\b/,  // ậ
    /\\u7855\b/,  // ắ
    /\\u7857\b/,  // ằ
    /\\u7859\b/,  // ẳ
    /\\u7861\b/,  // ẵ
    /\\u7863\b/,  // ặ
    /\\u7865\b/,  // ẹ
    /\\u7867\b/,  // ẻ
    /\\u7869\b/,  // ẽ
    /\\u7871\b/,  // ế
    /\\u7873\b/,  // ề
    /\\u7875\b/,  // ể
    /\\u7877\b/,  // ễ
    /\\u7879\b/,  // ệ
    /\\u7881\b/,  // ỉ
    /\\u7883\b/,  // ị
    /\\u7885\b/,  // ọ
    /\\u7887\b/,  // ỏ
    /\\u7889\b/,  // ố
    /\\u7891\b/,  // ồ
    /\\u7893\b/,  // ổ
    /\\u7895\b/,  // ỗ
    /\\u7897\b/,  // ộ
    /\\u7899\b/,  // ớ
    /\\u7901\b/,  // ờ
    /\\u7903\b/,  // ở
    /\\u7905\b/,  // ỡ
    /\\u7907\b/,  // ợ
  ];
  
  let vietnameseCount = 0;
  for (const pattern of vietnameseUnicodes) {
    if (pattern.test(rtf)) {
      vietnameseCount++;
      if (vietnameseCount >= 3) {
        return "windows-1258";
      }
    }
  }

  // Fall back to ansicpg value
  const match = rtf.match(/\\ansicpg(\d+)/);
  if (match) {
    const cpNum = match[1];
    return CODEPAGE_MAP[cpNum] || "windows-1252";
  }

  return "windows-1252";
}

/**
 * Normalize Vietnamese text - convert combining characters to precomposed form
 */
export function normalizeVietnamese(text: string): string {
  try {
    return text.normalize("NFC");
  } catch {
    return text;
  }
}
