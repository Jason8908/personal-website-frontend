import { cn } from "@/lib/utils";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "w-full border-t border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-center px-6 py-6 sm:py-8">
        <p className="text-base sm:text-lg text-foreground/80">
          © 2025 Jason Su. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;