/**
 * MCP Resources - Documentation for AI agents to learn how to use the packages
 */

import type { Resource } from "@modelcontextprotocol/sdk/types.js";

export const RESOURCES: Resource[] = [
  {
    uri: "outlook://docs/outlook-email-parser",
    name: "outlook-email-parser Documentation",
    description: "Complete guide to parsing MSG, EML, OFT email files with examples",
    mimeType: "text/markdown",
  },
  {
    uri: "outlook://docs/outlook-reader-ui",
    name: "outlook-reader-ui Documentation",
    description: "React hooks and components for displaying parsed emails",
    mimeType: "text/markdown",
  },
  {
    uri: "outlook://docs/quick-start",
    name: "Quick Start Guide",
    description: "Complete example app parsing and displaying Outlook emails",
    mimeType: "text/markdown",
  },
  {
    uri: "outlook://types/all",
    name: "TypeScript Types",
    description: "All TypeScript interfaces and types for both packages",
    mimeType: "text/markdown",
  },
  {
    uri: "outlook://patterns/nextjs",
    name: "Next.js Integration Pattern",
    description: "Best practices for using outlook packages in Next.js apps",
    mimeType: "text/markdown",
  },
  {
    uri: "outlook://patterns/error-handling",
    name: "Error Handling Patterns",
    description: "Robust error handling for email parsing",
    mimeType: "text/markdown",
  },
  {
    uri: "outlook://patterns/performance",
    name: "Performance Optimization",
    description: "Tips for handling large files and batch processing",
    mimeType: "text/markdown",
  },
  {
    uri: "outlook://examples/complete-app",
    name: "Complete Application Example",
    description: "Full-featured email viewer application code",
    mimeType: "text/markdown",
  },
];

