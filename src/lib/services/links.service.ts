import { ObjectId, type Sort } from "mongodb";
import {
  findLinks,
  insertLink,
  findAllLinksMinimal,
  updateLinkById,
  deleteLinkById,
  type LinkDocument,
} from "@/lib/schemas/links";

import { isValidCategory } from "@/lib/schemas/categories";
import { isValidStatus } from "@/lib/schemas/statuses";

import {
  DEFAULT_LINK_SORT,
  DEFAULT_LINK_STATUS,
  type DuplicateWarning,
  type LinkFilters,
  type LinkItem,
  type LinkSort,
} from "@/lib/types";

import { normalizeUrl, type NormalizedLinkInput } from "@/lib/validation";

function toDate(value: Date | string | undefined, fallback: Date) {
  if (value instanceof Date) return value;

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return fallback;
}

function toLinkItem(document: LinkDocument & { _id: ObjectId }): LinkItem {
  const createdAt = toDate(document.createdAt, new Date());
  const updatedAt = toDate(document.updatedAt, createdAt);

  return {
    id: document._id.toHexString(),
    url: document.url,
    title: document.title,
    notes: document.notes,
    category: document.category as LinkItem["category"],
    tags: document.tags ?? [],
    status: (document.status ?? DEFAULT_LINK_STATUS) as LinkItem["status"],
    isFavorite: Boolean(document.isFavorite),
    normalizedUrl: document.normalizedUrl ?? normalizeUrl(document.url),
    createdAt,
    updatedAt,
  };
}

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSort(sort: LinkSort): Sort {
  switch (sort) {
    case "oldest":
      return { createdAt: 1 };
    case "title-asc":
      return { title: 1 };
    case "title-desc":
      return { title: -1 };
    case "newest":
    default:
      return { updatedAt: -1, createdAt: -1 };
  }
}

function buildFiltersQuery(filters: Partial<LinkFilters>) {
  const clauses: Record<string, unknown>[] = [];

  if (filters.search?.trim()) {
    const pattern = new RegExp(escapeForRegex(filters.search), "i");
    clauses.push({
      $or: [{ title: pattern }, { notes: pattern }, { tags: pattern }],
    });
  }

  if (filters.category?.trim()) {
    clauses.push({ category: filters.category });
  }

  if (filters.tag?.trim()) {
    clauses.push({
      tags: {
        $elemMatch: {
          $regex: new RegExp(`^${escapeForRegex(filters.tag)}$`, "i"),
        },
      },
    });
  }

  if (filters.status?.trim()) {
    clauses.push({ status: filters.status });
  }

  if (filters.favorite === "true") {
    clauses.push({ isFavorite: true });
  }

  if (clauses.length === 0) return {};
  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

async function findDuplicateWarning(normalizedUrl: string) {
  const documents = await findAllLinksMinimal();

  const duplicate = documents.find((doc) => {
    const candidate = doc.normalizedUrl ?? normalizeUrl(doc.url);
    return candidate.includes(normalizedUrl);
  });

  if (!duplicate?._id) return null;

  const existing = toLinkItem(duplicate as LinkDocument & { _id: ObjectId });

  const warning: DuplicateWarning = {
    message: `Saved successfully, but a similar research URL already exists: ${existing.title}.`,
    existingLink: {
      id: existing.id,
      title: existing.title,
      url: existing.url,
      status: existing.status,
      isFavorite: existing.isFavorite,
      createdAt: existing.createdAt,
    },
  };

  return warning;
}

export function buildLinkDocument(data: NormalizedLinkInput) {
  const now = new Date();

  return {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listLinks(
  filters: Partial<LinkFilters> = {}
): Promise<LinkItem[]> {
  const sort = buildSort(filters.sort ?? DEFAULT_LINK_SORT);
  const documents = await findLinks(buildFiltersQuery(filters), sort);

  return documents.map((doc) =>
    toLinkItem(doc as LinkDocument & { _id: ObjectId })
  );
}

export async function createLink(data: NormalizedLinkInput) {
  if (!(await isValidCategory(data.category))) {
    throw new Error("Invalid category");
  }

  if (!(await isValidStatus(data.status))) {
    throw new Error("Invalid status");
  }

  const duplicateWarning = await findDuplicateWarning(data.normalizedUrl);
  const document = buildLinkDocument(data);

  const result = await insertLink(document);

  return {
    link: {
      id: result.insertedId.toHexString(),
      ...document,
    },
    duplicateWarning,
  };
}

export function isValidLinkId(id: string) {
  return ObjectId.isValid(id);
}

export async function updateLink(id: string, data: NormalizedLinkInput) {
  if (!(await isValidCategory(data.category))) {
    throw new Error("Invalid category");
  }

  if (!(await isValidStatus(data.status))) {
    throw new Error("Invalid status");
  }

  const objectId = new ObjectId(id);

  const result = await updateLinkById(objectId, {
    ...data,
    updatedAt: new Date(),
  });

  return result ? toLinkItem(result as LinkDocument & { _id: ObjectId }) : null;
}

export async function deleteLink(id: string) {
  const result = await deleteLinkById(new ObjectId(id));
  return result.deletedCount > 0;
}
