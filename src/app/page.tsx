import type { Metadata } from "next";
import {
  ResearchLinkCard,
  type ResearchLinkCardProps,
} from "@/components/research-link-card";

export const metadata: Metadata = {
  title: "ResearchVault - Home",
  description: "A collection of shared research materials and resources",
};

// TODO: Remove this once the links are fetched from the database
const demoLinks: ResearchLinkCardProps[] = [
  {
    title: "MongoDB",
    url: "https://cloud.mongodb.com/v2/69c76a439f1af2c7e8b9d0a1b2c3d4e5f",
    notes: "This is just a test POST",
    category: "Other",
    createdAt: new Date("2026-03-28T19:56:00"),
  },
  {
    title: "Understanding distributed systems",
    url: "https://example.com/papers/distributed-systems",
    notes: "Survey paper — good overview of consensus and fault tolerance.",
    category: "Journal Article",
    createdAt: new Date("2026-03-15T10:30:00"),
  },
  {
    title: "Dataset: Global weather indices",
    url: "https://research.example.org/datasets/weather-2024.csv",
    notes: "CSV exports, monthly aggregates.",
    category: "Dataset",
    createdAt: new Date("2026-02-01T08:00:00"),
  },
  {
    title: "Research tools roundup",
    url: "https://github.com/example/awesome-research-tools",
    notes: "Curated list of citation managers and PDF workflows.",
    category: "Tool",
    createdAt: new Date("2026-01-20T14:45:00"),
  },
];

export default function Home() {
  return (
    <section className="border-border h-full w-full space-y-4 pb-24 lg:border-l lg:pl-6 lg:pt-24">
      <h2 className="text-2xl font-medium tracking-tight">
        The link list will go here
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {demoLinks.map((link) => (
          <ResearchLinkCard key={link.url} {...link} />
        ))}
      </div>
    </section>
  );
}
