"use client";

import { useState, useMemo, useCallback } from "react";
import type { PstData, PstMessageSummary } from "../types";
import { formatDate } from "../utils";

export type PstSortField = "subject" | "from" | "date";
export type PstSortOrder = "asc" | "desc";

export interface UsePstViewerOptions {
  /** Initial sort field */
  defaultSortField?: PstSortField;
  /** Initial sort order */
  defaultSortOrder?: PstSortOrder;
  /** Number of messages per page (0 = no pagination) */
  pageSize?: number;
}

export interface UsePstViewerReturn {
  // Data
  messages: PstMessageSummary[];
  totalCount: number;
  displayedCount: number;
  isTruncated: boolean;

  // Sorting
  sortField: PstSortField;
  sortOrder: PstSortOrder;
  setSortField: (field: PstSortField) => void;
  toggleSortOrder: () => void;
  sortBy: (field: PstSortField) => void;

  // Pagination
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;

  // Search/Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMessages: PstMessageSummary[];

  // Selection
  selectedIndex: number | null;
  selectedMessage: PstMessageSummary | null;
  selectMessage: (index: number) => void;
  clearSelection: () => void;

  // Utilities
  formatMessageDate: (date: string) => string;
}

/**
 * Headless hook for PST viewer logic
 * Provides sorting, pagination, search, and selection
 *
 * @example
 * ```tsx
 * function MyPstViewer({ data }) {
 *   const {
 *     messages,
 *     sortBy,
 *     searchQuery,
 *     setSearchQuery,
 *     selectedMessage,
 *   } = usePstViewer(data);
 *
 *   return (
 *     <div>
 *       <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
 *       {messages.map(msg => <div>{msg.subject}</div>)}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePstViewer(
  data: PstData,
  options: UsePstViewerOptions = {}
): UsePstViewerReturn {
  const {
    defaultSortField = "date",
    defaultSortOrder = "desc",
    pageSize = 0,
  } = options;

  // Sorting state
  const [sortField, setSortField] = useState<PstSortField>(defaultSortField);
  const [sortOrder, setSortOrder] = useState<PstSortOrder>(defaultSortOrder);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Selection state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Filter messages by search query
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return data.messages;

    const query = searchQuery.toLowerCase();
    return data.messages.filter(
      (msg) =>
        msg.subject.toLowerCase().includes(query) ||
        msg.from.toLowerCase().includes(query) ||
        msg.to.toLowerCase().includes(query)
    );
  }, [data.messages, searchQuery]);

  // Sort messages
  const sortedMessages = useMemo(() => {
    const sorted = [...filteredMessages].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "subject":
          comparison = a.subject.localeCompare(b.subject);
          break;
        case "from":
          comparison = a.from.localeCompare(b.from);
          break;
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredMessages, sortField, sortOrder]);

  // Paginate messages
  const paginatedMessages = useMemo(() => {
    if (pageSize <= 0) return sortedMessages;

    const start = (currentPage - 1) * pageSize;
    return sortedMessages.slice(start, start + pageSize);
  }, [sortedMessages, currentPage, pageSize]);

  // Pagination calculations
  const totalPages = pageSize > 0 ? Math.ceil(sortedMessages.length / pageSize) : 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Sort actions
  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const sortBy = useCallback((field: PstSortField) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortOrder("asc");
      }
      return field;
    });
  }, []);

  // Pagination actions
  const nextPage = useCallback(() => {
    if (hasNextPage) setCurrentPage((p) => p + 1);
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) setCurrentPage((p) => p - 1);
  }, [hasPrevPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  // Selection actions
  const selectMessage = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const selectedMessage = selectedIndex !== null ? paginatedMessages[selectedIndex] : null;

  // Reset page when search changes
  const handleSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedIndex(null);
  }, []);

  // Utilities
  const formatMessageDate = useCallback((date: string) => formatDate(date), []);

  return {
    // Data
    messages: paginatedMessages,
    totalCount: data.messageCount,
    displayedCount: sortedMessages.length,
    isTruncated: data.truncated,

    // Sorting
    sortField,
    sortOrder,
    setSortField,
    toggleSortOrder,
    sortBy,

    // Pagination
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,

    // Search/Filter
    searchQuery,
    setSearchQuery: handleSearchQuery,
    filteredMessages,

    // Selection
    selectedIndex,
    selectedMessage,
    selectMessage,
    clearSelection,

    // Utilities
    formatMessageDate,
  };
}
