"use client";

import { useState } from "react";
import { Highlight } from "prism-react-renderer";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

// Light syntax theme inspired by macOS Sequoia
const lightTheme = {
  plain: {
    color: "#1d1d1f",
    backgroundColor: "transparent",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#86868b" } },
    { types: ["punctuation"], style: { color: "#6e6e73" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol"], style: { color: "#0071e3" } },
    { types: ["selector", "attr-name", "string", "char", "builtin"], style: { color: "#34c759" } },
    { types: ["operator", "entity", "url"], style: { color: "#ff9500" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#af52de" } },
    { types: ["function", "class-name"], style: { color: "#0071e3" } },
    { types: ["regex", "important", "variable"], style: { color: "#ff3b30" } },
  ],
};

export function CodeBlock({ code, language = "typescript", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl sm:rounded-2xl overflow-hidden glass-frosted border border-zinc-200/50">
      {filename && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-zinc-200/50 bg-zinc-50/50">
          <span className="text-xs sm:text-sm text-zinc-500 font-mono truncate max-w-[60%]">{filename}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-zinc-500 active:text-zinc-700 active:bg-zinc-100 md:hover:text-zinc-700 md:hover:bg-zinc-100 rounded-md sm:rounded-lg transition-colors touch-manipulation shrink-0"
            aria-label={copied ? "Copied to clipboard" : "Copy code"}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2" />
                </svg>
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <Highlight theme={lightTheme} code={code.trim()} language={language as "typescript" | "tsx" | "json"}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="p-3 sm:p-4 overflow-x-auto font-mono text-xs sm:text-sm bg-zinc-50/30 -webkit-overflow-scrolling-touch">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-6 sm:w-8 select-none text-zinc-300 text-[10px] sm:text-xs text-right mr-2 sm:mr-4">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
