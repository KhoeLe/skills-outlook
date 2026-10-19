"use client";
import { CodeBlock } from "./CodeBlock";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { motion } from "framer-motion";

const parserExample = `import { parseEmail } from 'outlook-email-parser';
import { readFileSync } from 'fs';

// Parse any supported email file
const buffer = readFileSync('email.msg');
const result = await parseEmail(buffer, 'email.msg');

console.log(result.data.subject);
console.log(result.data.from);
console.log(result.data.htmlContent);
console.log(result.data.attachments);`;

const uiExample = `import { useEmailViewer, useFileUpload } from 'outlook-reader-ui';

function EmailViewer({ email }) {
  const { formattedHtml, senderInitials, downloadAttachment } = useEmailViewer(email);

  return (
    <div>
      <div className="avatar">{senderInitials}</div>
      <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
    </div>
  );
}`;

const nextjsExample = `// app/api/parse-email/route.ts
import { parseEmail } from 'outlook-email-parser';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await parseEmail(buffer, file.name);
  
  return NextResponse.json(result.data);
}`;

const scrollContent = [
  {
    title: "1. Parse email files",
    description:
      "Use outlook-email-parser to extract all email data including subject, sender, recipients, HTML content, and attachments. Supports MSG, EML, and OFT formats out of the box.",
    content: (
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="text-4xl mb-2">📧</div>
          <div className="text-sm font-mono opacity-80">parseEmail()</div>
        </div>
      </div>
    ),
  },
  {
    title: "2. Display with React hooks",
    description:
      "Use outlook-reader-ui hooks for all the display logic. useEmailViewer provides formatted HTML, sender initials, and attachment helpers. useFileUpload handles drag-and-drop file selection.",
    content: (
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="text-4xl mb-2">⚛️</div>
          <div className="text-sm font-mono opacity-80">useEmailViewer()</div>
        </div>
      </div>
    ),
  },
  {
    title: "3. Next.js API Route",
    description:
      "Easily handle file uploads and parsing in your API routes. The parser works seamlessly in Node.js environments, making it perfect for server-side processing in Next.js, Express, or any Node backend.",
    content: (
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="text-4xl mb-2">▲</div>
          <div className="text-sm font-mono opacity-80">route.ts</div>
        </div>
      </div>
    ),
  },
];

export function QuickStart() {
  return (
    <section id="quickstart" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#FBFBFD]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-fluid-section font-semibold tracking-tight text-zinc-900 mb-3 sm:mb-4"
          >
            Get started in minutes.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg lg:text-xl text-zinc-500 max-w-2xl mx-auto px-4"
          >
            Simple APIs that just work. Parse emails on the server, display them on the client.
          </motion.p>
        </div>

        {/* Sticky Scroll for desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block mb-16"
        >
          <StickyScroll content={scrollContent} />
        </motion.div>

        {/* Traditional layout for mobile/tablet */}
        <div className="lg:hidden space-y-8 sm:space-y-10">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-900">Parse email files</h3>
            </div>
            <p className="text-zinc-500 text-sm sm:text-base mb-3 sm:mb-4 ml-10 sm:ml-12">
              Use <code className="px-1.5 sm:px-2 py-0.5 bg-zinc-100 rounded text-xs sm:text-sm text-zinc-700">outlook-email-parser</code> to extract all email data.
            </p>
            <div className="ml-0 sm:ml-12">
              <CodeBlock code={parserExample} filename="parse-email.ts" />
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-900">Display with React hooks</h3>
            </div>
            <p className="text-zinc-500 text-sm sm:text-base mb-3 sm:mb-4 ml-10 sm:ml-12">
              Use <code className="px-1.5 sm:px-2 py-0.5 bg-zinc-100 rounded text-xs sm:text-sm text-zinc-700">outlook-reader-ui</code> hooks for all the display logic.
            </p>
            <div className="ml-0 sm:ml-12">
              <CodeBlock code={uiExample} filename="EmailComponents.tsx" />
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-900">Next.js API Route</h3>
            </div>
            <p className="text-zinc-500 text-sm sm:text-base mb-3 sm:mb-4 ml-10 sm:ml-12">
              Easily handle file uploads and parsing in your API routes.
            </p>
            <div className="ml-0 sm:ml-12">
              <CodeBlock code={nextjsExample} filename="route.ts" />
            </div>
          </motion.div>
        </div>

        {/* Code examples for desktop (below sticky scroll) */}
        <div className="hidden lg:block space-y-12 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <CodeBlock code={parserExample} filename="parse-email.ts" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <CodeBlock code={uiExample} filename="EmailComponents.tsx" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <CodeBlock code={nextjsExample} filename="route.ts" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
