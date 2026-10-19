"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { BackgroundLines } from "@/components/ui/background-lines";

export function Hero() {
  return (
    <BackgroundLines className="bg-[#FBFBFD]">
      <HeroHighlight containerClassName="!min-h-0 !h-auto py-20 sm:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, -5, 0] }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-fluid-hero font-semibold tracking-tight text-zinc-900">
              Parse Outlook emails{" "}
              <Highlight className="text-zinc-900">beautifully.</Highlight>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-fluid-body text-zinc-500 mt-4 sm:mt-6 max-w-2xl mx-auto"
          >
            Professional TypeScript packages for parsing MSG, EML, and OFT files.
            Display them with elegant React components.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10"
          >
            <a
              href="#quickstart"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-zinc-900 text-white rounded-full text-base font-medium hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-soft"
            >
              Get Started
              <motion.svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </a>
            <a
              href="#packages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-zinc-600 rounded-full text-base font-medium hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
            >
              View Packages
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 sm:mt-14"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 glass-frosted rounded-xl sm:rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto max-w-full shadow-soft">
              <span className="text-zinc-400 shrink-0">$</span>
              <code className="text-zinc-700 whitespace-nowrap">npm install outlook-email-parser outlook-reader-ui</code>
              <button
                className="p-1.5 hover:bg-zinc-100 active:bg-zinc-200 rounded-lg transition-colors shrink-0"
                onClick={() => navigator.clipboard.writeText("npm install outlook-email-parser outlook-reader-ui")}
                aria-label="Copy to clipboard"
              >
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </HeroHighlight>
    </BackgroundLines>
  );
}
