"use client";
import React from "react";
import { motion } from "framer-motion";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function Packages() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <section id="packages" className="w-full h-full py-12 sm:py-16 md:py-20 bg-[#FBFBFD] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="max-w-7xl px-4 sm:px-6 md:pl-8 mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 font-sans">
          Two packages. One workflow.
        </h2>
        <p className="max-w-7xl px-4 sm:px-6 md:pl-8 mx-auto text-zinc-500 mt-3 text-base sm:text-lg">
          Everything you need to parse and display Outlook emails beautifully.
        </p>
      </motion.div>
      <Carousel items={cards} />
    </section>
  );
}

const DummyContent = ({
  description,
  installCommand,
  features,
  href,
  icon,
}: {
  description: string;
  installCommand: string;
  features: string[];
  href: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="glass-frosted p-5 sm:p-8 md:p-14 rounded-2xl sm:rounded-3xl mb-4">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
          {icon}
        </div>
      </div>
      <p className="text-zinc-600 text-sm sm:text-base md:text-xl lg:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-semibold text-zinc-900">{description}</span>
      </p>
      <div className="mt-5 sm:mt-6 md:mt-8 max-w-3xl mx-auto">
        <motion.div 
          className="bg-zinc-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-zinc-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <code className="text-xs sm:text-sm md:text-base font-mono text-zinc-700 break-all sm:break-normal">
            {installCommand}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(installCommand)}
            className="text-zinc-400 active:text-zinc-600 md:hover:text-zinc-600 transition-colors text-sm touch-manipulation shrink-0"
          >
            Copy
          </button>
        </motion.div>
        <ul className="mt-5 sm:mt-6 md:mt-8 space-y-3 sm:space-y-4">
          {features.map((feature, idx) => (
            <motion.li 
              key={idx} 
              className="flex items-center gap-2 sm:gap-3 text-zinc-600 text-sm sm:text-base"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-500 shrink-0" />
              {feature}
            </motion.li>
          ))}
        </ul>
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-zinc-900 text-white text-sm sm:text-base font-medium active:bg-zinc-700 md:hover:bg-zinc-800 transition-colors touch-manipulation"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View on NPM
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
};

const data = [
  {
    category: "Parser",
    title: "outlook-email-parser",
    src: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=800&auto=format&fit=crop",
    content: (
      <DummyContent
        description="Parse Microsoft Outlook email files with full support for attachments, embedded images, and various character encodings."
        installCommand="npm i outlook-email-parser"
        href="https://www.npmjs.com/package/outlook-email-parser"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        features={[
          "MSG, EML, OFT file support",
          "Full attachment extraction",
          "Embedded image handling",
          "Multiple encoding support",
          "TypeScript types included",
        ]}
      />
    ),
  },
  {
    category: "UI Components",
    title: "outlook-reader-ui",
    src: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop",
    content: (
      <DummyContent
        description="Beautiful React hooks and components for displaying parsed Outlook emails. Headless-first design for maximum flexibility."
        installCommand="npm i outlook-reader-ui"
        href="https://www.npmjs.com/package/outlook-reader-ui"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        }
        features={[
          "Headless React hooks",
          "useEmailViewer hook",
          "useFileUpload hook",
          "HTML sanitization built-in",
          "Attachment download helpers",
        ]}
      />
    ),
  },
];
