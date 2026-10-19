import { CodeBlock } from "./CodeBlock";

const typesCode = `interface ParsedEmail {
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
}`;

export function TypesReference() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#FBFBFD]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-fluid-section font-semibold tracking-tight text-zinc-900 mb-3 sm:mb-4">
            Fully typed.
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-500 max-w-2xl mx-auto px-4">
            Comprehensive TypeScript definitions for all parsed email data. IntelliSense everywhere.
          </p>
        </div>

        <CodeBlock code={typesCode} filename="types.ts" />

        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-zinc-50 rounded-lg sm:rounded-xl text-center border border-zinc-200/50">
            <div className="text-xl sm:text-2xl font-semibold text-blue-600">100%</div>
            <div className="text-xs sm:text-sm text-zinc-500">Type Coverage</div>
          </div>
          <div className="p-3 sm:p-4 bg-zinc-50 rounded-lg sm:rounded-xl text-center border border-zinc-200/50">
            <div className="text-xl sm:text-2xl font-semibold text-blue-600">0</div>
            <div className="text-xs sm:text-sm text-zinc-500">Any Types</div>
          </div>
          <div className="p-3 sm:p-4 bg-zinc-50 rounded-lg sm:rounded-xl text-center border border-zinc-200/50">
            <div className="text-xl sm:text-2xl font-semibold text-blue-600">Full</div>
            <div className="text-xs sm:text-sm text-zinc-500">IntelliSense</div>
          </div>
        </div>
      </div>
    </section>
  );
}
