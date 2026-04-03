import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import * as linksModule from "@/lib/links";

vi.mock("@/lib/links");

describe("GET /api/links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all links successfully", async () => {
    const mockLinks = [
      {
        id: "1",
        url: "https://example.com",
        title: "Example",
        notes: "Test",
        category: "Journal Article",
        createdAt: new Date(),
      },
    ];

    vi.spyOn(linksModule, "listLinks").mockResolvedValue(mockLinks);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([
      {
        ...mockLinks[0],
        createdAt: mockLinks[0].createdAt.toISOString(),
      },
    ]);
  });

  it("should return 500 if fetching links fails", async () => {
    vi.spyOn(linksModule, "listLinks").mockRejectedValue(new Error("DB error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: "Failed to fetch links",
    });
  });
});