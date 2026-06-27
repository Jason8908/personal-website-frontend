import { cn } from "@/lib/utils";

export function Container({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 mb-10", className)} {...props}>
      {children}
    </div>
  );
}
