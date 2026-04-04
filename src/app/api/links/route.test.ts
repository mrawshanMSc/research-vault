import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import * as linksModule from "@/lib/links";
import * as validationModule from "@/lib/validation";
import type { NormalizedLinkInput } from "@/lib/validation";

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
        category: "Journal Article" as const,
        tags: [],
        createdAt: new Date(),
      },
    ];

    vi.spyOn(linksModule, "listLinks").mockResolvedValue(mockLinks);

    const request = new Request("http://localhost/api/links");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      links: [
        {
          ...mockLinks[0],
          createdAt: mockLinks[0].createdAt.toISOString(),
        },
      ],
      filters: {
        search: "",
        category: "",
        tag: "",
      },
    });
  });

  it("should return 500 if fetching links fails", async () => {
    vi.spyOn(linksModule, "listLinks").mockRejectedValue(new Error("DB error"));

    const request = new Request("http://localhost/api/links");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message: "Unable to load links right now.",
    });
  });
});

describe("POST /api/links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a link successfully", async () => {
    const mockInput: NormalizedLinkInput = {
      url: "https://example.com",
      title: "Example",
      notes: "Test",
      category: "Journal Article" as const,
      tags: [],
    };

    const mockCreatedLink = {
      id: "1",
      ...mockInput,
      createdAt: new Date(),
    };

    vi.spyOn(validationModule, "validateLinkInput").mockReturnValue({
      // vi.mocked(validationModule).validateLinkInput = vi.fn().mockReturnValue({
      data: mockInput,
      errors: {},
    });

    vi.spyOn(linksModule, "createLink").mockResolvedValue(mockCreatedLink);

    const request = new Request("http://localhost/api/links", {
      method: "POST",
      body: JSON.stringify(mockInput),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({
      ...mockCreatedLink,
      createdAt: mockCreatedLink.createdAt.toISOString(),
    });
  });

  it("should return 400 if validation fails", async () => {
    const mockInput = {
      url: "",
      title: "",
      notes: "",
      category: "",
    };

    vi.spyOn(validationModule, "validateLinkInput").mockReturnValue({
      // vi.mocked(validationModule).validateLinkInput = vi.fn().mockReturnValue({
      data: null,
      errors: {
        url: "A research URL is required.",
      },
    });

    const request = new Request("http://localhost/api/links", {
      method: "POST",
      body: JSON.stringify(mockInput),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      errors: {
        url: "A research URL is required.",
      },
    });
  });

  it("should return 500 if creating link fails", async () => {
    const mockInput: NormalizedLinkInput = {
      url: "https://example.com",
      title: "Example",
      notes: "Test",
      category: "Journal Article" as const,
      tags: [],
    };

    vi.spyOn(validationModule, "validateLinkInput").mockReturnValue({
      // vi.mocked(validationModule).validateLinkInput = vi.fn().mockReturnValue({
      data: mockInput,
      errors: {},
    });

    vi.spyOn(linksModule, "createLink").mockRejectedValue(
      new Error("DB error")
    );

    const request = new Request("http://localhost/api/links", {
      method: "POST",
      body: JSON.stringify(mockInput),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: "Failed to create link",
    });
  });
});
