"use client";

import { CodeBlock } from "./CodeBlock";

const mcpConfig = `{
  "mcpServers": {
    "outlook": {
      "command": "npx",
      "args": ["outlook-mcp-server"]
    }
  }
}`;

const tools = [
  { name: "parse_email", description: "Parse email files and extract all content" },
  { name: "validate_email_file", description: "Check if file is valid MSG/EML format" },
  { name: "extract_attachments", description: "Extract only attachments from email" },
  { name: "get_email_metadata", description: "Get headers without full content" },
  { name: "format_email_content", description: "Clean HTML for safe display" },
];

const resources = [
  { uri: "outlook://docs/outlook-email-parser", description: "Complete parsing guide" },
  { uri: "outlook://docs/outlook-reader-ui", description: "React hooks & components guide" },
  { uri: "outlook://patterns/nextjs", description: "Next.js integration pattern" },
  { uri: "outlook://patterns/error-handling", description: "Error handling best practices" },
];

const prompts = [
  { name: "build-email-viewer", description: "Generate React email viewer component" },
  { name: "build-email-api", description: "Generate backend API endpoint" },
  { name: "troubleshoot-parsing", description: "Diagnose parsing issues" },
];

export function MCPSection() {
  return (
    <section id="mcp" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f5f5f7] to-[#FBFBFD]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            MCP Server
          </div>
          <h2 className="text-fluid-section font-semibold tracking-tight text-zinc-900 mb-3 sm:mb-4">
            AI-powered development.
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-500 max-w-2xl mx-auto px-4">
            The MCP server enables AI agents to parse emails, access documentation, and generate code using your packages.
          </p>
        </div>

        {/* Configuration */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 mb-3 sm:mb-4 text-center">Quick Setup</h3>
          <p className="text-zinc-500 text-sm sm:text-base text-center mb-4 sm:mb-6 px-4">
            Add to your <code className="px-1.5 sm:px-2 py-0.5 bg-zinc-100 rounded text-xs sm:text-sm text-zinc-700">mcp.json</code> configuration:
          </p>
          <div className="max-w-xl mx-auto">
            <CodeBlock code={mcpConfig} filename="mcp.json" language="json" />
          </div>
        </div>

        {/* Three columns - stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {/* Tools */}
          <div className="glass-frosted rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-zinc-200/50">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900">Tools</h3>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {tools.map((tool) => (
                <li key={tool.name} className="text-xs sm:text-sm">
                  <code className="text-blue-600">{tool.name}</code>
                  <p className="text-zinc-500 mt-0.5">{tool.description}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="glass-frosted rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-zinc-200/50">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900">Resources</h3>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {resources.map((resource) => (
                <li key={resource.uri} className="text-xs sm:text-sm">
                  <code className="text-green-600 text-[10px] sm:text-xs break-all">{resource.uri}</code>
                  <p className="text-zinc-500 mt-0.5">{resource.description}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Prompts */}
          <div className="glass-frosted rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-zinc-200/50">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900">Prompts</h3>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {prompts.map((prompt) => (
                <li key={prompt.name} className="text-xs sm:text-sm">
                  <code className="text-orange-600">{prompt.name}</code>
                  <p className="text-zinc-500 mt-0.5">{prompt.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Architecture diagram - responsive */}
        <div className="mt-10 sm:mt-12 lg:mt-16 p-4 sm:p-6 lg:p-8 glass-frosted rounded-xl sm:rounded-2xl border border-zinc-200/50">
          <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 mb-4 sm:mb-6 text-center">Architecture</h3>
          <div className="flex flex-col items-center gap-3 sm:gap-4 md:flex-row md:justify-center md:gap-6 lg:gap-8">
            <div className="text-center p-3 sm:p-4 bg-zinc-50 rounded-lg sm:rounded-xl w-full md:w-auto md:min-w-[140px] lg:min-w-[180px] border border-zinc-200/50">
              <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">🤖</div>
              <div className="font-semibold text-zinc-900 text-sm sm:text-base">AI Agent</div>
              <div className="text-xs sm:text-sm text-zinc-500">Claude, GPT, etc.</div>
            </div>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-300 rotate-90 md:rotate-0 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl w-full md:w-auto md:min-w-[140px] lg:min-w-[180px] border-2 border-purple-200">
              <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">⚡</div>
              <div className="font-semibold text-purple-700 text-sm sm:text-base">MCP Server</div>
              <div className="text-xs sm:text-sm text-zinc-500">outlook-mcp-server</div>
            </div>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-300 rotate-90 md:rotate-0 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="text-center p-2.5 sm:p-3 bg-zinc-50 rounded-lg sm:rounded-xl border border-zinc-200/50">
                <div className="font-mono text-xs sm:text-sm text-zinc-700">outlook-email-parser</div>
              </div>
              <div className="text-center p-2.5 sm:p-3 bg-zinc-50 rounded-lg sm:rounded-xl border border-zinc-200/50">
                <div className="font-mono text-xs sm:text-sm text-zinc-700">outlook-reader-ui</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
