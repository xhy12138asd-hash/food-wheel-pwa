import { useEffect, useMemo, useState } from "react";
import { todayKey } from "./date";

const SYNC_INTERVAL_MS = 10 * 60 * 1000;
const TICK_INTERVAL_MS = 30 * 1000;

interface NetworkClock {
  dateKey: string;
  isSynced: boolean;
}

export function useNetworkTodayKey(): NetworkClock {
  const [offsetMs, setOffsetMs] = useState(0);
  const [isSynced, setIsSynced] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    let isMounted = true;

    async function syncNetworkTime() {
      try {
        const url = new URL(window.location.href);
        url.hash = "";
        url.searchParams.set("time", String(Date.now()));

        const response = await fetch(url.toString(), {
          method: "HEAD",
          cache: "no-store",
        });
        const serverDate = response.headers.get("date");
        if (!serverDate) return;

        const serverNow = new Date(serverDate).getTime();
        if (Number.isNaN(serverNow) || !isMounted) return;

        setOffsetMs(serverNow - Date.now());
        setIsSynced(true);
      } catch {
        if (isMounted) setIsSynced(false);
      }
    }

    syncNetworkTime();
    const syncTimer = window.setInterval(syncNetworkTime, SYNC_INTERVAL_MS);
    return () => {
      isMounted = false;
      window.clearInterval(syncTimer);
    };
  }, []);

  useEffect(() => {
    const tickTimer = window.setInterval(() => setNowMs(Date.now()), TICK_INTERVAL_MS);
    return () => window.clearInterval(tickTimer);
  }, []);

  return useMemo(
    () => ({
      dateKey: todayKey(new Date(nowMs + offsetMs)),
      isSynced,
    }),
    [isSynced, nowMs, offsetMs]
  );
}
