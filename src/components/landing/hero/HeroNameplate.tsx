import { cn } from "@/lib/utils";

type HeroNameplateProps = {
  name: string;
  tagline?: string;
  className?: string;
};

export function HeroNameplate({ name, tagline, className }: HeroNameplateProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        {name}
      </h1>
      {tagline ? (
        <p className="text-xl text-muted-foreground md:text-2xl">{tagline}</p>
      ) : null}
    </div>
  );
}

export default HeroNameplate;