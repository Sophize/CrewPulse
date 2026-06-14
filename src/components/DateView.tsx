import { useEffect, useReducer } from "react";

const SECOND_MS = 1000;
const MIN_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MIN_MS;
const DAY_MS = 24 * HOUR_MS;

function fromNow(date: Date) {
  const diff = Math.abs(Date.now() - date.getTime());

  if (diff < MIN_MS) {
    return "Just now";
  }

  if (diff < HOUR_MS) {
    return `${Math.round(diff / MIN_MS)}m ago`;
  }

  if (diff < DAY_MS) {
    return `${Math.round(diff / HOUR_MS)}h ago`;
  }

  return `${Math.round(diff / DAY_MS)}d ago`;
}

export function DateView({ timestampMs }: { timestampMs: number }) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate();
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const date = new Date(timestampMs);

  return <span title={date.toLocaleString()}>{fromNow(date)}</span>;
}
