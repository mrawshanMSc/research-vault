import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import * as linksModule from "@/lib/schemas/links";
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
        status: "To Read" as const,
        isFavorite: false,
        normalizedUrl: "example.com/",
        createdAt: new Date(),
        updatedAt: new Date(),
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
          updatedAt: mockLinks[0].updatedAt.toISOString(),
        },
      ],
      filters: {
        search: "",
        category: "",
        tag: "",
        status: "",
        favorite: "",
        sort: "newest",
      },
    });
  });

  it("should return 500 if fetching links fails", async () => {
    vi.spyOn(linksModule, "listLinks").mockRejectedValue(() => {});

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
      status: "To Read",
      isFavorite: false,
      normalizedUrl: "example.com/",
    };

    const mockCreatedLink = {
      id: "1",
      ...mockInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(validationModule, "validateLinkInput").mockReturnValue({
      data: mockInput,
      errors: {},
    });

    vi.spyOn(linksModule, "createLink").mockResolvedValue({
      link: mockCreatedLink,
      duplicateWarning: null,
    });

    const request = new Request("http://localhost/api/links", {
      method: "POST",
      body: JSON.stringify(mockInput),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({
      message: "Research link saved to the vault.",
      link: {
        ...mockCreatedLink,
        createdAt: mockCreatedLink.createdAt.toISOString(),
        updatedAt: mockCreatedLink.updatedAt.toISOString(),
      },
      duplicateWarning: null,
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
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: {
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
      status: "To Read",
      isFavorite: false,
      normalizedUrl: "example.com/",
    };

    vi.spyOn(validationModule, "validateLinkInput").mockReturnValue({
      data: mockInput,
      errors: {},
    });

    vi.spyOn(linksModule, "createLink").mockRejectedValue(() => {});

    const request = new Request("http://localhost/api/links", {
      method: "POST",
      body: JSON.stringify(mockInput),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message:
        "The link could not be saved right now. Check your MongoDB env vars and try again.",
    });
  });
});
