"use client";

import { useCallback, useEffect, useState } from "react";

import type { ApiResponse } from "@/lib/http/types";

export type CollectionStatus = "loading" | "error" | "ready";

/**
 * Owns the list fetch, the client-side sort and refetching — nothing else.
 * Mutations stay in the pages, which know their own payload shapes.
 *
 * `load` and `compare` must be module-scope constants, not inline lambdas:
 * a changing identity would re-fire the effect on every render.
 */
export function useAdminCollection<T>(
  load: () => Promise<ApiResponse<T[]>>,
  compare?: (a: T, b: T) => number
) {
  const [status, setStatus] = useState<CollectionStatus>("loading");
  const [items, setItems] = useState<T[]>([]);
  const [attempt, setAttempt] = useState(0);

  const fetchInto = useCallback(
    async (isActive: () => boolean) => {
      const response = await load();
      if (!isActive()) return;
      const next = compare ? [...response.data].sort(compare) : response.data;
      setItems(next);
      setStatus("ready");
    },
    [load, compare]
  );

  useEffect(() => {
    let active = true;
    fetchInto(() => active).catch(() => {
      if (active) setStatus("error");
    });
    return () => {
      active = false;
    };
  }, [fetchInto, attempt]);

  /**
   * Refetches without dropping back to the spinner, so the list never flashes
   * while a dialog is closing. Returns a promise so callers can await freshness
   * before they close.
   */
  const reload = useCallback(() => fetchInto(() => true), [fetchInto]);

  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((current) => current + 1);
  }, []);

  return { status, items, reload, retry };
}
