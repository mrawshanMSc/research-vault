"use client";

import { FilePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog } from "radix-ui";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export type ResearchLinkCardActionsProps = {
  linkId: string;
  linkTitle: string;
  onEdit?: (id: string) => void;
};

export function ResearchLinkCardActions({
  linkId,
  linkTitle,
  onEdit,
}: ResearchLinkCardActionsProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/links/${encodeURIComponent(linkId)}`, {
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
        {/* Edit button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-border text-foreground h-8 rounded-lg border bg-transparent font-normal shadow-none"
          onClick={() => onEdit?.(linkId)}
        >
          <FilePen className="size-3.5 stroke-[1.5]" aria-hidden />
          Edit
        </Button>

        {/* Delete button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-foreground h-8 border-0 px-2 font-normal shadow-none"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="size-3.5 stroke-[1.5]" aria-hidden />
          Delete
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog.Root
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open && deleting) return;
          setConfirmOpen(open);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40" />
          <Dialog.Content
            className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-1/2 top-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-lg outline-none"
            onPointerDownOutside={(e) => deleting && e.preventDefault()}
            onEscapeKeyDown={(e) => deleting && e.preventDefault()}
          >
            <Dialog.Title className="text-lg font-semibold leading-snug tracking-tight">
              Delete this link?
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-relaxed text-neutral-600">
              This removes{" "}
              <strong className="font-semibold text-neutral-900">
                {linkTitle}
              </strong>{" "}
              from the shared vault. This action cannot be undone.
            </Dialog.Description>

            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={deleting}
                  className="border-neutral-300 bg-neutral-100 text-neutral-900 shadow-none hover:bg-neutral-200/80"
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="button"
                size="sm"
                disabled={deleting}
                className="bg-destructive hover:bg-destructive/90 text-white shadow-none"
                onClick={handleConfirmDelete}
              >
                {deleting ? "Deleting…" : "Delete link"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
