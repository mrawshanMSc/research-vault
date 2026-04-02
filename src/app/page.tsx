import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResearchVault - Home",
  description: "A collection of shared research materials and resources",
};

type Link = {
  _id: string;
  url: string;
  title: string;
  notes?: string;
  category?: string;
  createdAt: string;
};

async function getLinks(): Promise<Link[]> {
  const res = await fetch("http://localhost:3000/api/links", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Error fetching links:", await res.text());
    return [];
  }

  return res.json();
}

export default async function Home() {
  const links = await getLinks();

  return (
    <section className="border-border h-full w-full space-y-6 pb-24 lg:border-l lg:pl-6 lg:pt-24">
      <h2 className="text-2xl font-medium tracking-tight">
        Saved Research Links
      </h2>

      {links.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border p-4 text-sm">
          No links found. Start by adding your first research link.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link) => {
            const formattedDate = new Date(link.createdAt).toLocaleString();

            return (
              <div
                key={link._id}
                id={`link-${link._id}`}
                data-link-id={link._id}
                className="border-border bg-primary/2 flex flex-col gap-2 rounded-lg border p-4 transition hover:shadow-sm"
              >
                {/* Title */}
                <h5 className="text-lg font-semibold tracking-tight">
                  {link.title}
                </h5>

                {/* URL */}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-blue-500 hover:underline"
                >
                  {link.url}
                </a>

                {/* Notes */}
                {link.notes && (
                  <p className="text-muted-foreground line-clamp-3 text-sm">
                    {link.notes}
                  </p>
                )}

                {/* Category + Date */}
                <div className="mt-2 flex items-center justify-between">
                  {link.category && (
                    <span className="w-fit rounded bg-gray-200 px-2 py-1 text-xs">
                      {link.category}
                    </span>
                  )}

                  <span className="text-muted-foreground text-xs">
                    {formattedDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
