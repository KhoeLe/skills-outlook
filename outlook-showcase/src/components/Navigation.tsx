"use client";

import { useState, useEffect } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconHome,
  IconPackage,
  IconLayoutGrid,
  IconRocket,
  IconServer,
} from "@tabler/icons-react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-zinc-500" />,
      href: "/",
    },
    {
      title: "Packages",
      icon: <IconPackage className="h-full w-full text-zinc-500" />,
      href: "#packages",
    },
    {
      title: "Features",
      icon: <IconLayoutGrid className="h-full w-full text-zinc-500" />,
      href: "#features",
    },
    {
      title: "Quick Start",
      icon: <IconRocket className="h-full w-full text-zinc-500" />,
      href: "#quickstart",
    },
    {
      title: "MCP Server",
      icon: <IconServer className="h-full w-full text-zinc-500" />,
      href: "#mcp",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-zinc-500" />,
      href: "https://github.com",
    },
  ];

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 z-50 flex justify-center safe-area-inset transition-opacity duration-300 ${
        scrolled ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <FloatingDock items={links} mobileClassName="fixed bottom-4 sm:bottom-6 right-4 sm:right-6" />
    </div>
  );
}
