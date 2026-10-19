/**
 * CFB (Compound File Binary) format parser
 * Used by MSG files (Microsoft Outlook) and other OLE-based formats
 */

import { CFB } from "./constants";

export interface DirectoryEntry {
  name: string;
  type: number;
  start: number;
  size: number;
  index?: number;
  childId?: number;
  leftSibling?: number;
  rightSibling?: number;
}

export interface CfbFile {
  sectorSize: number;
  miniSectorSize: number;
  miniCutoff: number;
  fat: number[];
  miniFat: number[];
  directories: DirectoryEntry[];
  miniStream: Buffer;
  buffer: Buffer;
}

/**
 * Parse a CFB file and return its structure
 */
export function parseCfb(buffer: Buffer): CfbFile {
  validateSignature(buffer);

  const view = new DataView(buffer.buffer, buffer.byteOffset);
  const sectorSize = 1 << view.getUint16(30, true);
  const miniSectorSize = 1 << view.getUint16(32, true);
  const miniCutoff = view.getUint32(56, true);

  const fat = buildFat(buffer, view, sectorSize);
  const directories = parseDirectories(buffer, view, fat, sectorSize);
  const miniFat = buildMiniFat(buffer, view, fat, sectorSize);

  let miniStream: Buffer = Buffer.alloc(0);
  if (directories[0]?.size > 0) {
    miniStream = readStream(buffer, fat, directories[0].start, directories[0].size, sectorSize, false, miniStream);
  }

  return {
    sectorSize,
    miniSectorSize,
    miniCutoff,
    fat,
    miniFat,
    directories,
    miniStream,
    buffer,
  };
}

/**
 * Validate CFB signature
 */
function validateSignature(buffer: Buffer): void {
  for (let i = 0; i < 8; i++) {
    if (buffer[i] !== CFB.SIGNATURE[i]) {
      throw new Error("Invalid MSG file: CFB signature mismatch");
    }
  }
}

/**
 * Build the File Allocation Table
 */
function buildFat(buffer: Buffer, view: DataView, sectorSize: number): number[] {
  const fat: number[] = [];
  const difat: number[] = [];

  for (let i = 0; i < 109; i++) {
    const s = view.getUint32(76 + i * 4, true);
    if (s !== CFB.FREE_SECTOR) difat.push(s);
  }

  for (const fs of difat) {
    const off = CFB.HEADER_SIZE + fs * sectorSize;
    for (let i = 0; i < sectorSize / 4; i++) {
      fat.push(view.getUint32(off + i * 4, true));
    }
  }

  return fat;
}

/**
 * Parse directory entries with parent-child relationships
 */
function parseDirectories(buffer: Buffer, view: DataView, fat: number[], sectorSize: number): DirectoryEntry[] {
  const directories: DirectoryEntry[] = [];
  let dirSec = view.getUint32(48, true);
  let entryIndex = 0;

  while (dirSec !== CFB.END_OF_CHAIN && dirSec !== CFB.FREE_SECTOR) {
    const off = CFB.HEADER_SIZE + dirSec * sectorSize;

    for (let i = 0; i < sectorSize / CFB.DIRECTORY_ENTRY_SIZE; i++) {
      const eOff = off + i * CFB.DIRECTORY_ENTRY_SIZE;
      const nameLen = view.getUint16(eOff + 64, true);

      if (nameLen === 0) {
        entryIndex++;
        continue;
      }

      let name = "";
      for (let j = 0; j < Math.min(nameLen - 2, 64); j += 2) {
        const c = buffer[eOff + j] | (buffer[eOff + j + 1] << 8);
        if (c === 0) break;
        name += String.fromCharCode(c);
      }

      const type = buffer[eOff + 66];
      if (type === 0) {
        entryIndex++;
        continue;
      }

      // Read tree structure indices
      const leftSibling = view.getInt32(eOff + 68, true);
      const rightSibling = view.getInt32(eOff + 72, true);
      const childId = view.getInt32(eOff + 76, true);

      directories.push({
        name,
        type,
        start: view.getUint32(eOff + 116, true),
        size: view.getUint32(eOff + 120, true),
        index: entryIndex,
        childId,
        leftSibling,
        rightSibling,
      });
      
      entryIndex++;
    }

    dirSec = fat[dirSec] ?? CFB.END_OF_CHAIN;
  }

  return directories;
}

/**
 * Build the Mini FAT
 */
function buildMiniFat(buffer: Buffer, view: DataView, fat: number[], sectorSize: number): number[] {
  const miniFat: number[] = [];
  let miniFatSec = view.getUint32(60, true);

  while (miniFatSec !== CFB.END_OF_CHAIN && miniFatSec !== CFB.FREE_SECTOR) {
    const off = CFB.HEADER_SIZE + miniFatSec * sectorSize;
    for (let i = 0; i < sectorSize / 4; i++) {
      miniFat.push(view.getUint32(off + i * 4, true));
    }
    miniFatSec = fat[miniFatSec] ?? CFB.END_OF_CHAIN;
  }

  return miniFat;
}

/**
 * Read a stream from the CFB file
 */
export function readStream(
  buffer: Buffer,
  fat: number[],
  start: number,
  size: number,
  sectorSize: number,
  mini: boolean,
  miniStream: Buffer,
  miniFat?: number[],
  miniSectorSize: number = CFB.DEFAULT_MINI_SECTOR_SIZE
): Buffer {
  const result = Buffer.alloc(size);
  let off = 0;
  let sec = start;
  const secSize = mini ? miniSectorSize : sectorSize;
  const chain = mini ? (miniFat ?? []) : fat;

  while (sec !== CFB.END_OF_CHAIN && off < size) {
    const toRead = Math.min(secSize, size - off);
    if (mini) {
      miniStream.copy(result, off, sec * secSize, sec * secSize + toRead);
    } else {
      buffer.copy(result, off, CFB.HEADER_SIZE + sec * sectorSize, CFB.HEADER_SIZE + sec * sectorSize + toRead);
    }
    off += toRead;
    sec = chain[sec] ?? CFB.END_OF_CHAIN;
  }

  return result;
}

/**
 * Find the largest directory entry matching a prefix
 */
export function findLargestEntry(directories: DirectoryEntry[], prefix: string): DirectoryEntry | null {
  const matches = directories.filter((d) => d.name.toLowerCase().startsWith(prefix.toLowerCase()));
  if (matches.length === 0) return null;
  return matches.reduce((a, b) => (a.size >= b.size ? a : b));
}

/**
 * Find all directory entries matching a filter
 */
export function findEntries(directories: DirectoryEntry[], filter: (name: string) => boolean): DirectoryEntry[] {
  return directories.filter((d) => filter(d.name.toLowerCase()));
}
