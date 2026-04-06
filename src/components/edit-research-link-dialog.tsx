"use client";

import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { LinkFieldErrors } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { LinkCategory, LinkStatus } from "@/lib/types";
import { DEFAULT_LINK_STATUS, LINK_CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

const modalFieldClass = "";

export type EditResearchLinkSnapshot = {
  id: string;
  url: string;
  title: string;
  notes: string;
  category: LinkCategory;
  tags: string[];
  status?: LinkStatus;
  isFavorite?: boolean;
};

type EditResearchLinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: EditResearchLinkSnapshot;
};

export function EditResearchLinkDialog({
  open,
  onOpenChange,
  link,
}: EditResearchLinkDialogProps) {
  const router = useRouter();
  const linkRef = useRef(link);

  // Update the link reference when the link prop changes
  useEffect(() => {
    linkRef.current = link;
  }, [link]);

  const [url, setUrl] = useState(link.url);
  const [title, setTitle] = useState(link.title);
  const [category, setCategory] = useState<string>(link.category);
  const [notes, setNotes] = useState(link.notes);
  const [tags, setTags] = useState<string[]>(link.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LinkFieldErrors>({});

  useEffect(() => {
    if (!open) return;
    const l = linkRef.current;
    setUrl(l.url);
    setTitle(l.title);
    setCategory(l.category);
    setNotes(l.notes);
    setTags([...(l.tags ?? [])]);
    setTagInput("");
    setFieldErrors({});
  }, [open]);

  const commitTagsFromInput = () => {
    const parts = tagInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    setTags((prev) => {
      const next = new Set([...prev, ...parts]);
      return [...next];
    });
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTagsFromInput();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const draftTags = tagInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tagsPayload =
      draftTags.length === 0 ? tags : [...new Set([...tags, ...draftTags])];

    setSaving(true);
    setFieldErrors({});

    try {
      const res = await fetch(`/api/links/${encodeURIComponent(link.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          title,
          notes,
          category,
          tags: tagsPayload,
          status: linkRef.current.status ?? DEFAULT_LINK_STATUS,
          isFavorite: Boolean(linkRef.current.isFavorite),
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        if (
          res.status === 400 &&
          body &&
          typeof body === "object" &&
          "fieldErrors" in body &&
          body.fieldErrors &&
          typeof body.fieldErrors === "object" &&
          !Array.isArray(body.fieldErrors)
        ) {
          setFieldErrors(body.fieldErrors as LinkFieldErrors);
        }
        const message =
          body && typeof body === "object" && "message" in body
            ? String((body as { message: unknown }).message)
            : "Could not save changes.";
        toast.error("Update failed", { description: message });
        return;
      }

      setTags(tagsPayload);
      setTagInput("");

      toast.success("Link updated", {
        description: "Your changes have been saved.",
        icon: <CheckIcon className="size-4" aria-hidden />,
      });
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && saving) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={!saving}
        className={cn("md:min-w-2xl")}
        onPointerDownOutside={(e) => saving && e.preventDefault()}
        onEscapeKeyDown={(e) => saving && e.preventDefault()}
      >
        <DialogHeader className="">
          <DialogTitle className="text-lg font-medium leading-snug tracking-tight">
            Edit research link
          </DialogTitle>
          <DialogDescription className="text-muted-foreground -mt-1 text-sm leading-relaxed">
            Update the source details, notes, category, or tags whenever
            something changes.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <form
            id="edit-research-link-form"
            onSubmit={handleSubmit}
            className=""
          >
            <FieldGroup className="gap-5">
              <Field data-invalid={!!fieldErrors.url}>
                <FieldLabel htmlFor="edit-link-url">Research URL</FieldLabel>
                <Input
                  id="edit-link-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  type="url"
                  autoComplete="url"
                  disabled={saving}
                  aria-invalid={!!fieldErrors.url}
                  className={modalFieldClass}
                />
                {fieldErrors.url ? (
                  <FieldError errors={[{ message: fieldErrors.url }]} />
                ) : null}
              </Field>

              <div className="grid gap-5 md:grid-cols-5">
                <div className="md:col-span-3">
                  <Field data-invalid={!!fieldErrors.title}>
                    <FieldLabel htmlFor="edit-link-title">Title</FieldLabel>
                    <Input
                      id="edit-link-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      autoComplete="off"
                      disabled={saving}
                      aria-invalid={!!fieldErrors.title}
                      className={modalFieldClass}
                    />
                    {fieldErrors.title ? (
                      <FieldError errors={[{ message: fieldErrors.title }]} />
                    ) : null}
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field data-invalid={!!fieldErrors.category}>
                    <FieldLabel htmlFor="edit-link-category">
                      Category
                    </FieldLabel>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      disabled={saving}
                    >
                      <SelectTrigger
                        id="edit-link-category"
                        aria-invalid={!!fieldErrors.category}
                        className={cn("w-full", modalFieldClass)}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="z-70">
                        <SelectGroup>
                          {LINK_CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldErrors.category ? (
                      <FieldError
                        errors={[{ message: fieldErrors.category }]}
                      />
                    ) : null}
                  </Field>
                </div>
              </div>

              <Field data-invalid={!!fieldErrors.notes}>
                <FieldLabel htmlFor="edit-link-notes">Notes</FieldLabel>
                <Textarea
                  id="edit-link-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={saving}
                  aria-invalid={!!fieldErrors.notes}
                  className={cn("min-h-28 resize-y", modalFieldClass)}
                  placeholder="Why is this source useful?"
                />
                {fieldErrors.notes ? (
                  <FieldError errors={[{ message: fieldErrors.notes }]} />
                ) : null}
              </Field>

              <Field data-invalid={!!fieldErrors.tags}>
                <FieldLabel htmlFor="edit-link-tags">Tags</FieldLabel>
                <Input
                  id="edit-link-tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={commitTagsFromInput}
                  type="text"
                  autoComplete="off"
                  disabled={saving}
                  aria-invalid={!!fieldErrors.tags}
                  placeholder="Add tags, separate with commas"
                  className={modalFieldClass}
                />
                {fieldErrors.tags ? (
                  <FieldError errors={[{ message: fieldErrors.tags }]} />
                ) : null}
                <p className="mt-1.5 text-xs leading-snug text-neutral-500">
                  Separate tags with commas. Tags help with filtering and faster
                  search.
                </p>
                {tags.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <li key={`${tag}-${i}`}>
                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(i)}
                            className="-mr-0.5 rounded-full p-0.5 text-neutral-500 hover:text-neutral-900"
                            aria-label={`Remove tag ${tag}`}
                          >
                            <XIcon className="size-3" aria-hidden />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Field>
            </FieldGroup>
          </form>
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm" disabled={saving}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="edit-research-link-form"
            size="sm"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
