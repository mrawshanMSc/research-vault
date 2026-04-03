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
        "flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#1a1a1a] p-6 text-[#d1d5db] shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/35 bg-[#1e293b] px-2.5 py-1 text-sm font-medium text-blue-500">
          <FolderKanban className="size-3.5 shrink-0" aria-hidden />
          {category}
        </span>
        <time
          dateTime={date.toISOString()}
          className="text-sm tabular-nums text-[#9ca3af]"
        >
          {dateFormatter.format(date)}
        </time>
      </div>

      <h3 className="text-balance text-xl font-semibold tracking-tight text-white">
        {title}
      </h3>

      <p className="flex min-w-0 items-center gap-1.5">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 truncate text-sm font-medium text-[#3b82f6] underline underline-offset-2"
        >
          {url}
        </a>
        <ExternalLink
          className="size-3.5 shrink-0 text-[#3b82f6]"
          aria-hidden
        />
      </p>

      {notes ? (
        <p className="line-clamp-1 text-sm leading-snug text-[#d1d5db]">
          {notes}
        </p>
      ) : null}
    </article>
  );
}
