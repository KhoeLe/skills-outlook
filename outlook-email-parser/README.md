# outlook-email-parser

Parse Microsoft Outlook email files (MSG, EML, OFT) with full support for attachments, embedded images, and various character encodings.

## Features

- 📧 Parse MSG files (Microsoft Outlook Message format)
- 📨 Parse EML files (Standard email format)
- 📎 Extract attachments with content
- 🖼️ Support for embedded images (CID references)
- 🌍 Multi-language support (Vietnamese, Chinese, Japanese, etc.)
- 📝 Extract both HTML and plain text content
- 🔧 Zero external binary dependencies

## Installation

```bash
npm install outlook-email-parser
# or
yarn add outlook-email-parser
# or
pnpm add outlook-email-parser
```

## Usage

### Basic Usage

```typescript
import { parseEmail } from 'outlook-email-parser';
import { readFileSync } from 'fs';

// Parse any supported email file
const buffer = readFileSync('email.msg');
const result = await parseEmail(buffer, 'email.msg');

console.log(result.data.subject);
console.log(result.data.from);
console.log(result.data.to);
console.log(result.data.htmlContent);
console.log(result.data.attachments);
```

### Parse MSG Files

```typescript
import { parseMsgBuffer } from 'outlook-email-parser';
import { readFileSync } from 'fs';

const buffer = readFileSync('message.msg');
const email = parseMsgBuffer(buffer);

console.log(email.subject);
console.log(email.from.name, email.from.email);
console.log(email.textContent);
```

### Parse EML Files

```typescript
import { parseEmlBuffer } from 'outlook-email-parser';
import { readFileSync } from 'fs';

const buffer = readFileSync('message.eml');
const email = await parseEmlBuffer(buffer);

console.log(email.subject);
console.log(email.htmlContent);
```

### Working with Attachments

```typescript
import { parseEmail } from 'outlook-email-parser';
import { readFileSync, writeFileSync } from 'fs';

const buffer = readFileSync('email.msg');
const result = await parseEmail(buffer, 'email.msg');

for (const attachment of result.data.attachments) {
  console.log(`Attachment: ${attachment.filename} (${attachment.size} bytes)`);
  
  // Save attachment to disk
  if (attachment.content) {
    const data = Buffer.from(attachment.content, 'base64');
    writeFileSync(attachment.filename, data);
  }
}
```

### Parser Options

```typescript
import { parseEmail } from 'outlook-email-parser';

const result = await parseEmail(buffer, 'email.msg', {
  // Include attachment content (base64). Default: true
  includeAttachmentContent: true,
  
  // Maximum attachment size to include content (bytes). Default: 10MB
  maxAttachmentSize: 10 * 1024 * 1024,
});
```

## API Reference

### `parseEmail(buffer, fileName, options?)`

Parse an email file with automatic format detection.

- `buffer`: `Buffer` - The file content
- `fileName`: `string` - The filename (used for format detection)
- `options`: `ParserOptions` - Optional parser configuration

Returns: `Promise<ParseResult>`

### `parseMsgBuffer(buffer, options?)`

Parse an MSG file buffer.

- `buffer`: `Buffer` - The MSG file content
- `options`: `ParserOptions` - Optional parser configuration

Returns: `ParsedEmail`

### `parseEmlBuffer(buffer, options?)`

Parse an EML file buffer.

- `buffer`: `Buffer` - The EML file content
- `options`: `ParserOptions` - Optional parser configuration

Returns: `Promise<ParsedEmail>`

### `isValidMsgFile(buffer)`

Check if a buffer is a valid MSG file.

Returns: `boolean`

### `isValidEmlFile(buffer)`

Check if a buffer looks like a valid EML file.

Returns: `boolean`

## Types

```typescript
interface ParsedEmail {
  subject: string;
  from: EmailAddress;
  to?: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  sentDate?: string;
  receivedDate?: string;
  priority?: number;
  importance?: number;
  textContent?: string;
  htmlContent?: string;
  attachments: EmailAttachment[];
}

interface EmailAddress {
  name?: string;
  email?: string;
}

interface EmailAttachment {
  filename: string;
  size: number;
  contentId?: string;
  content?: string; // base64 encoded
  mimeType?: string;
}

interface ParserOptions {
  includeAttachmentContent?: boolean;
  maxAttachmentSize?: number;
}
```

## Supported Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| MSG | `.msg` | Microsoft Outlook Message |
| OFT | `.oft` | Microsoft Outlook Template |
| EML | `.eml` | Standard email format (RFC 822) |

## Character Encoding Support

The parser automatically detects and handles various character encodings:

- UTF-8
- UTF-16LE/BE
- Windows-1252 (Western European)
- Windows-1258 (Vietnamese)
- ISO-8859-1 (Latin-1)
- And many more via iconv-lite

## License

MIT
