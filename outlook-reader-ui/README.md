# outlook-reader-ui

Headless React hooks and utilities for displaying parsed Outlook emails. Use with [outlook-email-parser](https://www.npmjs.com/package/outlook-email-parser).

## Features

- 🎣 **Headless Hooks** - All logic, no UI opinions
- 🎨 **Bring Your Own Styles** - Works with Tailwind, CSS-in-JS, or any styling solution
- 📦 **Tree-shakeable** - Import only what you need
- 🔧 **TypeScript** - Full type safety
- ⚡ **Lightweight** - No heavy dependencies

## Installation

```bash
npm install outlook-reader-ui outlook-email-parser
```

## Quick Start

### Email Viewer

```tsx
import { useEmailViewer } from 'outlook-reader-ui';
import { parseMsgBuffer } from 'outlook-email-parser';

function EmailViewer({ email }) {
  const {
    activeTab,
    setActiveTab,
    formattedHtml,
    senderInitials,
    senderName,
    attachments,
    downloadAttachment,
  } = useEmailViewer(email);

  return (
    <div className="email-viewer">
      {/* Header */}
      <h1>{email.subject}</h1>

      {/* Sender */}
      <div className="sender">
        <div className="avatar">{senderInitials}</div>
        <span>{senderName}</span>
      </div>

      {/* Attachments */}
      {attachments.map((att) => (
        <button key={att.filename} onClick={() => downloadAttachment(att)}>
          📎 {att.filename}
        </button>
      ))}

      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab('formatted')}>Formatted</button>
        <button onClick={() => setActiveTab('plain')}>Plain Text</button>
        <button onClick={() => setActiveTab('source')}>HTML Source</button>
      </div>

      {/* Content */}
      {activeTab === 'formatted' && (
        <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
      )}
    </div>
  );
}
```

### File Upload

```tsx
import { useFileUpload } from 'outlook-reader-ui';

function FileUploader({ onFile }) {
  const {
    getRootProps,
    getInputProps,
    isDragging,
    isLoading,
    error,
  } = useFileUpload({
    accept: '.msg,.eml',
    onFileSelect: onFile,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragging ? 'dragging' : ''}`}
    >
      <input {...getInputProps()} />
      {isLoading ? 'Processing...' : 'Drop email file here'}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### PST Viewer

```tsx
import { usePstViewer } from 'outlook-reader-ui';

function PstViewer({ data }) {
  const {
    messages,
    searchQuery,
    setSearchQuery,
    sortBy,
    selectedMessage,
    selectMessage,
  } = usePstViewer(data, { pageSize: 50 });

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search messages..."
      />

      <table>
        <thead>
          <tr>
            <th onClick={() => sortBy('subject')}>Subject</th>
            <th onClick={() => sortBy('from')}>From</th>
            <th onClick={() => sortBy('date')}>Date</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, i) => (
            <tr key={i} onClick={() => selectMessage(i)}>
              <td>{msg.subject}</td>
              <td>{msg.from}</td>
              <td>{msg.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## API Reference

### Hooks

#### `useEmailViewer(email, options?)`

Headless hook for email viewer logic.

**Returns:**
- `activeTab` / `setActiveTab` - Tab state management
- `formattedHtml` - Processed HTML with CID images replaced
- `plainText` / `htmlSource` - Raw content
- `senderInitials` / `senderName` / `senderEmail` - Sender info
- `attachments` / `downloadAttachment` - Attachment handling
- `copyContent` / `print` - Actions

#### `useFileUpload(options?)`

Headless hook for file upload with drag & drop.

**Options:**
- `accept` - Accepted file extensions (default: `.msg,.oft,.eml`)
- `maxSize` - Max file size in bytes (default: 50MB)
- `onFileSelect` - Callback when file is selected
- `onError` - Callback on error

**Returns:**
- `getRootProps()` - Props to spread on container
- `getInputProps()` - Props to spread on input
- `isDragging` / `isLoading` / `error` - State

#### `usePstViewer(data, options?)`

Headless hook for PST archive viewer.

**Options:**
- `pageSize` - Messages per page (0 = no pagination)
- `defaultSortField` - Initial sort field
- `defaultSortOrder` - Initial sort order

**Returns:**
- `messages` - Current page of messages
- `searchQuery` / `setSearchQuery` - Search state
- `sortBy` / `sortField` / `sortOrder` - Sorting
- `currentPage` / `nextPage` / `prevPage` - Pagination
- `selectedMessage` / `selectMessage` - Selection

### Utilities

```typescript
import {
  formatFileSize,    // (bytes) => "1.5 MB"
  formatDate,        // (dateString) => "Jan 1, 2024"
  getInitials,       // (name, email) => "JD"
  cleanupHtml,       // Clean HTML for display
  textToFormattedHtml, // Convert plain text to HTML
  replaceCidUrls,    // Replace cid: URLs with data URIs
} from 'outlook-reader-ui';
```

### Types

```typescript
import type {
  ParsedEmail,
  EmailAddress,
  EmailAttachment,
  PstMessageSummary,
  PstData,
  EmailViewTab,
  FileUploadState,
} from 'outlook-reader-ui';
```

## License

MIT
