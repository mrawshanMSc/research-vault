import { ExternalLink, FolderKanban } from "lucide-react";
import { ResearchLinkCardActions } from "@/components/research-link-card-actions";
import type { LinkCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ResearchLinkCardProps = {
  id: string;
  title: string;
  url: string;
  notes: string;
  category: LinkCategory;
  tags?: string[];
  createdAt: Date | string;
  className?: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function toDate(createdAt: Date | string | undefined): Date | null {
  if (!createdAt) return null;
  return typeof createdAt === "string" ? new Date(createdAt) : createdAt;
}

export function ResearchLinkCard({
  id,
  title,
  url,
  notes,
  category,
  tags = [],
  createdAt,
  className,
}: ResearchLinkCardProps) {
  const date = toDate(createdAt);

  return (
    <article
      className={cn(
        "border-border bg-card hover:bg-primary/2 py-5.5 flex w-full min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border px-5 transition-colors duration-300 ease-in-out",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        {category && (
          <span className="bg-primary/10 border-primary/35 text-primary inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium">
            <FolderKanban className="size-3.5 shrink-0" aria-hidden />
            {category}
          </span>
        )}

        {date && !isNaN(date.getTime()) && (
          <time
            dateTime={date.toISOString()}
            className="text-muted-foreground text-xs tabular-nums"
          >
            {dateFormatter.format(date)}
          </time>
        )}
      </div>

      <h3 className="text-balance text-xl font-medium tracking-tight">
        {title}
      </h3>

      <p className="-mt-1 flex min-w-0 max-w-full items-center gap-1.5">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary max-w-full truncate break-all text-sm font-medium underline underline-offset-2"
        >
          {url}
        </a>
        <ExternalLink className="text-primary size-3.5 shrink-0" aria-hidden />
      </p>

      <div className="min-w-0 flex-1">
        {notes ? (
          <p className="text-muted-foreground line-clamp-1 text-sm leading-snug">
            {notes}
          </p>
        ) : null}
      </div>

      <div className="border-border pt-4.5 flex items-center gap-3 border-t">
        <ResearchLinkCardActions
          link={{ id, title, url, notes, category, tags }}
        />
      </div>
    </article>
  );
}
