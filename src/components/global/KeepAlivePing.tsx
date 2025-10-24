"use client";

import { useEffect } from "react";

export default function KeepAlivePing() {
  useEffect(() => {
    const KEY = "rf_keepalive_last";
    try {
      const last = localStorage.getItem(KEY);
      const now = Date.now();
      const DAY = 24 * 60 * 60 * 1000;

      if (!last || now - Number(last) > DAY) {
        // Fire-and-forget; we don't need to await
        fetch("/api/keepalive", { method: "GET", cache: "no-store" })
          .then(() => localStorage.setItem(KEY, String(now)))
          .catch(() => {
            // Ignore errors; this is best-effort
          });
      }
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
  }, []);

  return null;
}
