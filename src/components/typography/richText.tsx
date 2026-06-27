import { cn } from "@/lib/utils";

export function Emphasis({ className, children }: React.ComponentProps<"strong">) {
  return (
    <strong
      className={cn(
        "font-semibold text-foreground [text-shadow:0_0_12px_rgba(234,251,255,0.45)]",
        className
      )}
    >
      {children}
    </strong>
  );
}

export const richTextTags = {
  em: (chunks: React.ReactNode) => <Emphasis>{chunks}</Emphasis>,
};
