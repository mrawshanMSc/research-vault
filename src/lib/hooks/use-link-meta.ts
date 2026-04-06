import { useEffect } from "react";
import { setLinkMeta } from "@/lib/types";
import { listCategories } from "@/lib/schemas/categories";
import { listStatuses } from "@/lib/schemas/statuses";

export function useLinkMeta() {
  useEffect(() => {
    Promise.all([listCategories(), listStatuses()])
      .then(([cats, stats]) => {
        setLinkMeta({
          categories: cats.map((c) => c.name),
          statuses: stats.map((s) => s.name),
        });
      })
      .catch(() => {});
  }, []);
}
