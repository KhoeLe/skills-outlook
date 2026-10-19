/**
 * MCP Prompts - Pre-built prompts for common AI agent tasks
 * These help AI agents accomplish tasks more effectively
 */

import type { Prompt } from "@modelcontextprotocol/sdk/types.js";

export const PROMPTS: Prompt[] = [
  {
    name: "build-email-viewer",
    description: "Generate a complete React component for viewing Outlook emails with file upload",
    arguments: [
      {
        name: "framework",
        description: "React framework: 'nextjs', 'vite', or 'cra'",
        required: false,
      },
      {
        name: "styling",
        description: "Styling approach: 'tailwind', 'css-modules', or 'styled-components'",
        required: false,
      },
      {
        name: "features",
        description: "Comma-separated features: 'dark-mode', 'attachments', 'search', 'print'",
        required: false,
      },
    ],
  },
  {
    name: "build-email-api",
    description: "Generate a backend API endpoint for parsing uploaded email files",
    arguments: [
      {
        name: "framework",
        description: "Backend framework: 'nextjs-api', 'express', 'fastify', or 'hono'",
        required: false,
      },
      {
        name: "validation",
        description: "Include file validation: 'true' or 'false'",
        required: false,
      },
    ],
  },
  {
    name: "parse-email-batch",
    description: "Generate code to parse multiple email files from a directory",
    arguments: [
      {
        name: "output",
        description: "Output format: 'json', 'csv', or 'database'",
        required: false,
      },
    ],
  },
  {
    name: "extract-email-data",
    description: "Generate code to extract specific data from emails (contacts, dates, attachments)",
    arguments: [
      {
        name: "extract",
        description: "What to extract: 'contacts', 'attachments', 'links', 'dates', or 'all'",
        required: true,
      },
    ],
  },
  {
    name: "troubleshoot-parsing",
    description: "Help diagnose and fix email parsing issues",
    arguments: [
      {
        name: "error",
        description: "The error message or issue description",
        required: true,
      },
      {
        name: "fileType",
        description: "File type: 'msg', 'eml', or 'unknown'",
        required: false,
      },
    ],
  },
];

