import { useEffect } from "react";
import { setLinkMeta } from "@/lib/types";

export function useLinkMeta() {
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/statuses").then((r) => r.json()),
    ])
      .then(([cats, stats]) => {
        setLinkMeta({
          categories: cats,
          statuses: stats,
        });
      })
      .catch(() => {});
  }, []);
}
