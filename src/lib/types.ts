export type LinkCategory =
  | "Journal Article"
  | "Book"
  | "Video"
  | "Dataset"
  | "Tool"
  | "Other";

export type LinkStatus = "To Read" | "Reading" | "Reviewed" | "Important";

export type LinkSort = "newest" | "oldest" | "title-asc" | "title-desc";

export type LinkInput = {
  url: string;
  title: string;
  notes: string;
  category: string;
  tags: string[];
  status: string;
  isFavorite: boolean;
};

export type LinkItem = {
  id: string;
  url: string;
  title: string;
  notes: string;
  category: LinkCategory;
  tags: string[];
  status: LinkStatus;
  isFavorite: boolean;
  normalizedUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateLinkInput = LinkInput;

export type UpdateLinkInput = LinkInput;

export type LinkFilters = {
  search: string;
  category: string;
  tag: string;
  status: string;
  favorite: string;
  sort: LinkSort;
};

export type DuplicateWarning = {
  message: string;
  existingLink: Pick<
    LinkItem,
    "id" | "title" | "url" | "status" | "isFavorite" | "createdAt"
  >;
};

const DEFAULT_CATEGORIES: LinkCategory[] = [
  "Journal Article",
  "Book",
  "Video",
  "Dataset",
  "Tool",
  "Other",
];

const DEFAULT_STATUSES: LinkStatus[] = [
  "To Read",
  "Reading",
  "Reviewed",
  "Important",
];

let runtimeCategories: LinkCategory[] = [...DEFAULT_CATEGORIES];
let runtimeStatuses: LinkStatus[] = [...DEFAULT_STATUSES];

export function getLinkCategories(): LinkCategory[] {
  return runtimeCategories;
}

export function getLinkStatuses(): LinkStatus[] {
  return runtimeStatuses;
}

export function setLinkMeta(options: {
  categories?: string[];
  statuses?: string[];
}) {
  if (options.categories) {
    runtimeCategories = options.categories.filter((c): c is LinkCategory =>
      DEFAULT_CATEGORIES.includes(c as LinkCategory)
    );
  }

  if (options.statuses) {
    runtimeStatuses = options.statuses.filter((s): s is LinkStatus =>
      DEFAULT_STATUSES.includes(s as LinkStatus)
    );
  }
}

export const LINK_CATEGORIES = DEFAULT_CATEGORIES;
export const LINK_STATUSES = DEFAULT_STATUSES;

export const LINK_SORT_OPTIONS: Array<{
  label: string;
  value: LinkSort;
}> = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Oldest",
    value: "oldest",
  },
  {
    label: "Title A-Z",
    value: "title-asc",
  },
  {
    label: "Title Z-A",
    value: "title-desc",
  },
];

export const DEFAULT_LINK_STATUS: LinkStatus = "To Read";

export const DEFAULT_LINK_SORT: LinkSort = "newest";
