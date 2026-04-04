"use client";

import { FilePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  EditResearchLinkDialog,
  type EditResearchLinkSnapshot,
} from "@/components/edit-research-link-dialog";
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
          body && typeof body === "object" && "error" in body
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

  return (
    <>
      <div className="flex shrink-0 items-center gap-2">
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
