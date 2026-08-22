"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type DeleteEntityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
};

export function DeleteEntityDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: DeleteEntityDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function run() {
    setDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // The caller has already reported it; keep the dialog open so the user
      // can retry or cancel.
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !deleting && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleting}
            className="border-border bg-transparent hover:bg-foreground/5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            // AlertDialogAction closes on click by default, which would tear the
            // dialog down before the request resolves. Drive the close ourselves.
            onClick={(event) => {
              event.preventDefault();
              void run();
            }}
            disabled={deleting}
            aria-busy={deleting}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {deleting && <Spinner />}
            {deleting ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
