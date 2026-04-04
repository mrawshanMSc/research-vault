import type { Metadata } from "next";
import { connection } from "next/server";
import { ResearchLinkCard } from "@/components/research-link-card";
import { listLinks } from "@/lib/schemas/links";

export const metadata: Metadata = {
  title: "ResearchVault - Home",
  description:
    "Browse the latest saved research links, notes, and categories in the vault.",
};

async function getLinks() {
  await connection();
  return listLinks();
}

export default async function Home() {
  const links = await getLinks();

  return (
    <section className="border-border h-full w-full space-y-4 pb-24 lg:border-l lg:pl-6 lg:pt-24">
      <h2 className="text-2xl font-medium tracking-tight">
        Shared Research Vault
      </h2>
      {links.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link) => (
            <ResearchLinkCard key={link.id} {...link} />
          ))}
        </div>
      ) : (
        <div className="border-border bg-accent/10 py-5.5 rounded-lg border border-dashed px-5">
          <p className="text-base font-medium">No links yet</p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Add your first research source from the form on the left and it will
            show up here.
          </p>
        </div>
      )}
    </section>
  );
}
