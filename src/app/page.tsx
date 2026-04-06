import type { Metadata } from "next";
import { LinksToolbar } from "@/components/links-toolbar";
import { ResearchLinkCard } from "@/components/research-link-card";
import { listLinks } from "@/lib/schemas/links";
import {
  DEFAULT_LINK_SORT,
  LINK_STATUSES,
  type LinkFilters as LinkFiltersType,
  type LinkStatus,
} from "@/lib/types";

type HomePageProps = {
  searchParams: Promise<{
    search?: string | string[];
    category?: string | string[];
    tag?: string | string[];
    status?: string | string[];
    favorite?: string | string[];
    sort?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "ResearchVault - Home",
  description:
    "Browse the latest saved research links, notes, and categories in the vault.",
};

function getFilterValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function Home(props: HomePageProps) {
  const query = await props.searchParams;

  const filters: LinkFiltersType = {
    search: getFilterValue(query.search),
    category: getFilterValue(query.category),
    tag: getFilterValue(query.tag),
    status: getFilterValue(query.status),
    favorite: getFilterValue(query.favorite),
    sort: (getFilterValue(query.sort) ||
      DEFAULT_LINK_SORT) as LinkFiltersType["sort"],
  };

  const countFilters: LinkFiltersType = {
    ...filters,
    status: "",
  };

  const [links, countSourceLinks] = await Promise.all([
    listLinks(filters),
    listLinks(countFilters),
  ]);

  const statusCounts = LINK_STATUSES.reduce(
    (counts, status) => {
      counts[status] = countSourceLinks.filter(
        (link) => link.status === status
      ).length;
      return counts;
    },
    {} as Record<LinkStatus, number>
  );

  const favoritesCount = countSourceLinks.filter(
    (link) => link.isFavorite
  ).length;

  return (
    <>
      <section className="border-border h-full w-full space-y-4 pb-24 lg:border-l lg:pl-6">
        <LinksToolbar
          filters={filters}
          statusCounts={statusCounts}
          filteredLinkCount={links.length}
          favoritesCount={favoritesCount}
        />

        {/* <h2 className="text-2xl font-medium tracking-tight">
          Shared Research Vault
        </h2> */}

        {links.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-1">
            {links.map((link) => (
              <ResearchLinkCard key={link.id} {...link} />
            ))}
          </div>
        ) : (
          <div className="border-border bg-accent/15 py-4.5 rounded-xl border border-dashed px-4">
            <p className="text-base font-medium">No links yet</p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Add your first research source from the form on the left and it
              will show up here.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
