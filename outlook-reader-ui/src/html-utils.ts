/** Email attachment interface (matches outlook-email-parser) */
interface EmailAttachment {
  filename: string;
  size: number;
  contentId?: string;
  content?: string;
  mimeType?: string;
}

/**
 * Clean up HTML content for display
 * Preserves original email styling while making minimal adjustments for display
 */
export function cleanupHtml(html: string): string {
  let cleaned = html
    // Remove excessive line breaks
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>")
    .replace(/<br\s*\/?>\s*(<\/(p|div|tr|td|li|ul|ol)>)/gi, "$1")
    .replace(/(<(p|div|tr|td|li|ul|ol)[^>]*>)\s*<br\s*\/?>/gi, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Only wrap the outermost table in a scrollable container (for wide emails)
  // Don't wrap nested tables
  cleaned = cleaned.replace(
    /^(\s*<table[^>]*>)/i,
    '<div class="email-table-wrapper">$1'
  );
  
  // Close the wrapper at the end if we opened one
  if (cleaned.includes('class="email-table-wrapper"')) {
    // Find the matching closing table tag for the first table
    let depth = 0;
    let lastTableEnd = -1;
    const tableRegex = /<\/?table[^>]*>/gi;
    let match;
    
    while ((match = tableRegex.exec(cleaned)) !== null) {
      if (match[0].startsWith('</')) {
        depth--;
        if (depth === 0) {
          lastTableEnd = match.index + match[0].length;
          break;
        }
      } else if (!match[0].endsWith('/>')) {
        depth++;
      }
    }
    
    if (lastTableEnd > 0) {
      cleaned = cleaned.slice(0, lastTableEnd) + '</div>' + cleaned.slice(lastTableEnd);
    }
  }

  return cleaned;
}

/**
 * Convert plain text to formatted HTML
 */
export function textToFormattedHtml(text: string): string {
  const cleanText = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+$/gm, "")
    .trim();

  const lines = cleanText.split("\n");
  const htmlParts: string[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length === 0) return;
    htmlParts.push(`<p style="margin: 0.5rem 0;">${currentParagraph.join("<br>")}</p>`);
    currentParagraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      flushParagraph();
      continue;
    }

    let processed = trimmed
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Convert URLs to links
    processed = processed.replace(
      /(https?:\/\/[^\s&<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #2563eb;">$1</a>'
    );

    // Convert email addresses to mailto links
    processed = processed.replace(
      /(?<![">])([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![^<]*>)/g,
      '<a href="mailto:$1" style="color: #2563eb;">$1</a>'
    );

    currentParagraph.push(processed);
  }

  flushParagraph();
  return `<div class="email-body">${htmlParts.join("")}</div>`;
}

/**
 * Replace cid: URLs with data URIs for embedded images
 * Improved matching for edge cases including:
 * - CIDs with angle brackets
 * - CIDs with @ symbols and domains
 * - Filename-based matching
 * - Partial matches for malformed CIDs
 */
export function replaceCidUrls(html: string, attachments: EmailAttachment[]): string {
  const cidMap = new Map<string, string>();
  const filenameMap = new Map<string, string>();

  for (const att of attachments) {
    if (att.content && att.mimeType) {
      const dataUri = `data:${att.mimeType};base64,${att.content}`;

      // Map by Content-ID (various formats)
      if (att.contentId) {
        const cid = att.contentId.replace(/^<|>$/g, "").trim();
        cidMap.set(cid, dataUri);
        cidMap.set(cid.toLowerCase(), dataUri);
        
        // Also map the part before @ for domain-less matching
        const cidParts = cid.split("@");
        if (cidParts.length > 1) {
          cidMap.set(cidParts[0], dataUri);
          cidMap.set(cidParts[0].toLowerCase(), dataUri);
        }
        
        // Handle image001.png@01D... format
        const imageMatch = cid.match(/^(image\d+\.\w+)@/i);
        if (imageMatch) {
          cidMap.set(imageMatch[1], dataUri);
          cidMap.set(imageMatch[1].toLowerCase(), dataUri);
        }
      }

      // Map by filename (for fallback matching)
      filenameMap.set(att.filename, dataUri);
      filenameMap.set(att.filename.toLowerCase(), dataUri);
      
      // Also map without extension
      const nameWithoutExt = att.filename.replace(/\.[^.]+$/, "");
      filenameMap.set(nameWithoutExt, dataUri);
      filenameMap.set(nameWithoutExt.toLowerCase(), dataUri);
    }
  }

  if (cidMap.size === 0 && filenameMap.size === 0) return html;

  return html.replace(/src\s*=\s*["']cid:([^"']+)["']/gi, (match, rawCid) => {
    const cid = rawCid.trim();
    
    // Direct match
    let dataUri = cidMap.get(cid) || cidMap.get(cid.toLowerCase());
    if (dataUri) return `src="${dataUri}"`;

    // Try without angle brackets if present
    const cleanCid = cid.replace(/^<|>$/g, "");
    dataUri = cidMap.get(cleanCid) || cidMap.get(cleanCid.toLowerCase());
    if (dataUri) return `src="${dataUri}"`;

    // Try the part before @
    const simpleCid = cleanCid.split("@")[0];
    dataUri = cidMap.get(simpleCid) || cidMap.get(simpleCid.toLowerCase());
    if (dataUri) return `src="${dataUri}"`;

    // Try filename matching
    dataUri = filenameMap.get(simpleCid) || filenameMap.get(simpleCid.toLowerCase());
    if (dataUri) return `src="${dataUri}"`;

    // Fuzzy match - check if any key contains or is contained by the CID
    for (const [key, value] of cidMap.entries()) {
      const keyLower = key.toLowerCase();
      const cidLower = simpleCid.toLowerCase();
      
      if (keyLower.includes(cidLower) || cidLower.includes(keyLower)) {
        return `src="${value}"`;
      }
      
      // Check for image pattern matching (image001 matches image001.png)
      const keyImageMatch = keyLower.match(/^(image\d+)/);
      const cidImageMatch = cidLower.match(/^(image\d+)/);
      if (keyImageMatch && cidImageMatch && keyImageMatch[1] === cidImageMatch[1]) {
        return `src="${value}"`;
      }
    }

    // Last resort: try filename fuzzy match
    for (const [key, value] of filenameMap.entries()) {
      if (key.toLowerCase().includes(simpleCid.toLowerCase())) {
        return `src="${value}"`;
      }
    }

    return match;
  });
}