export function getResourceContent(uri: string): string {
  switch (uri) {
    case "outlook://docs/outlook-email-parser":
      return OUTLOOK_PARSER_DOCS;
    case "outlook://docs/outlook-reader-ui":
      return OUTLOOK_READER_UI_DOCS;
    case "outlook://docs/quick-start":
      return QUICK_START_DOCS;
    case "outlook://types/all":
      return ALL_TYPES_DOCS;
    case "outlook://types/parsed-email":
      return ALL_TYPES_DOCS; // Alias for backward compatibility
    case "outlook://patterns/nextjs":
      return NEXTJS_PATTERN;
    case "outlook://patterns/error-handling":
      return ERROR_HANDLING_PATTERN;
    case "outlook://patterns/performance":
      return PERFORMANCE_PATTERN;
    case "outlook://examples/complete-app":
      return COMPLETE_APP_EXAMPLE;
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
}

const OUTLOOK_PARSER_DOCS = `# outlook-email-parser

Parse Microsoft Outlook email files (MSG, EML, OFT) with full support for attachments, embedded images, and various character encodings.

## Installation

\`\`\`bash
npm install outlook-email-parser
\`\`\`

## Basic Usage

\`\`\`typescript
import { parseEmail } from 'outlook-email-parser';
import { readFileSync } from 'fs';

// Parse any supported email file (auto-detects format)
const buffer = readFileSync('email.msg');
const result = await parseEmail(buffer, 'email.msg');

console.log(result.data.subject);
console.log(result.data.from);        // { name: "John", email: "john@example.com" }
console.log(result.data.to);          // "recipient@example.com"
console.log(result.data.htmlContent); // HTML body
console.log(result.data.textContent); // Plain text body
console.log(result.data.attachments); // Array of attachments
\`\`\`

## Parse Specific Formats

\`\`\`typescript
import { parseMsgBuffer, parseEmlBuffer } from 'outlook-email-parser';

// MSG files (synchronous)
const msgEmail = parseMsgBuffer(buffer);

// EML files (async)
const emlEmail = await parseEmlBuffer(buffer);
\`\`\`

## Working with Attachments

\`\`\`typescript
const result = await parseEmail(buffer, 'email.msg');

for (const attachment of result.data.attachments) {
  console.log(attachment.filename);  // "document.pdf"
  console.log(attachment.size);      // 12345 (bytes)
  console.log(attachment.mimeType);  // "application/pdf"
  console.log(attachment.contentId); // For embedded images (cid:)
  
  // Save attachment
  if (attachment.content) {
    const data = Buffer.from(attachment.content, 'base64');
    writeFileSync(attachment.filename, data);
  }
}
\`\`\`

## Parser Options

\`\`\`typescript
const result = await parseEmail(buffer, 'email.msg', {
  includeAttachmentContent: true,      // Include base64 content (default: true)
  maxAttachmentSize: 10 * 1024 * 1024, // Max size to include (default: 10MB)
});
\`\`\`

## Validation

\`\`\`typescript
import { isValidMsgFile, isValidEmlFile } from 'outlook-email-parser';

if (isValidMsgFile(buffer)) {
  // It's a valid MSG file
}

if (isValidEmlFile(buffer)) {
  // It's a valid EML file
}
\`\`\`

## Supported Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| MSG | .msg | Microsoft Outlook Message |
| OFT | .oft | Microsoft Outlook Template |
| EML | .eml | Standard email format (RFC 822) |
`;

const OUTLOOK_READER_UI_DOCS = `# outlook-reader-ui

Headless React hooks and utilities for displaying parsed Outlook emails. Works with outlook-email-parser.

## Installation

\`\`\`bash
npm install outlook-reader-ui outlook-email-parser
\`\`\`

## Headless Hooks (Recommended)

### useEmailViewer

\`\`\`tsx
import { useEmailViewer } from 'outlook-reader-ui';
import type { ParsedEmail } from 'outlook-reader-ui';

function MyEmailViewer({ email }: { email: ParsedEmail }) {
  const {
    formattedHtml,      // Cleaned HTML content with CID URLs replaced
    senderInitials,     // "JD" for "John Doe"
    activeTab,          // "formatted" | "plain" | "source"
    setActiveTab,
    downloadAttachment, // (attachment) => void
    inlineAttachments,  // Embedded images
    regularAttachments, // Non-embedded attachments
  } = useEmailViewer(email);

  return (
    <div>
      <div className="avatar">{senderInitials}</div>
      <h1>{email.subject}</h1>
      <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
      
      {regularAttachments.map(att => (
        <button key={att.filename} onClick={() => downloadAttachment(att)}>
          Download {att.filename}
        </button>
      ))}
    </div>
  );
}
\`\`\`

### useFileUpload

\`\`\`tsx
import { useFileUpload } from 'outlook-reader-ui';

function MyUploader() {
  const {
    getRootProps,   // Spread on container div
    getInputProps,  // Spread on input element
    isDragging,     // true when file is dragged over
    isLoading,      // true during processing
    error,          // Error message if any
  } = useFileUpload({
    onFileSelect: async (file) => {
      // Handle the selected file
      const buffer = await file.arrayBuffer();
      // Parse with outlook-email-parser...
    },
    accept: '.msg,.eml,.oft',
  });

  return (
    <div {...getRootProps()} className={isDragging ? 'drag-active' : ''}>
      <input {...getInputProps()} />
      <p>Drop email files here or click to select</p>
    </div>
  );
}
\`\`\`

### usePstViewer

\`\`\`tsx
import { usePstViewer } from 'outlook-reader-ui';

function PstBrowser({ pstData }) {
  const {
    messages,           // Current page of messages
    searchQuery,        // Current search
    setSearchQuery,
    sortBy,             // Sort function
    currentPage,
    nextPage,
    prevPage,
    selectedMessage,
    selectMessage,
  } = usePstViewer(pstData, {
    pageSize: 20,
    defaultSortField: 'date',
    defaultSortOrder: 'desc',
  });

  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={e => setSearchQuery(e.target.value)} 
      />
      {messages.map(msg => (
        <div key={msg.subject} onClick={() => selectMessage(msg)}>
          {msg.subject}
        </div>
      ))}
    </div>
  );
}
\`\`\`

## Styled Components (Legacy)

Pre-styled components if you don't need customization:

\`\`\`tsx
import { EmailViewer, FileUpload } from 'outlook-reader-ui';
import 'outlook-reader-ui/styles.css';

<EmailViewer 
  email={parsedEmail} 
  theme="light"  // or "dark"
  fileName="message.msg"
/>

<FileUpload 
  onFileSelect={handleFile}
  accept=".msg,.eml,.oft"
  theme="light"
/>
\`\`\`

## Utility Functions

\`\`\`typescript
import {
  formatFileSize,      // (1024) => "1.0 KB"
  formatDate,          // (isoString) => "Jan 1, 2024"
  getInitials,         // ("John Doe") => "JD"
  cleanupHtml,         // Remove scripts, sanitize HTML
  textToFormattedHtml, // Convert plain text to HTML
  replaceCidUrls,      // Replace cid: URLs with data URIs
} from 'outlook-reader-ui';
\`\`\`
`;

const QUICK_START_DOCS = `# Quick Start: Parse and Display Outlook Emails

Complete example of a React app that parses and displays Outlook emails.

## 1. Install Dependencies

\`\`\`bash
npm install outlook-email-parser outlook-reader-ui
\`\`\`

## 2. Create the App

\`\`\`tsx
import { useState } from 'react';
import { parseEmail } from 'outlook-email-parser';
import { useEmailViewer, useFileUpload, type ParsedEmail } from 'outlook-reader-ui';

function App() {
  const [email, setEmail] = useState<ParsedEmail | null>(null);

  // File upload hook
  const { getRootProps, getInputProps, isDragging, isLoading } = useFileUpload({
    onFileSelect: async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await parseEmail(buffer, file.name);
      setEmail(result.data);
    },
  });

  if (!email) {
    return (
      <div {...getRootProps()} style={{
        border: '2px dashed #ccc',
        padding: '40px',
        textAlign: 'center',
        background: isDragging ? '#f0f0f0' : 'white',
      }}>
        <input {...getInputProps()} />
        {isLoading ? 'Parsing...' : 'Drop .msg or .eml file here'}
      </div>
    );
  }

  return <EmailDisplay email={email} onBack={() => setEmail(null)} />;
}

function EmailDisplay({ email, onBack }: { email: ParsedEmail; onBack: () => void }) {
  const {
    formattedHtml,
    senderInitials,
    regularAttachments,
    downloadAttachment,
  } = useEmailViewer(email);

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: '#007bff', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {senderInitials}
        </div>
        <div>
          <strong>{email.from.name || email.from.email}</strong>
          <div style={{ fontSize: '0.9em', color: '#666' }}>{email.subject}</div>
        </div>
      </header>

      <div 
        dangerouslySetInnerHTML={{ __html: formattedHtml }} 
        style={{ marginTop: '20px' }}
      />

      {regularAttachments.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Attachments</h3>
          {regularAttachments.map(att => (
            <button key={att.filename} onClick={() => downloadAttachment(att)}>
              📎 {att.filename}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
\`\`\`

## 3. For Next.js / Server Components

If using Next.js with server components, parse on the server:

\`\`\`tsx
// app/api/parse-email/route.ts
import { parseEmail } from 'outlook-email-parser';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await parseEmail(buffer, file.name);
  
  return NextResponse.json(result.data);
}
\`\`\`

\`\`\`tsx
// Client component
'use client';
import { useFileUpload } from 'outlook-reader-ui';

function Uploader() {
  const { getRootProps, getInputProps } = useFileUpload({
    onFileSelect: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/parse-email', {
        method: 'POST',
        body: formData,
      });
      const email = await res.json();
      // Use the parsed email...
    },
  });
  
  return <div {...getRootProps()}><input {...getInputProps()} /></div>;
}
\`\`\`
`;

const ALL_TYPES_DOCS = `# TypeScript Types Reference

Complete type definitions for outlook-email-parser and outlook-reader-ui.

## Core Types (outlook-email-parser)

\`\`\`typescript
// Main parsed email structure
interface ParsedEmail {
  subject: string;
  from: EmailAddress;
  to?: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  sentDate?: string;      // ISO 8601 format
  receivedDate?: string;  // ISO 8601 format
  priority?: number;      // 1=High, 3=Normal, 5=Low
  importance?: number;
  textContent?: string;
  htmlContent?: string;
  attachments: EmailAttachment[];
}

interface EmailAddress {
  name?: string;   // "John Doe"
  email?: string;  // "john@example.com"
}

interface EmailAttachment {
  filename: string;
  size: number;        // bytes
  contentId?: string;  // For embedded images (cid:xxx)
  content?: string;    // Base64 encoded
  mimeType?: string;   // "application/pdf", "image/png", etc.
}

// Parse result wrapper
interface ParseResult {
  type: EmailFileType;
  fileName: string;
  data: ParsedEmail;
}

type EmailFileType = "msg" | "eml" | "pst" | "oft";

// Parser configuration
interface ParserOptions {
  includeAttachmentContent?: boolean;  // default: true
  maxAttachmentSize?: number;          // default: 10MB
  maxPstMessages?: number;             // default: 100
}
\`\`\`

## UI Types (outlook-reader-ui)

\`\`\`typescript
// File upload state machine
type FileUploadState = "idle" | "dragging" | "loading" | "error";

// Email view tabs
type EmailViewTab = "formatted" | "plain" | "source";

// PST viewer types
interface PstMessageSummary {
  subject: string;
  from: string;
  to: string;
  date: string;
  hasAttachments: boolean;
}

interface PstData {
  messageCount: number;
  messages: PstMessageSummary[];
  truncated: boolean;
}

// Hook return types
interface UseEmailViewerReturn {
  formattedHtml: string;
  senderInitials: string;
  activeTab: EmailViewTab;
  setActiveTab: (tab: EmailViewTab) => void;
  inlineAttachments: EmailAttachment[];
  regularAttachments: EmailAttachment[];
  downloadAttachment: (attachment: EmailAttachment) => void;
}

interface UseFileUploadReturn {
  getRootProps: () => React.HTMLAttributes<HTMLDivElement>;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  isDragging: boolean;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}
\`\`\`

## Import Examples

\`\`\`typescript
// From outlook-email-parser
import type { 
  ParsedEmail, 
  EmailAddress, 
  EmailAttachment,
  ParseResult,
  ParserOptions,
  EmailFileType 
} from 'outlook-email-parser';

// From outlook-reader-ui (same types, re-exported)
import type {
  ParsedEmail,
  EmailAddress,
  EmailAttachment,
  PstMessageSummary,
  PstData,
  EmailViewTab,
  FileUploadState,
} from 'outlook-reader-ui';
\`\`\`
`;

const NEXTJS_PATTERN = `# Next.js Integration Pattern

Best practices for integrating outlook packages in Next.js applications.

## Project Structure

\`\`\`
app/
├── api/
│   └── parse-email/
│       └── route.ts      # Server-side parsing
├── components/
│   ├── email-viewer.tsx  # Client component
│   └── file-upload.tsx   # Client component
└── page.tsx
\`\`\`

## Server-Side Parsing (Recommended)

Parse emails on the server to avoid shipping the parser to the client:

\`\`\`typescript
// app/api/parse-email/route.ts
import { parseEmail, isValidMsgFile, isValidEmlFile } from 'outlook-email-parser';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Required for Buffer support

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (e.g., 25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate file format
    if (!isValidMsgFile(buffer) && !isValidEmlFile(buffer)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload .msg or .eml files.' },
        { status: 400 }
      );
    }

    const result = await parseEmail(buffer, file.name, {
      includeAttachmentContent: true,
      maxAttachmentSize: 10 * 1024 * 1024,
    });

    return NextResponse.json({
      success: true,
      fileType: result.type,
      email: result.data,
    });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse email file' },
      { status: 500 }
    );
  }
}
\`\`\`

## Client Components

\`\`\`tsx
// app/components/file-upload.tsx
'use client';

import { useFileUpload } from 'outlook-reader-ui';
import type { ParsedEmail } from 'outlook-reader-ui';

interface Props {
  onEmailParsed: (email: ParsedEmail) => void;
}

export function FileUpload({ onEmailParsed }: Props) {
  const { getRootProps, getInputProps, isDragging, isLoading, error } = useFileUpload({
    onFileSelect: async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-email', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      const { email } = await res.json();
      onEmailParsed(email);
    },
    accept: '.msg,.eml,.oft',
  });

  return (
    <div
      {...getRootProps()}
      className={\`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        \${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        \${error ? 'border-red-500' : ''}
      \`}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <p>Parsing email...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Drop .msg or .eml file here, or click to select</p>
      )}
    </div>
  );
}
\`\`\`

\`\`\`tsx
// app/components/email-viewer.tsx
'use client';

import { useEmailViewer } from 'outlook-reader-ui';
import type { ParsedEmail } from 'outlook-reader-ui';

export function EmailViewer({ email }: { email: ParsedEmail }) {
  const {
    formattedHtml,
    senderInitials,
    regularAttachments,
    downloadAttachment,
  } = useEmailViewer(email);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center gap-4 p-4 border-b">
        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          {senderInitials}
        </div>
        <div>
          <h1 className="font-semibold">{email.subject}</h1>
          <p className="text-sm text-gray-600">
            From: {email.from.name || email.from.email}
          </p>
        </div>
      </header>

      <div
        className="p-4 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: formattedHtml }}
      />

      {regularAttachments.length > 0 && (
        <div className="p-4 border-t">
          <h2 className="font-semibold mb-2">Attachments</h2>
          <div className="flex flex-wrap gap-2">
            {regularAttachments.map((att) => (
              <button
                key={att.filename}
                onClick={() => downloadAttachment(att)}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                📎 {att.filename}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
\`\`\`

## Main Page

\`\`\`tsx
// app/page.tsx
'use client';

import { useState } from 'react';
import { FileUpload } from './components/file-upload';
import { EmailViewer } from './components/email-viewer';
import type { ParsedEmail } from 'outlook-reader-ui';

export default function Home() {
  const [email, setEmail] = useState<ParsedEmail | null>(null);

  return (
    <main className="min-h-screen p-8">
      {!email ? (
        <FileUpload onEmailParsed={setEmail} />
      ) : (
        <>
          <button
            onClick={() => setEmail(null)}
            className="mb-4 text-blue-500 hover:underline"
          >
            ← Upload another file
          </button>
          <EmailViewer email={email} />
        </>
      )}
    </main>
  );
}
\`\`\`
`;



const ERROR_HANDLING_PATTERN = `# Error Handling Patterns

Robust error handling for email parsing applications.

## Comprehensive Error Handler

\`\`\`typescript
import { parseEmail, isValidMsgFile, isValidEmlFile } from 'outlook-email-parser';

type ParseErrorCode = 
  | 'INVALID_FILE'
  | 'UNSUPPORTED_FORMAT'
  | 'FILE_TOO_LARGE'
  | 'PARSE_FAILED'
  | 'ENCODING_ERROR'
  | 'CORRUPTED_FILE';

class EmailParseError extends Error {
  constructor(
    public code: ParseErrorCode,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'EmailParseError';
  }
}

interface ParseOptions {
  maxFileSize?: number;
  includeAttachments?: boolean;
}

async function safeParseEmail(
  buffer: Buffer,
  fileName: string,
  options: ParseOptions = {}
) {
  const { maxFileSize = 25 * 1024 * 1024, includeAttachments = true } = options;

  // 1. Check file size
  if (buffer.length > maxFileSize) {
    throw new EmailParseError(
      'FILE_TOO_LARGE',
      \`File size (\${(buffer.length / 1024 / 1024).toFixed(1)}MB) exceeds limit (\${maxFileSize / 1024 / 1024}MB)\`
    );
  }

  // 2. Validate format
  const isMsgValid = isValidMsgFile(buffer);
  const isEmlValid = isValidEmlFile(buffer);

  if (!isMsgValid && !isEmlValid) {
    throw new EmailParseError(
      'UNSUPPORTED_FORMAT',
      'File is not a valid MSG or EML format'
    );
  }

  // 3. Parse with error handling
  try {
    const result = await parseEmail(buffer, fileName, {
      includeAttachmentContent: includeAttachments,
    });

    // 4. Validate result
    if (!result.data.subject && !result.data.from.email && !result.data.htmlContent) {
      throw new EmailParseError(
        'CORRUPTED_FILE',
        'Email file appears to be corrupted or empty'
      );
    }

    return result;
  } catch (error) {
    if (error instanceof EmailParseError) throw error;

    const message = error instanceof Error ? error.message : 'Unknown error';
    
    if (message.includes('encoding') || message.includes('charset')) {
      throw new EmailParseError('ENCODING_ERROR', 'Character encoding error', error as Error);
    }

    throw new EmailParseError('PARSE_FAILED', \`Failed to parse: \${message}\`, error as Error);
  }
}
\`\`\`

## React Error Boundary

\`\`\`tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class EmailErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="font-bold text-red-700">Failed to display email</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-blue-500 underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
\`\`\`

## User-Friendly Error Messages

\`\`\`typescript
function getUserFriendlyError(error: unknown): string {
  if (error instanceof EmailParseError) {
    const messages: Record<ParseErrorCode, string> = {
      INVALID_FILE: 'The file could not be read. Please try again.',
      UNSUPPORTED_FORMAT: 'Please upload a .msg or .eml file.',
      FILE_TOO_LARGE: 'The file is too large. Maximum size is 25MB.',
      PARSE_FAILED: 'Could not read the email. The file may be damaged.',
      ENCODING_ERROR: 'Could not read the email text. Try a different file.',
      CORRUPTED_FILE: 'The email file appears to be empty or damaged.',
    };
    return messages[error.code];
  }

  return 'An unexpected error occurred. Please try again.';
}
\`\`\`
`;

const PERFORMANCE_PATTERN = `# Performance Optimization

Tips for handling large files and batch processing efficiently.

## Lazy Loading Attachments

Don't load attachment content until needed:

\`\`\`typescript
// First pass: metadata only
const result = await parseEmail(buffer, fileName, {
  includeAttachmentContent: false,
});

// Display email immediately
displayEmail(result.data);

// Load attachments on demand
async function loadAttachment(email: ParsedEmail, index: number) {
  const fullResult = await parseEmail(buffer, fileName, {
    includeAttachmentContent: true,
  });
  return fullResult.data.attachments[index];
}
\`\`\`

## Batch Processing with Concurrency Control

\`\`\`typescript
import { parseEmail } from 'outlook-email-parser';
import pLimit from 'p-limit';

const limit = pLimit(5); // Max 5 concurrent parses

async function batchParse(files: Array<{ buffer: Buffer; name: string }>) {
  const results = await Promise.all(
    files.map(file =>
      limit(async () => {
        try {
          return await parseEmail(file.buffer, file.name);
        } catch (error) {
          return { error, fileName: file.name };
        }
      })
    )
  );

  return results;
}
\`\`\`

## Web Worker for Client-Side Parsing

\`\`\`typescript
// email-worker.ts
import { parseEmail } from 'outlook-email-parser';

self.onmessage = async (e: MessageEvent<{ buffer: ArrayBuffer; fileName: string }>) => {
  try {
    const buffer = Buffer.from(e.data.buffer);
    const result = await parseEmail(buffer, e.data.fileName);
    self.postMessage({ success: true, data: result.data });
  } catch (error) {
    self.postMessage({ success: false, error: (error as Error).message });
  }
};

// Usage in React
function useEmailWorker() {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(new URL('./email-worker.ts', import.meta.url));
    return () => workerRef.current?.terminate();
  }, []);

  const parse = useCallback((file: File): Promise<ParsedEmail> => {
    return new Promise(async (resolve, reject) => {
      const buffer = await file.arrayBuffer();
      
      workerRef.current!.onmessage = (e) => {
        if (e.data.success) resolve(e.data.data);
        else reject(new Error(e.data.error));
      };
      
      workerRef.current!.postMessage({ buffer, fileName: file.name }, [buffer]);
    });
  }, []);

  return { parse };
}
\`\`\`

## Memory Management

\`\`\`typescript
// Clear large data after use
function processEmail(email: ParsedEmail) {
  // Process content
  const summary = extractSummary(email);
  
  // Clear large fields if not needed
  email.htmlContent = undefined;
  email.textContent = undefined;
  email.attachments.forEach(a => { a.content = undefined; });
  
  return summary;
}

// Stream large files (Node.js)
import { createReadStream } from 'fs';

async function parseFromStream(filePath: string) {
  const chunks: Buffer[] = [];
  
  for await (const chunk of createReadStream(filePath)) {
    chunks.push(chunk as Buffer);
  }
  
  const buffer = Buffer.concat(chunks);
  return parseEmail(buffer, path.basename(filePath));
}
\`\`\`

## Caching Parsed Results

\`\`\`typescript
const emailCache = new Map<string, ParsedEmail>();

async function getCachedEmail(fileHash: string, buffer: Buffer, fileName: string) {
  if (emailCache.has(fileHash)) {
    return emailCache.get(fileHash)!;
  }

  const result = await parseEmail(buffer, fileName);
  emailCache.set(fileHash, result.data);
  
  // Limit cache size
  if (emailCache.size > 100) {
    const firstKey = emailCache.keys().next().value;
    emailCache.delete(firstKey);
  }

  return result.data;
}
\`\`\`
`;


const COMPLETE_APP_EXAMPLE = `# Complete Email Viewer Application

A production-ready email viewer with all features.

## Features
- Drag & drop file upload
- Email parsing with error handling
- Responsive email display
- Attachment downloads
- Dark mode support
- Loading states

## Full Implementation

\`\`\`tsx
// app/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { useFileUpload, useEmailViewer, formatFileSize, formatDate } from 'outlook-reader-ui';
import type { ParsedEmail } from 'outlook-reader-ui';

export default function EmailViewerApp() {
  const [email, setEmail] = useState<ParsedEmail | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);

  const handleFileParsed = useCallback((data: ParsedEmail, name: string) => {
    setEmail(data);
    setFileName(name);
  }, []);

  return (
    <div className={\`min-h-screen \${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}\`}>
      <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold dark:text-white">Email Viewer</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        {!email ? (
          <UploadSection onFileParsed={handleFileParsed} />
        ) : (
          <EmailDisplay
            email={email}
            fileName={fileName}
            onClose={() => setEmail(null)}
          />
        )}
      </main>
    </div>
  );
}

function UploadSection({ onFileParsed }: { 
  onFileParsed: (email: ParsedEmail, fileName: string) => void 
}) {
  const { getRootProps, getInputProps, isDragging, isLoading, error } = useFileUpload({
    onFileSelect: async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-email', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to parse email');
      }

      const { email } = await res.json();
      onFileParsed(email, file.name);
    },
    accept: '.msg,.eml,.oft',
  });

  return (
    <div
      {...getRootProps()}
      className={\`
        mt-8 p-12 border-2 border-dashed rounded-xl text-center cursor-pointer
        transition-all duration-200 ease-in-out
        \${isDragging 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
        }
        \${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
      \`}
    >
      <input {...getInputProps()} />
      
      <div className="text-6xl mb-4">
        {isLoading ? '⏳' : error ? '❌' : '📧'}
      </div>
      
      {isLoading ? (
        <p className="text-lg dark:text-gray-300">Parsing email...</p>
      ) : error ? (
        <div>
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Click to try again</p>
        </div>
      ) : (
        <div>
          <p className="text-lg font-medium dark:text-white">
            Drop your email file here
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Supports .msg, .eml, and .oft files
          </p>
        </div>
      )}
    </div>
  );
}

function EmailDisplay({ 
  email, 
  fileName, 
  onClose 
}: { 
  email: ParsedEmail; 
  fileName: string;
  onClose: () => void;
}) {
  const {
    formattedHtml,
    senderInitials,
    activeTab,
    setActiveTab,
    regularAttachments,
    downloadAttachment,
  } = useEmailViewer(email);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <button
          onClick={onClose}
          className="text-blue-500 hover:underline mb-4 flex items-center gap-1"
        >
          ← Back to upload
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                          text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {senderInitials}
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold dark:text-white truncate">
              {email.subject || '(No subject)'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              From: {email.from.name || email.from.email || 'Unknown'}
              {email.from.email && email.from.name && (
                <span className="text-gray-400"> &lt;{email.from.email}&gt;</span>
              )}
            </p>
            {email.to && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                To: {email.to}
              </p>
            )}
            {email.sentDate && (
              <p className="text-sm text-gray-400">
                {formatDate(email.sentDate)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b dark:border-gray-700">
        {(['formatted', 'plain', 'source'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`
              px-4 py-2 font-medium capitalize transition-colors
              \${activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }
            \`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[60vh] overflow-auto">
        {activeTab === 'formatted' && (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />
        )}
        {activeTab === 'plain' && (
          <pre className="whitespace-pre-wrap font-mono text-sm dark:text-gray-300">
            {email.textContent || 'No plain text content'}
          </pre>
        )}
        {activeTab === 'source' && (
          <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-100 
                          dark:bg-gray-900 p-4 rounded overflow-auto">
            {email.htmlContent || email.textContent || 'No content'}
          </pre>
        )}
      </div>

      {/* Attachments */}
      {regularAttachments.length > 0 && (
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h3 className="font-medium mb-2 dark:text-white">
            Attachments ({regularAttachments.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {regularAttachments.map((att, i) => (
              <button
                key={i}
                onClick={() => downloadAttachment(att)}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 
                           rounded-lg border dark:border-gray-700 hover:bg-gray-100 
                           dark:hover:bg-gray-700 transition-colors"
              >
                <span>📎</span>
                <span className="dark:text-white">{att.filename}</span>
                <span className="text-xs text-gray-400">
                  {formatFileSize(att.size)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
\`\`\`

## API Route

\`\`\`typescript
// app/api/parse-email/route.ts
import { parseEmail, isValidMsgFile, isValidEmlFile } from 'outlook-email-parser';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!isValidMsgFile(buffer) && !isValidEmlFile(buffer)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload .msg or .eml files.' },
        { status: 400 }
      );
    }

    const result = await parseEmail(buffer, file.name);

    return NextResponse.json({
      success: true,
      email: result.data,
    });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse email. The file may be corrupted.' },
      { status: 500 }
    );
  }
}
\`\`\`
`;
