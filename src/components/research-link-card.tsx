import { ExternalLink, FolderKanban } from "lucide-react";
import type { LinkCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ResearchLinkCardProps = {
  title: string;
  url: string;
  notes: string;
  category: LinkCategory;
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

function toDate(createdAt: Date | string): Date {
  return typeof createdAt === "string" ? new Date(createdAt) : createdAt;
}

export function ResearchLinkCard({
  title,
  url,
  notes,
  category,
  createdAt,
  className,
}: ResearchLinkCardProps) {
  const date = toDate(createdAt);

  return (
    <article
      className={cn(
        "border-border bg-card flex flex-col gap-3.5 rounded-2xl border p-6",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className="bg-primary/10 border-primary/35 text-primary inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium">
          <FolderKanban className="size-3.5 shrink-0" aria-hidden />
          {category}
        </span>
        <time
          dateTime={date.toISOString()}
          className="text-muted-foreground text-xs tabular-nums"
        >
          {dateFormatter.format(date)}
        </time>
      </div>

      <h3 className="text-balance text-xl font-medium tracking-tight">
        {title}
      </h3>

      <p className="flex min-w-0 items-center gap-1.5">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary min-w-0 flex-1 truncate text-sm font-medium underline underline-offset-2"
        >
          {url}
        </a>
        <ExternalLink className="text-primary size-3.5 shrink-0" aria-hidden />
      </p>

      {notes ? (
        <p className="text-muted-foreground line-clamp-1 text-sm leading-snug">
          {notes}
        </p>
      ) : null}
    </article>
  );
}
