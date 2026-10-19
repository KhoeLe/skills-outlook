"use client";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

export const GlowingEffect = ({
  blur = 0,
  inactiveZone = 0.7,
  proximity = 0,
  spread = 20,
  variant = "default",
  glow = false,
  className,
  movementDuration = 2,
  borderWidth = 1,
  disabled = false,
}: GlowingEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (disabled || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [disabled, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-100);
    mouseY.set(-100);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, disabled]);

  const gradientColors =
    variant === "white"
      ? `rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4), transparent`
      : `rgba(0, 113, 227, 0.6), rgba(90, 200, 250, 0.4), transparent`;

  const background = useMotionTemplate`radial-gradient(${spread}px circle at ${mouseX}px ${mouseY}px, ${gradientColors})`;

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]",
        glow && "opacity-100",
        className
      )}
      style={{
        background,
      }}
    />
  );
};

export const GlowingCard = ({
  children,
  className,
  containerClassName,
  glowClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  glowClassName?: string;
}) => {
  return (
    <div className={cn("relative", containerClassName)}>
      <GlowingEffect
        spread={120}
        glow={true}
        className={glowClassName}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
