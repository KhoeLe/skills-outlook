"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f5f5f7] to-[#FBFBFD]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-fluid-section font-semibold tracking-tight text-zinc-900 mb-3 sm:mb-4"
          >
            Built for developers.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg lg:text-xl text-zinc-500 max-w-2xl mx-auto px-4"
          >
            Everything you need to work with Outlook emails in your applications.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "group relative",
                item.span === 2 && "sm:col-span-2"
              )}
            >
              <div
                className={cn(
                  "relative h-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300 overflow-hidden",
                  "bg-white/80 backdrop-blur-xl",
                  "border border-zinc-200/60",
                  "hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50",
                  "hover:border-zinc-200/80 hover:-translate-y-1",
                  "active:scale-[0.99] sm:active:scale-100"
                )}
              >
                {/* Glowing effect on hover */}
                <GlowingEffect
                  spread={150}
                  glow={true}
                  blur={0}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* Animated illustration - responsive height */}
                <div className="relative h-32 sm:h-36 lg:h-40 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100/50">
                  {item.illustration}
                </div>

                {/* Icon badge */}
                <div className={cn(
                  "inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl mb-3 sm:mb-4",
                  item.iconBg
                )}>
                  {item.icon}
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-zinc-900 mb-1.5 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Animated illustrations for each feature
const TypeSafeIllustration = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="flex items-center gap-2 font-mono text-xl sm:text-2xl"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-blue-500">{"<"}</span>
        <motion.div
          className="flex gap-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-purple-500">T</span>
          <span className="text-zinc-400">/</span>
        </motion.div>
        <span className="text-blue-500">{">"}</span>
      </motion.div>
      <motion.div
        className="absolute -top-5 sm:-top-6 -right-8 sm:-right-12 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-500/10 rounded text-[10px] sm:text-xs font-mono text-blue-600"
        animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      >
        string
      </motion.div>
      <motion.div
        className="absolute -bottom-3 sm:-bottom-4 -left-8 sm:-left-10 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-500/10 rounded text-[10px] sm:text-xs font-mono text-purple-600"
        animate={{ y: [0, 4, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
      >
        EmailData
      </motion.div>
    </motion.div>
  </div>
);

const ZeroConfigIllustration = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div className="relative">
      <div className="w-40 sm:w-48 bg-zinc-900 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-zinc-800">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-400" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="p-2 sm:p-3 font-mono text-[10px] sm:text-xs">
          <div className="text-zinc-500">$ npm install</div>
          <motion.div
            className="text-green-400 mt-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            ✓ Ready to use
          </motion.div>
        </div>
      </div>
      <motion.div
        className="absolute -top-2 -right-2 text-base sm:text-lg"
        animate={{ rotate: [0, 15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ✨
      </motion.div>
    </motion.div>
  </div>
);

const HeadlessIllustration = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div className="relative flex items-center gap-2 sm:gap-3">
      <motion.div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-mono text-sm sm:text-lg shadow-lg"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        { }
      </motion.div>
      <motion.svg
        className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </motion.svg>
      <div className="flex flex-col gap-1 sm:gap-1.5">
        <motion.div
          className="w-12 sm:w-16 h-2.5 sm:h-3 rounded bg-gradient-to-r from-pink-400 to-rose-400"
          animate={{ width: ["3rem", "4rem", "3rem"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="w-10 sm:w-12 h-2.5 sm:h-3 rounded bg-gradient-to-r from-blue-400 to-cyan-400"
          animate={{ width: ["2.5rem", "3.5rem", "2.5rem"] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-11 sm:w-14 h-2.5 sm:h-3 rounded bg-gradient-to-r from-green-400 to-emerald-400"
          animate={{ width: ["2.75rem", "3.75rem", "2.75rem"] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </motion.div>
  </div>
);

const SecureIllustration = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div className="relative">
      <motion.div
        className="w-16 h-20 sm:w-20 sm:h-24 relative"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg viewBox="0 0 80 96" fill="none" className="w-full h-full">
          <path
            d="M40 4L8 20v28c0 22 14 42 32 48 18-6 32-26 32-48V20L40 4z"
            className="fill-green-500/20 stroke-green-500"
            strokeWidth="2"
          />
          <motion.path
            d="M28 48l8 8 16-16"
            className="stroke-green-500"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </svg>
      </motion.div>
      <motion.div
        className="absolute -right-6 sm:-right-8 top-0 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 rounded text-[10px] sm:text-xs text-red-500 line-through"
        animate={{ opacity: [0.5, 0.8, 0.5], x: [0, 2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {"<script>"}
      </motion.div>
    </motion.div>
  </div>
);

const AttachmentIllustration = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div className="relative flex items-center gap-1.5 sm:gap-2">
      {[
        { color: "from-blue-400 to-blue-500", ext: "PDF", delay: 0 },
        { color: "from-green-400 to-green-500", ext: "IMG", delay: 0.1 },
        { color: "from-orange-400 to-orange-500", ext: "DOC", delay: 0.2 },
      ].map((file, i) => (
        <motion.div
          key={i}
          className={cn(
            "w-11 h-14 sm:w-14 sm:h-16 rounded-md sm:rounded-lg bg-gradient-to-br shadow-lg flex flex-col items-center justify-center",
            file.color
          )}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: file.delay }}
          whileHover={{ y: -4, scale: 1.05 }}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 mb-0.5 sm:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[8px] sm:text-[10px] font-bold text-white">{file.ext}</span>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

const MCPIllustration = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div className="relative flex items-center gap-3 sm:gap-4">
      <motion.div
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xl sm:text-2xl">🤖</span>
      </motion.div>
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-10 sm:w-12 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
            animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <motion.div
        className="w-16 h-11 sm:w-20 sm:h-14 rounded-md sm:rounded-lg bg-zinc-900 p-1.5 sm:p-2 font-mono text-[7px] sm:text-[8px] leading-tight text-green-400 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {"const email ="}<br />
          {"  parseEmail()"}<br />
          {"// Generated ✨"}
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
);

const items = [
  {
    title: "Type-Safe",
    description: "Full TypeScript support with comprehensive type definitions for all parsed email data.",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    iconBg: "bg-blue-100",
    illustration: <TypeSafeIllustration />,
  },
  {
    title: "Zero Config",
    description: "Works out of the box. No complex setup required. Just install and start parsing.",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    iconBg: "bg-green-100",
    illustration: <ZeroConfigIllustration />,
  },
  {
    title: "Headless First",
    description: "UI hooks provide all the logic without styling opinions. Build your own beautiful interface.",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    iconBg: "bg-purple-100",
    illustration: <HeadlessIllustration />,
  },
  {
    title: "Secure by Default",
    description: "HTML content is sanitized automatically. Scripts and dangerous elements are removed to keep your app safe.",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    iconBg: "bg-emerald-100",
    illustration: <SecureIllustration />,
    span: 2,
  },
  {
    title: "Full Attachment Support",
    description: "Extract all attachments including embedded images. Download helpers included.",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
    ),
    iconBg: "bg-orange-100",
    illustration: <AttachmentIllustration />,
  },
  {
    title: "AI-Ready with MCP",
    description: "MCP server enables AI agents to parse emails and generate code using your packages automatically.",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    iconBg: "bg-violet-100",
    illustration: <MCPIllustration />,
    span: 2,
  },
];
