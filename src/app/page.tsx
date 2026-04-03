import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResearchVault - Home",
  description: "A collection of shared research materials and resources",
};

export default function Home() {
  return (
    <section className="border-border h-full w-full space-y-4 pb-24 lg:border-l lg:pt-24 lg:pl-6">
      <h2 className="text-2xl font-medium tracking-tight">
        The link list will go here
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="border-border bg-primary/2 flex flex-col items-start gap-1.5 rounded-lg border px-3 py-2"
          >
            <h5 className="text-lg font-medium tracking-tight">
              List item {i + 1}
            </h5>
            <p className="text-sm">Link Description</p>
          </div>
        ))}
      </div>
    </section>
  );
}
