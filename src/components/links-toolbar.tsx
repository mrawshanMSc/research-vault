"use client";

import { LinkFilters } from "@/components/link-filters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type LinkFilters as LinkFiltersType,
  type LinkStatus,
} from "@/lib/types";
import {
  BarChart3,
  BookmarkCheck,
  Clock3,
  Flame,
  NotebookPen,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

type LinksToolbarProps = {
  filters: LinkFiltersType;
  statusCounts: Record<LinkStatus, number>;
};

const statusMeta: Record<
  LinkStatus,
  {
    description: string;
    icon: LucideIcon;
  }
> = {
  "To Read": {
    description: "Queued up next",
    icon: Clock3,
  },
  Reading: {
    description: "Currently in progress",
    icon: NotebookPen,
  },
  Reviewed: {
    description: "Already covered",
    icon: BookmarkCheck,
  },
  Important: {
    description: "Worth revisiting",
    icon: Flame,
  },
};

function buildStatusHref(filters: LinkFiltersType, status: LinkStatus) {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.category.trim()) {
    params.set("category", filters.category.trim());
  }

  if (filters.tag.trim()) {
    params.set("tag", filters.tag.trim());
  }

  if (filters.favorite.trim()) {
    params.set("favorite", filters.favorite.trim());
  }

  if (filters.sort.trim()) {
    params.set("sort", filters.sort.trim());
  }

  if (filters.status !== status) {
    params.set("status", status);
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function LinksToolbar({ filters, statusCounts }: LinksToolbarProps) {
  const defaultTab =
    filters.search || filters.category || filters.tag ? "filters" : "dashboard";

  return (
    <div className="bg-background/95 supports-backdrop-filter:bg-background/90 z-20 space-y-3 border-b pb-4 pt-16 backdrop-blur sm:sticky sm:top-0 lg:pt-20 xl:pt-24">
      <Tabs defaultValue={defaultTab}>
        <TabsList className="h-10! gap-0.5">
          <TabsTrigger value="dashboard">
            <BarChart3 className="size-4" aria-hidden />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="filters">
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filters">
          <LinkFilters filters={filters} />
        </TabsContent>

        <TabsContent value="dashboard">
          <section className="rounded-xl border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-medium tracking-tight">
                  Browse by status
                </h3>
                <p className="text-muted-foreground text-sm leading-6">
                  Jump into a reading lane first, then refine the collection
                  from the filters tab.
                </p>
              </div>
            </div>

            {/* <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              TODO: Dashboard cards
            </div> */}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
