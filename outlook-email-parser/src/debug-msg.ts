/**
 * Debug script to inspect MSG file structure
 */

import { readFileSync } from "fs";
import { parseCfb } from "./cfb";

const file = process.argv[2];
if (!file) {
  console.log("Usage: npx ts-node src/debug-msg.ts <file.msg>");
  process.exit(1);
}

const buffer = readFileSync(file);
const cfb = parseCfb(buffer);

console.log("=== Directory Entries ===");
for (const d of cfb.directories) {
  console.log(`[${d.index}] ${d.name} (type=${d.type}, size=${d.size}, child=${d.childId})`);
}

console.log("\n=== Attachment Directories ===");
const attachDirs = cfb.directories.filter(d => d.name.toLowerCase().includes("attach"));
for (const d of attachDirs) {
  console.log(`${d.name} (index=${d.index}, childId=${d.childId})`);
}
