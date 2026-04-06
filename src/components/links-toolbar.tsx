"use client";

import { LinkFilters } from "@/components/link-filters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type LinkFilters as LinkFiltersType,
  type LinkStatus,
} from "@/lib/types";
import {
  BarChart3,
  BookOpen,
  ShieldAlert,
  SlidersHorizontal,
  Star,
  Telescope,
} from "lucide-react";

type LinksToolbarProps = {
  filters: LinkFiltersType;
  statusCounts: Record<LinkStatus, number>;
  filteredLinkCount: number;
  favoritesCount: number;
};

export function LinksToolbar({
  filters,
  statusCounts,
  filteredLinkCount,
  favoritesCount,
}: LinksToolbarProps) {
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

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="border-border dark:bg-card rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-primary flex items-center gap-2">
                  <Telescope className="size-5 shrink-0" aria-hidden />
                  <span className="text-xl font-semibold tabular-nums tracking-tight">
                    {filteredLinkCount}
                  </span>
                </div>
                <h4 className="text-foreground mt-2.5 text-base font-semibold leading-snug">
                  Filtered Links
                </h4>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  Matches the current filter and sort state.
                </p>
              </div>

              <div className="border-border dark:bg-card rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-primary flex items-center gap-2">
                  <Star className="size-5 shrink-0 stroke-[1.75]" aria-hidden />
                  <span className="text-xl font-semibold tabular-nums tracking-tight">
                    {favoritesCount}
                  </span>
                </div>
                <h4 className="text-foreground mt-2.5 text-base font-semibold leading-snug">
                  Favorites
                </h4>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  Priority sources for quick revisit.
                </p>
              </div>

              <div className="border-border dark:bg-card rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-primary flex items-center gap-2">
                  <BookOpen className="size-5 shrink-0" aria-hidden />
                  <span className="text-xl font-semibold tabular-nums tracking-tight">
                    {statusCounts.Reading}
                  </span>
                </div>
                <h4 className="text-foreground mt-2.5 text-base font-semibold leading-snug">
                  Reading Now
                </h4>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  Items currently in active review.
                </p>
              </div>

              <div className="border-border dark:bg-card rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-primary flex items-center gap-2">
                  <ShieldAlert className="size-5 shrink-0" aria-hidden />
                  <span className="text-xl font-semibold tabular-nums tracking-tight">
                    {statusCounts.Important}
                  </span>
                </div>
                <h4 className="text-foreground mt-2.5 text-base font-semibold leading-snug">
                  Important
                </h4>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  High-signal references worth surfacing first.
                </p>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
