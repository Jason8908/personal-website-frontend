"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type AdminFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

/**
 * Dialog chrome for the entity forms: header, scrollable body, footer actions.
 * The form state, schema and submit logic stay with each entity.
 */
export function AdminFormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  submitting,
  onSubmit,
  children,
}: AdminFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[85svh] flex-col gap-0 p-0 sm:max-w-xl"
        // A stray click outside shouldn't destroy a half-filled form.
        // Escape, Cancel and the X still close.
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader className="space-y-1.5 border-b border-border px-6 py-5 text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>

          <DialogFooter className="gap-2 border-t border-border px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="border-border bg-transparent hover:bg-foreground/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="bg-foreground text-background hover:bg-foreground/85"
            >
              {submitting && <Spinner />}
              {submitting ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