export function getPromptContent(name: string, args: Record<string, string>): string {
  switch (name) {
    case "build-email-viewer":
      return buildEmailViewerPrompt(args);
    case "build-email-api":
      return buildEmailApiPrompt(args);
    case "parse-email-batch":
      return parseBatchPrompt(args);
    case "extract-email-data":
      return extractDataPrompt(args);
    case "troubleshoot-parsing":
      return troubleshootPrompt(args);
    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
}

function buildEmailViewerPrompt(args: Record<string, string>): string {
  const framework = args.framework || "nextjs";
  const styling = args.styling || "tailwind";
  const features = args.features?.split(",").map((f) => f.trim()) || ["attachments"];

  return `Build a complete email viewer application with these specifications:

## Requirements
- Framework: ${framework}
- Styling: ${styling}
- Features: ${features.join(", ")}

## Packages to Use
\`\`\`bash
npm install outlook-email-parser outlook-reader-ui
\`\`\`

## Implementation Guide

### 1. File Upload Component
Use the \`useFileUpload\` hook from outlook-reader-ui:
\`\`\`tsx
import { useFileUpload } from 'outlook-reader-ui';

const { getRootProps, getInputProps, isDragging } = useFileUpload({
  onFileSelect: async (file) => {
    // Parse the file
  },
  accept: '.msg,.eml,.oft',
});
\`\`\`

### 2. Email Parsing
\`\`\`tsx
import { parseEmail } from 'outlook-email-parser';

const buffer = Buffer.from(await file.arrayBuffer());
const result = await parseEmail(buffer, file.name);
// result.data contains: subject, from, to, htmlContent, attachments, etc.
\`\`\`

### 3. Email Display
Use the \`useEmailViewer\` hook:
\`\`\`tsx
import { useEmailViewer } from 'outlook-reader-ui';

const {
  formattedHtml,      // Sanitized HTML with embedded images
  senderInitials,     // For avatar display
  regularAttachments, // Non-embedded attachments
  downloadAttachment, // Download handler
} = useEmailViewer(email);
\`\`\`

${features.includes("dark-mode") ? `
### 4. Dark Mode
Add theme toggle using CSS variables or your styling solution's theming.
` : ""}

${features.includes("search") ? `
### 4. Search
Implement search across subject, sender, and content fields.
` : ""}

${features.includes("print") ? `
### 4. Print Support
Add print styles and a print button using window.print().
` : ""}

## Key Types
\`\`\`typescript
interface ParsedEmail {
  subject: string;
  from: { name?: string; email?: string };
  to?: string;
  htmlContent?: string;
  textContent?: string;
  attachments: Array<{
    filename: string;
    size: number;
    content?: string; // base64
    mimeType?: string;
  }>;
}
\`\`\`

Generate the complete implementation following these patterns.`;
}

function buildEmailApiPrompt(args: Record<string, string>): string {
  const framework = args.framework || "nextjs-api";
  const validation = args.validation !== "false";

  const examples: Record<string, string> = {
    "nextjs-api": `// app/api/parse-email/route.ts
import { parseEmail, isValidMsgFile, isValidEmlFile } from 'outlook-email-parser';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    ${validation ? `
    // Validate file format
    if (!isValidMsgFile(buffer) && !isValidEmlFile(buffer)) {
      return NextResponse.json({ error: 'Invalid email file format' }, { status: 400 });
    }
    ` : ""}
    const result = await parseEmail(buffer, file.name);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      fileType: result.type,
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Parse failed' 
    }, { status: 500 });
  }
}`,
    express: `// routes/email.ts
import express from 'express';
import multer from 'multer';
import { parseEmail, isValidMsgFile, isValidEmlFile } from 'outlook-email-parser';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/parse', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    ${validation ? `
    if (!isValidMsgFile(req.file.buffer) && !isValidEmlFile(req.file.buffer)) {
      return res.status(400).json({ error: 'Invalid email file format' });
    }
    ` : ""}
    const result = await parseEmail(req.file.buffer, req.file.originalname);
    res.json({ success: true, data: result.data, fileType: result.type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;`,
  };

  return `Build an API endpoint for parsing email files.

## Framework: ${framework}
## Validation: ${validation ? "Enabled" : "Disabled"}

## Install Dependencies
\`\`\`bash
npm install outlook-email-parser
${framework === "express" ? "npm install multer @types/multer" : ""}
\`\`\`

## Implementation
\`\`\`typescript
${examples[framework] || examples["nextjs-api"]}
\`\`\`

## Client Usage
\`\`\`typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/parse-email', {
  method: 'POST',
  body: formData,
});

const { data } = await response.json();
console.log(data.subject, data.from, data.attachments);
\`\`\``;
}

function parseBatchPrompt(args: Record<string, string>): string {
  const output = args.output || "json";

  return `Generate code to batch process multiple email files.

## Output Format: ${output}

\`\`\`typescript
import { parseEmail } from 'outlook-email-parser';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

interface EmailSummary {
  filename: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  attachmentCount: number;
}

async function processEmailDirectory(dirPath: string): Promise<EmailSummary[]> {
  const files = await readdir(dirPath);
  const emailFiles = files.filter(f => 
    ['.msg', '.eml', '.oft'].includes(extname(f).toLowerCase())
  );
  
  const results: EmailSummary[] = [];
  
  for (const file of emailFiles) {
    try {
      const buffer = await readFile(join(dirPath, file));
      const result = await parseEmail(buffer, file);
      
      results.push({
        filename: file,
        subject: result.data.subject,
        from: result.data.from.email || result.data.from.name || '',
        to: result.data.to || '',
        date: result.data.sentDate || '',
        attachmentCount: result.data.attachments.length,
      });
    } catch (error) {
      console.error(\`Failed to parse \${file}:\`, error);
    }
  }
  
  return results;
}

// Usage
const emails = await processEmailDirectory('./emails');
${output === "json" ? `await writeFile('output.json', JSON.stringify(emails, null, 2));` : ""}
${output === "csv" ? `
const csv = [
  'filename,subject,from,to,date,attachments',
  ...emails.map(e => \`"\${e.filename}","\${e.subject}","\${e.from}","\${e.to}","\${e.date}",\${e.attachmentCount}\`)
].join('\\n');
await writeFile('output.csv', csv);` : ""}
\`\`\``;
}

function extractDataPrompt(args: Record<string, string>): string {
  const extract = args.extract || "all";

  const extractors: Record<string, string> = {
    contacts: `
// Extract all email addresses from emails
function extractContacts(emails: ParsedEmail[]): Set<string> {
  const contacts = new Set<string>();
  
  for (const email of emails) {
    if (email.from.email) contacts.add(email.from.email);
    
    // Parse comma-separated recipients
    [email.to, email.cc, email.bcc].forEach(field => {
      if (field) {
        field.split(',').forEach(addr => {
          const match = addr.match(/[\\w.-]+@[\\w.-]+/);
          if (match) contacts.add(match[0].toLowerCase());
        });
      }
    });
  }
  
  return contacts;
}`,
    attachments: `
// Extract and save all attachments
async function extractAttachments(email: ParsedEmail, outputDir: string) {
  for (const att of email.attachments) {
    if (att.content && !att.contentId) { // Skip embedded images
      const buffer = Buffer.from(att.content, 'base64');
      await writeFile(join(outputDir, att.filename), buffer);
      console.log(\`Saved: \${att.filename} (\${att.size} bytes)\`);
    }
  }
}`,
    links: `
// Extract all URLs from email content
function extractLinks(email: ParsedEmail): string[] {
  const content = email.htmlContent || email.textContent || '';
  const urlRegex = /https?:\\/\\/[^\\s<>"']+/gi;
  return [...new Set(content.match(urlRegex) || [])];
}`,
    dates: `
// Extract and parse dates
function extractDates(email: ParsedEmail) {
  return {
    sent: email.sentDate ? new Date(email.sentDate) : null,
    received: email.receivedDate ? new Date(email.receivedDate) : null,
  };
}`,
  };

  return `Generate code to extract ${extract} from parsed emails.

\`\`\`typescript
import { parseEmail, type ParsedEmail } from 'outlook-email-parser';
import { writeFile } from 'fs/promises';
import { join } from 'path';

${extract === "all" ? Object.values(extractors).join("\n") : extractors[extract] || extractors.contacts}
\`\`\``;
}

function troubleshootPrompt(args: Record<string, string>): string {
  const error = args.error || "Unknown error";
  const fileType = args.fileType || "unknown";

  return `# Troubleshooting Email Parsing

## Reported Issue
**Error:** ${error}
**File Type:** ${fileType}

## Common Issues & Solutions

### 1. "Cannot determine file type"
**Cause:** File extension doesn't match content or file is corrupted.
**Solution:**
\`\`\`typescript
import { isValidMsgFile, isValidEmlFile } from 'outlook-email-parser';

// Check actual format regardless of extension
if (isValidMsgFile(buffer)) {
  console.log('This is an MSG file');
} else if (isValidEmlFile(buffer)) {
  console.log('This is an EML file');
} else {
  console.log('Not a valid email file');
}
\`\`\`

### 2. "Unsupported file type"
**Cause:** File is not MSG, EML, or OFT format.
**Solution:** Only these formats are supported. PST files require different tools.

### 3. Garbled/Corrupted Text
**Cause:** Character encoding issues, common with non-English emails.
**Solution:** The parser handles most encodings automatically. If issues persist:
\`\`\`typescript
// Check if content exists
console.log('Has HTML:', !!result.data.htmlContent);
console.log('Has Text:', !!result.data.textContent);

// HTML content usually preserves encoding better
const content = result.data.htmlContent || result.data.textContent;
\`\`\`

### 4. Missing Attachments
**Cause:** Attachments too large or content not included.
**Solution:**
\`\`\`typescript
const result = await parseEmail(buffer, filename, {
  includeAttachmentContent: true,
  maxAttachmentSize: 50 * 1024 * 1024, // Increase to 50MB
});
\`\`\`

### 5. Embedded Images Not Showing
**Cause:** CID URLs not replaced with data URIs.
**Solution:** Use outlook-reader-ui utilities:
\`\`\`typescript
import { replaceCidUrls } from 'outlook-reader-ui';

const { html } = replaceCidUrls(email.htmlContent, email.attachments);
// Now embedded images will display correctly
\`\`\`

### 6. Memory Issues with Large Files
**Solution:**
\`\`\`typescript
// Don't include attachment content for large files
const result = await parseEmail(buffer, filename, {
  includeAttachmentContent: false,
});

// Then fetch attachments separately if needed
\`\`\`

## Debug Checklist
1. Verify file is not corrupted (can open in Outlook?)
2. Check file size (very large files may need streaming)
3. Confirm file extension matches actual format
4. Try parsing with minimal options first
5. Check Node.js version (requires >= 18)`;
}
