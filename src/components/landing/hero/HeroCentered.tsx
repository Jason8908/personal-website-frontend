import { cn } from "@/lib/utils";

type HeroCenteredProps = {
  name: string;
  role: string;
  className?: string;
};

export function HeroCentered({ name, role, className }: HeroCenteredProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100svh-4rem)] w-full items-center justify-center px-6 py-12",
        "text-center",
        className
      )}
    >
      <div className="mx-auto -translate-y-8 sm:-translate-y-12 md:-translate-y-16 flex max-w-6xl flex-col items-center gap-6">
        <h1 className="text-6xl tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          {name}
        </h1>
        <p className="text-lg font-semibold text-secondary sm:text-xl md:text-2xl">
          {role}
        </p>
      </div>
    </section>
  );
}

export default HeroCentered;


