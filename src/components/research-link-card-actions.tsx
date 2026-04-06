"use client";

import { FilePen, Loader2Icon, StarIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  EditResearchLinkDialog,
  type EditResearchLinkSnapshot,
} from "@/components/edit-research-link-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DEFAULT_LINK_STATUS,
  LINK_STATUSES,
  type LinkStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export type ResearchLinkCardActionsProps = {
  link: EditResearchLinkSnapshot;
};

export function ResearchLinkCardActions({
  link,
}: ResearchLinkCardActionsProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(Boolean(link.isFavorite));
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [status, setStatus] = useState<LinkStatus>(
    link.status ?? DEFAULT_LINK_STATUS
  );
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    setIsFavorite(Boolean(link.isFavorite));
  }, [link.id, link.isFavorite]);

  useEffect(() => {
    setStatus(link.status ?? DEFAULT_LINK_STATUS);
  }, [link.id, link.status]);

  const persistLink = async (
    patch: Partial<{ status: LinkStatus; isFavorite: boolean }>
  ) => {
    const res = await fetch(`/api/links/${encodeURIComponent(link.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: link.url,
        title: link.title,
        notes: link.notes,
        category: link.category,
        tags: link.tags ?? [],
        status: patch.status ?? status,
        isFavorite:
          patch.isFavorite !== undefined ? patch.isFavorite : isFavorite,
      }),
    });
    return res;
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/links/${encodeURIComponent(link.id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body && typeof body === "object" && "message" in body
            ? String((body as { message: unknown }).message)
            : body && typeof body === "object" && "error" in body
              ? String((body as { error: unknown }).error)
              : "Could not remove this link.";
        toast.error("Delete failed", { description: message });
        return;
      }

      toast.success("Link removed", {
        description: "The item was removed from the shared vault.",
      });
      setConfirmOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Handle toggle favorite (full PATCH so updateLink validates & persists)
  const handleToggleFavorite = async () => {
    setFavoriteLoading(true);
    try {
      const res = await persistLink({ isFavorite: !isFavorite });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          body && typeof body === "object" && "message" in body
            ? String((body as { message: unknown }).message)
            : "Could not update favorite.";
        toast.error("Favorite failed", { description: message });
        return;
      }

      const next =
        body &&
        typeof body === "object" &&
        "link" in body &&
        body.link &&
        typeof body.link === "object" &&
        "isFavorite" in body.link
          ? Boolean((body.link as { isFavorite: unknown }).isFavorite)
          : !isFavorite;

      setIsFavorite(next);
      toast.success(next ? "Added to favorites" : "Removed from favorites");
      router.refresh();
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (next: LinkStatus) => {
    if (next === status) return;
    const previous = status;
    setStatus(next);
    setStatusSaving(true);
    try {
      const res = await persistLink({ status: next });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus(previous);
        const message =
          body && typeof body === "object" && "message" in body
            ? String((body as { message: unknown }).message)
            : "Could not update status.";
        toast.error("Status failed", { description: message });
        return;
      }

      toast.success("Status updated", {
        description: `Set to “${next}”.`,
      });
      router.refresh();
    } catch {
      setStatus(previous);
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <>
      <div className="flex w-full min-w-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
        >
          <FilePen className="size-3.5 stroke-[1.5]" aria-hidden />
          Edit
        </Button>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="size-3.5 stroke-[1.5]" aria-hidden />
          Delete
        </Button>

        <div className="ml-auto flex min-w-0 shrink-0 flex-row flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={favoriteLoading}
            className="border-border bg-background text-foreground shrink-0 rounded-full font-normal shadow-none"
            onClick={handleToggleFavorite}
          >
            {favoriteLoading ? (
              <Loader2Icon
                className="size-3.5 shrink-0 animate-spin stroke-[1.5]"
                aria-hidden
              />
            ) : (
              <StarIcon
                className={cn(
                  "size-3.5 shrink-0 stroke-[1.5]",
                  isFavorite && "fill-primary text-primary"
                )}
                aria-hidden
              />
            )}
            {isFavorite ? "Favorited" : "Mark Favorite"}
          </Button>

          <Select
            value={status}
            onValueChange={(value) => handleStatusChange(value as LinkStatus)}
            disabled={statusSaving || favoriteLoading}
          >
            <SelectTrigger
              size="sm"
              aria-label="Reading status"
              className={cn(
                "border-border text-foreground h-8 w-auto min-w-44 justify-between rounded-lg bg-white font-normal shadow-none sm:min-w-48",
                "dark:bg-background"
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="z-70 border-border text-foreground dark:bg-background bg-white"
            >
              <SelectGroup>
                {LINK_STATUSES.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="data-highlighted:bg-neutral-100 dark:data-highlighted:bg-muted data-[state=checked]:font-medium"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Edit dialog */}
      <EditResearchLinkDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        link={link}
      />

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open && deleting) return;
          setConfirmOpen(open);
        }}
      >
        <DialogContent
          showCloseButton={!deleting}
          className=""
          onPointerDownOutside={(e) => deleting && e.preventDefault()}
          onEscapeKeyDown={(e) => deleting && e.preventDefault()}
        >
          <DialogHeader className="gap-2 pr-8">
            <DialogTitle className="text-lg font-medium leading-snug tracking-tight">
              Delete this link?
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              This removes{" "}
              <strong className="text-foreground font-medium">
                {link.title}
              </strong>{" "}
              from the shared vault. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={deleting}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deleting}
              onClick={handleConfirmDelete}
            >
              {deleting ? "Deleting..." : "Delete link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
