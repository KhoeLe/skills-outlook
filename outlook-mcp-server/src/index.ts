/**
 * Outlook MCP Server
 *
 * An MCP server that exposes outlook-email-parser functionality to AI agents.
 * Enables parsing MSG, EML, and OFT email files via the Model Context Protocol.
 * Also provides documentation resources to help AI agents use the packages.
 *
 * @example
 * ```json
 * {
 *   "mcpServers": {
 *     "outlook": {
 *       "command": "npx",
 *       "args": ["outlook-mcp-server"]
 *     }
 *   }
 * }
 * ```
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

import { TOOLS } from "./tools.js";
import { RESOURCES, getResourceContent } from "./resources.js";
import { PROMPTS, getPromptContent } from "./prompts.js";
import {
  handleParseEmail,
  handleValidateEmailFile,
  handleGetSupportedFormats,
  handleExtractAttachments,
  handleGetEmailMetadata,
  handleFormatEmailContent,
} from "./handlers.js";

const server = new Server(
  {
    name: "outlook-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// List available resources (documentation)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources: RESOURCES };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    const content = getResourceContent(uri);
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  } catch (error) {
    throw new McpError(ErrorCode.InvalidRequest, `Resource not found: ${uri}`);
  }
});

// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return { prompts: PROMPTS };
});

// Get prompt content
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const content = getPromptContent(name, args || {});
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: content,
          },
        },
      ],
    };
  } catch (error) {
    throw new McpError(ErrorCode.InvalidRequest, `Prompt not found: ${name}`);
  }
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      case "parse_email":
        result = await handleParseEmail(args);
        break;

      case "validate_email_file":
        result = await handleValidateEmailFile(args);
        break;

      case "get_supported_formats":
        result = await handleGetSupportedFormats();
        break;

      case "extract_attachments":
        result = await handleExtractAttachments(args);
        break;

      case "get_email_metadata":
        result = await handleGetEmailMetadata(args);
        break;

      case "format_email_content":
        result = await handleFormatEmailContent(args);
        break;

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${message}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Outlook MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
