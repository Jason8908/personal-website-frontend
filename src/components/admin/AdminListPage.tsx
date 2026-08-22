"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { CollectionStatus } from "@/components/admin/useAdminCollection";

type AdminListPageProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  status: CollectionStatus;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  onRetry: () => void;
  children: React.ReactNode;
};

/**
 * The chrome every admin list screen shares: heading, primary action, and the
 * loading / error / empty switch. Purely presentational.
 */
export function AdminListPage({
  title,
  description,
  actionLabel,
  onAction,
  status,
  isEmpty,
  emptyTitle,
  emptyDescription,
  onRetry,
  children,
}: AdminListPageProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <Button
          onClick={onAction}
          className="bg-foreground text-background hover:bg-foreground/85"
        >
          <Plus />
          {actionLabel}
        </Button>
      </div>

      {status === "loading" && (
        <div className="flex justify-center py-20">
          <Spinner className="size-8 text-muted-foreground" />
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">Couldn&apos;t load this list</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            variant="outline"
            onClick={onRetry}
            className="mt-4 border-border bg-transparent hover:bg-foreground/5"
          >
            Try again
          </Button>
        </div>
      )}

      {status === "ready" && isEmpty && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">{emptyTitle}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{emptyDescription}</p>
        </div>
      )}

      {status === "ready" && !isEmpty && <div className="space-y-4">{children}</div>}
    </div>
  );
}
