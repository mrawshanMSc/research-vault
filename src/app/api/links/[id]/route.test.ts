import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH, DELETE } from "./route";
import * as linksModule from "@/lib/services/links.service";
import * as validationModule from "@/lib/validation";

const mockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe("PATCH /api/links/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validId = "507f1f77bcf86cd799439011";

  it("should update a link successfully", async () => {
    const mockInput = {
      url: "https://example.com",
      title: "Updated",
      notes: "Test",
      category: "Journal Article" as const,
      tags: [],
      status: "To Read" as const,
      isFavorite: false,
      normalizedUrl: "example.com/",
    };

    const mockUpdatedLink = {
      id: validId,
      ...mockInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(linksModule, "isValidLinkId").mockReturnValue(true);

    vi.spyOn(validationModule, "validateLinkInput").mockReturnValue({
      data: mockInput,
      errors: {},
    });

    vi.spyOn(linksModule, "updateLink").mockResolvedValue(mockUpdatedLink);

    const request = new Request("http://localhost/api/links/" + validId, {
      method: "PATCH",
      body: JSON.stringify(mockInput),
    });

    const response = await PATCH(request, mockContext(validId));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: "Research link updated.",
      link: {
        ...mockUpdatedLink,
        createdAt: mockUpdatedLink.createdAt.toISOString(),
        updatedAt: mockUpdatedLink.updatedAt.toISOString(),
      },
    });
  });

  it("should return 400 for invalid id", async () => {
    vi.spyOn(linksModule, "isValidLinkId").mockReturnValue(false);

    const request = new Request("http://localhost/api/links/bad-id", {
      method: "PATCH",
      body: JSON.stringify({}),
    });

    const response = await PATCH(request, mockContext("bad-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ message: "Invalid link id." });
  });

  it("should return 400 if validation fails", async () => {
    vi.spyOn(linksModule, "isValidLinkId").mockReturnValue(true);

    vi.spyOn(validationModule, "validateLinkInput").mockReturnValue({
      data: null,
      errors: {
        url: "A research URL is required.",
      },
    });

    const request = new Request("http://localhost/api/links/" + validId, {
      method: "PATCH",
      body: JSON.stringify({}),
    });

    const response = await PATCH(request, mockContext(validId));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: {
        url: "A research URL is required.",
      },
    });
  });

  it("should return 404 if link not found", async () => {
    vi.spyOn(linksModule, "isValidLinkId").mockReturnValue(true);

    vi.spyOn(validationModule, "validateLinkInput").mockReturnValue({
      data: {
        url: "https://example.com",
        title: "Test",
        notes: "",
        category: "Journal Article",
        tags: [],
        status: "To Read",
        isFavorite: false,
        normalizedUrl: "example.com/",
      },
      errors: {},
    });

    vi.spyOn(linksModule, "updateLink").mockResolvedValue(null);

    const request = new Request("http://localhost/api/links/" + validId, {
      method: "PATCH",
      body: JSON.stringify({}),
    });

    const response = await PATCH(request, mockContext(validId));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ message: "Link not found." });
  });

  it("should return 500 if update fails", async () => {
    vi.spyOn(linksModule, "isValidLinkId").mockReturnValue(true);

    vi.spyOn(validationModule, "validateLinkInput").mockReturnValue({
      data: {
        url: "https://example.com",
        title: "Test",
        notes: "",
        category: "Journal Article",
        tags: [],
        status: "To Read",
        isFavorite: false,
        normalizedUrl: "example.com/",
      },
      errors: {},
    });

    vi.spyOn(linksModule, "updateLink").mockRejectedValue(() => {});

    const request = new Request("http://localhost/api/links/" + validId, {
      method: "PATCH",
      body: JSON.stringify({}),
    });

    const response = await PATCH(request, mockContext(validId));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message: "The link could not be updated right now.",
    });
  });
});

describe("DELETE /api/links/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validId = "507f1f77bcf86cd799439011";

  it("should delete a link successfully", async () => {
    vi.spyOn(linksModule, "isValidLinkId").mockReturnValue(true);
    vi.spyOn(linksModule, "deleteLink").mockResolvedValue(true);

    const request = new Request("http://localhost/api/links/" + validId, {
      method: "DELETE",
    });

    const response = await DELETE(request, mockContext(validId));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: "Research link deleted.",
    });
  });

  it("should return 400 for invalid id", async () => {
    vi.spyOn(linksModule, "isValidLinkId").mockReturnValue(false);

    const request = new Request("http://localhost/api/links/bad-id", {
      method: "DELETE",
    });

    const response = await DELETE(request, mockContext("bad-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ message: "Invalid link id." });
  });

  it("should return 404 if link not found", async () => {
    vi.spyOn(linksModule, "isValidLinkId").mockReturnValue(true);
    vi.spyOn(linksModule, "deleteLink").mockResolvedValue(false);

    const request = new Request("http://localhost/api/links/" + validId, {
      method: "DELETE",
    });

    const response = await DELETE(request, mockContext(validId));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ message: "Link not found." });
  });

  it("should return 500 if delete fails", async () => {
    vi.spyOn(linksModule, "isValidLinkId").mockReturnValue(true);
    vi.spyOn(linksModule, "deleteLink").mockRejectedValue(() => {});

    const request = new Request("http://localhost/api/links/" + validId, {
      method: "DELETE",
    });

    const response = await DELETE(request, mockContext(validId));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message: "The link could not be deleted right now.",
    });
  });
});
