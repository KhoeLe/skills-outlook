/**
 * Constants used across the email parsing modules
 */

// CFB (Compound File Binary) format constants
export const CFB = {
  SIGNATURE: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
  END_OF_CHAIN: 0xfffffffe,
  FREE_SECTOR: 0xffffffff,
  DEFAULT_SECTOR_SIZE: 512,
  DEFAULT_MINI_SECTOR_SIZE: 64,
  DEFAULT_MINI_CUTOFF: 4096,
  HEADER_SIZE: 512,
  DIRECTORY_ENTRY_SIZE: 128,
} as const;

// RTF compression magic numbers
export const RTF_MAGIC = {
  COMPRESSED: 0x75465a4c, // "LZFu"
  UNCOMPRESSED: 0x414c454d, // "MELA"
} as const;

// RTF decompression prebuffer (MS-OXRTFCP specification)
export const RTF_PREBUFFER =
  "{\\rtf1\\ansi\\mac\\deff0\\deftab720{\\fonttbl;}{\\f0\\fnil \\froman \\fswiss \\fmodern \\fscript \\fdecor MS Sans SerifSymbolArialTimes New RomanCourier{\\colortbl\\red0\\green0\\blue0\r\n\\par \\pard\\plain\\f0\\fs20\\b\\i\\u\\tab\\tx";

// MAPI Property IDs (MS-OXPROPS)
export const MAPI_PROPS = {
  // Message properties
  SUBJECT: "0037",
  SENDER_NAME: "0C1A",
  SENDER_NAME_ALT: "3FFA",
  SENDER_EMAIL: "0C1F",
  SENDER_EMAIL_ALT1: "5D01",
  SENDER_EMAIL_ALT2: "0065",
  TO: "0E04",
  CC: "0E03",
  BCC: "0E02",
  SENT_DATE: "0039",

  // Body properties
  BODY_TEXT: "1000",
  BODY_HTML: "1013",
  BODY_HTML_ALT: "1014",
  BODY_RTF: "1009",

  // Attachment properties
  ATTACH_FILENAME: "3704",
  ATTACH_LONG_FILENAME: "3707",
  ATTACH_DISPLAY_NAME: "3001",
  ATTACH_DATA: "3701",
  ATTACH_CONTENT_ID: "3712",
  ATTACH_MIME_TYPE: "370E",
  ATTACH_SIZE: "0E20",

  // Property type suffixes
  TYPE_UNICODE: "001F",
  TYPE_ANSI: "001E",
  TYPE_BINARY: "0102",
} as const;

// Windows-1252 to Unicode mapping for bytes 0x80-0x9F
export const WIN1252_SPECIAL_CHARS: Record<number, number> = {
  0x80: 0x20ac, // €
  0x82: 0x201a, // ‚
  0x83: 0x0192, // ƒ
  0x84: 0x201e, // „
  0x85: 0x2026, // …
  0x86: 0x2020, // †
  0x87: 0x2021, // ‡
  0x88: 0x02c6, // ˆ
  0x89: 0x2030, // ‰
  0x8a: 0x0160, // Š
  0x8b: 0x2039, // ‹
  0x8c: 0x0152, // Œ
  0x8e: 0x017d, // Ž
  0x91: 0x2018, // '
  0x92: 0x2019, // '
  0x93: 0x201c, // "
  0x94: 0x201d, // "
  0x95: 0x2022, // •
  0x96: 0x2013, // –
  0x97: 0x2014, // —
  0x98: 0x02dc, // ˜
  0x99: 0x2122, // ™
  0x9a: 0x0161, // š
  0x9b: 0x203a, // ›
  0x9c: 0x0153, // œ
  0x9e: 0x017e, // ž
  0x9f: 0x0178, // Ÿ
};

// Common MIME types by file extension
export const MIME_TYPES: Record<string, string> = {
  // Images
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",

  // Documents
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Text
  txt: "text/plain",
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  js: "application/javascript",
  json: "application/json",
  xml: "application/xml",

  // Archives
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  "7z": "application/x-7z-compressed",

  // Media
  mp3: "audio/mpeg",
  wav: "audio/wav",
  mp4: "video/mp4",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
};

// Codepage mappings for RTF and charset detection
export const CODEPAGE_MAP: Record<string, string> = {
  "1258": "windows-1258", // Vietnamese
  "1252": "windows-1252", // Western European
  "1251": "windows-1251", // Cyrillic
  "1250": "windows-1250", // Central European
  "1253": "windows-1253", // Greek
  "1254": "windows-1254", // Turkish
  "1255": "windows-1255", // Hebrew
  "1256": "windows-1256", // Arabic
  "1257": "windows-1257", // Baltic
  "874": "windows-874", // Thai
  "932": "shift_jis", // Japanese
  "936": "gb2312", // Simplified Chinese
  "949": "euc-kr", // Korean
  "950": "big5", // Traditional Chinese
  "65001": "utf-8", // UTF-8
};

// Charset aliases for normalization
export const CHARSET_ALIASES: Record<string, string> = {
  utf8: "utf-8",
  "utf-16": "utf-16le",
  unicode: "utf-16le",
  "windows-1258": "windows-1258",
  cp1258: "windows-1258",
  "x-cp1258": "windows-1258",
  viscii: "viscii",
  "x-viscii": "viscii",
  tcvn: "tcvn",
  "x-viet-tcvn": "tcvn",
  vps: "vps",
  "x-viet-vps": "vps",
  "windows-1252": "windows-1252",
  cp1252: "windows-1252",
  "iso-8859-1": "iso-8859-1",
  latin1: "iso-8859-1",
  ascii: "ascii",
};

// Windows-1258 Vietnamese-specific character mappings (bytes that differ from Windows-1252)
// These bytes map to Vietnamese characters instead of Western European characters
export const WIN1258_VIETNAMESE_CHARS: Record<number, number> = {
  0xc3: 0x0102, // Ă (A breve)
  0xcc: 0x0300, // Combining grave accent (used with vowels)
  0xd0: 0x0110, // Đ (D stroke)
  0xd2: 0x0309, // Combining hook above
  0xd5: 0x01a0, // Ơ (O horn)
  0xdd: 0x01af, // Ư (U horn)
  0xe3: 0x0103, // ă (a breve)
  0xec: 0x0301, // Combining acute accent
  0xf0: 0x0111, // đ (d stroke)
  0xf2: 0x0323, // Combining dot below
  0xf5: 0x01a1, // ơ (o horn)
  0xfd: 0x01b0, // ư (u horn) - THIS IS THE KEY FIX
  0xfe: 0x20ab, // ₫ (Vietnamese dong sign)
};
