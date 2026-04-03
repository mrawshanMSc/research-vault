import type { Metadata } from "next";
import { ResearchLinkCard } from "@/components/research-link-card";

export const metadata: Metadata = {
  title: "ResearchVault - Home",
  description: "A collection of shared research materials and resources",
};

async function getLinks() {
  const res = await fetch("http://localhost:3000/api/links", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch links");
  }

  return res.json();
}

export default async function Home() {
  const links = await getLinks();

  return (
    <section className="border-border h-full w-full space-y-4 pb-24 lg:border-l lg:pl-6 lg:pt-24">
      <h2 className="text-2xl font-medium tracking-tight">
        Shared Research Vault
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {links.map((link: any) => (
          <ResearchLinkCard key={link.id} {...link} />
        ))}
      </div>
    </section>
  );
}
