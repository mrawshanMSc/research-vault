"use client";

import { LinkFilters } from "@/components/link-filters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type LinkFilters as LinkFiltersType,
  type LinkStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  type LucideIcon,
  ShieldAlert,
  SlidersHorizontal,
  Star,
  Telescope,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition } from "react";

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
  const router = useRouter();
  const pathname = usePathname();
  const defaultTab =
    filters.search || filters.category || filters.tag ? "filters" : "dashboard";
  const dashboardCards: Array<{
    key: "all" | "favorites" | LinkStatus;
    title: string;
    description: string;
    value: number;
    icon: LucideIcon;
    iconClassName?: string;
    isActive: boolean;
    nextFilters: Partial<Pick<LinkFiltersType, "status" | "favorite">>;
  }> = [
    {
      key: "all",
      title: "Filtered Links",
      description: "Matches the current filter and sort state.",
      value: filteredLinkCount,
      icon: Telescope,
      isActive: !filters.status && !filters.favorite,
      nextFilters: {
        status: "",
        favorite: "",
      },
    },
    {
      key: "favorites",
      title: "Favorites",
      description: "Priority sources for quick revisit.",
      value: favoritesCount,
      icon: Star,
      iconClassName: "stroke-[1.75]",
      isActive: filters.favorite === "true" && !filters.status,
      nextFilters: {
        status: "",
        favorite: "true",
      },
    },
    {
      key: "Reading",
      title: "Reading Now",
      description: "Items currently in active review.",
      value: statusCounts.Reading,
      icon: BookOpen,
      isActive: filters.status === "Reading" && !filters.favorite,
      nextFilters: {
        status: "Reading",
        favorite: "",
      },
    },
    {
      key: "Important",
      title: "Important",
      description: "High-signal references worth surfacing first.",
      value: statusCounts.Important,
      icon: ShieldAlert,
      isActive: filters.status === "Important" && !filters.favorite,
      nextFilters: {
        status: "Important",
        favorite: "",
      },
    },
  ];

  function handleDashboardFilter(
    nextFilters: Partial<Pick<LinkFiltersType, "status" | "favorite">>
  ) {
    const params = new URLSearchParams();
    const nextValues: LinkFiltersType = {
      ...filters,
      ...nextFilters,
    };

    if (nextValues.search.trim()) {
      params.set("search", nextValues.search.trim());
    }

    if (nextValues.category.trim()) {
      params.set("category", nextValues.category.trim());
    }

    if (nextValues.tag.trim()) {
      params.set("tag", nextValues.tag.trim());
    }

    if (nextValues.status.trim()) {
      params.set("status", nextValues.status.trim());
    }

    if (nextValues.favorite.trim()) {
      params.set("favorite", nextValues.favorite.trim());
    }

    if (nextValues.sort.trim()) {
      params.set("sort", nextValues.sort.trim());
    }

    startTransition(() => {
      router.replace(
        params.toString() ? `${pathname}?${params.toString()}` : pathname
      );
    });
  }

  return (
    <div className="bg-background/95 supports-backdrop-filter:bg-background/90 z-20 space-y-3 border-b pb-4 pt-16 backdrop-blur sm:sticky sm:top-0 lg:pt-20 xl:pt-24">
      <Tabs defaultValue={defaultTab}>
        <TabsList className="h-10! gap-0.5 px-1">
          <TabsTrigger
            value="dashboard"
            className="data-active:border-primary/10 data-active:bg-primary/5"
          >
            <BarChart3 className="size-4" aria-hidden />
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="filters"
            className="data-active:border-primary/10 data-active:bg-primary/5"
          >
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
              {dashboardCards.map((card) => {
                const Icon = card.icon;

                return (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => handleDashboardFilter(card.nextFilters)}
                    aria-pressed={card.isActive}
                    className="border-border bg-card hover:bg-primary/2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 aria-pressed:border-primary/20 bg-linear-to-r aria-pressed:from-primary/4 aria-pressed:to-primary/0 rounded-xl border p-4 text-left outline-none transition-colors"
                  >
                    <div className="text-primary flex items-center gap-2">
                      <Icon
                        className={cn("size-5 shrink-0", card.iconClassName)}
                        aria-hidden
                      />
                      <span className="text-xl font-medium tabular-nums tracking-tight">
                        {card.value}
                      </span>
                    </div>
                    <h4 className="text-foreground mt-2.5 text-base font-medium leading-snug">
                      {card.title}
                    </h4>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {card.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
