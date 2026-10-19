"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-[40rem] flex items-center justify-center w-full group",
        "pt-16 pb-8 sm:py-0",
        containerClassName
      )}
    >
      <div className={cn("relative z-20 w-full", className)}>{children}</div>
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      animate={{ backgroundSize: "100% 100%" }}
      transition={{ duration: 2, ease: "linear", delay: 0.5 }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        "relative inline-block pb-1 px-1 rounded-lg",
        "bg-gradient-to-r from-blue-200/50 to-cyan-200/50 sm:from-blue-200/60 sm:to-cyan-200/60",
        className
      )}
    >
      {children}
    </motion.span>
  );
};
