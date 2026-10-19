# Outlook MCP Server

A comprehensive MCP (Model Context Protocol) server that enables AI agents to:

1. **Parse emails** - Execute parsing of MSG, EML, OFT files
2. **Learn the packages** - Access documentation for `outlook-email-parser` and `outlook-reader-ui`
3. **Generate code** - Use pre-built prompts for common tasks
4. **Troubleshoot** - Get help diagnosing parsing issues

## Features

- 📧 Parse MSG, EML, and OFT email files
- 📚 Rich documentation resources for AI learning
- 🎯 Pre-built prompts for common development tasks
- 🔧 Error handling and troubleshooting guides
- ⚡ Performance optimization patterns
- 🤖 Typed SDK client for programmatic access

## Installation

```bash
npm install outlook-mcp-server
```

## Configuration

Add to your MCP configuration (`mcp.json`):

```json
{
  "mcpServers": {
    "outlook": {
      "command": "npx",
      "args": ["outlook-mcp-server"]
    }
  }
}
```

Or use local path during development:

```json
{
  "mcpServers": {
    "outlook": {
      "command": "node",
      "args": ["/path/to/packages/outlook-mcp-server/dist/index.js"]
    }
  }
}
```

## What AI Agents Get

### 🔧 Tools (Execute Actions)

| Tool | Description |
|------|-------------|
| `parse_email` | Parse email files and extract all content |
| `validate_email_file` | Check if file is valid MSG/EML format |
| `get_supported_formats` | List supported file formats |
| `extract_attachments` | Extract only attachments from email |
| `get_email_metadata` | Get headers without full content |
| `format_email_content` | Clean HTML for safe display |

### 📚 Resources (Documentation)

| Resource | Description |
|----------|-------------|
| `outlook://docs/outlook-email-parser` | Complete parsing guide |
| `outlook://docs/outlook-reader-ui` | React hooks & components guide |
| `outlook://docs/quick-start` | Getting started tutorial |
| `outlook://types/all` | TypeScript type definitions |
| `outlook://patterns/nextjs` | Next.js integration pattern |
| `outlook://patterns/error-handling` | Error handling best practices |
| `outlook://patterns/performance` | Performance optimization tips |
| `outlook://examples/complete-app` | Full application example |

### 🎯 Prompts (Code Generation)

| Prompt | Description |
|--------|-------------|
| `build-email-viewer` | Generate React email viewer component |
| `build-email-api` | Generate backend API endpoint |
| `parse-email-batch` | Generate batch processing code |
| `extract-email-data` | Generate data extraction code |
| `troubleshoot-parsing` | Diagnose parsing issues |

## Example AI Interactions

### "Build me an email viewer"

The AI will:
1. Read `outlook://docs/outlook-reader-ui` to learn the hooks
2. Use `build-email-viewer` prompt with your preferences
3. Generate complete React components

### "Parse this email file"

The AI will:
1. Use `validate_email_file` tool to check format
2. Use `parse_email` tool to extract content
3. Return structured email data

### "Why isn't my email parsing?"

The AI will:
1. Use `troubleshoot-parsing` prompt
2. Provide diagnostic steps and solutions

## Typed SDK Client

For programmatic access:

```typescript
import { OutlookMcpClient } from 'outlook-mcp-server/client';

const client = new OutlookMcpClient(mcpConnection);

// Parse email
const result = await client.parseEmail({
  content: base64Content,
  fileName: 'message.msg'
});

// Convenience methods
const summary = await client.getEmailSummary(content, 'email.msg');
const images = await client.getEmailImages(content, 'email.msg');
const isValid = await client.isValidEmail(content);
```

## Package Relationships

```
┌─────────────────────────────────────────────────────────┐
│                   outlook-mcp-server                     │
│  (MCP interface for AI agents)                          │
├─────────────────────────────────────────────────────────┤
│  Tools      │  Resources     │  Prompts                 │
│  - parse    │  - docs        │  - build-viewer          │
│  - validate │  - patterns    │  - build-api             │
│  - extract  │  - examples    │  - troubleshoot          │
└──────┬──────┴───────┬────────┴──────────────────────────┘
       │              │
       ▼              ▼
┌──────────────┐  ┌──────────────────┐
│outlook-email-│  │outlook-reader-ui │
│   parser     │  │  (React hooks)   │
│  (parsing)   │  │                  │
└──────────────┘  └──────────────────┘
```

## Dependencies

- [outlook-email-parser](../outlook-email-parser) - Core email parsing
- [outlook-reader-ui](../outlook-reader-ui) - React UI hooks
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) - MCP SDK

## License

MIT
