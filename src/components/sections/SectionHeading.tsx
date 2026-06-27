export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-4">
      <h2 className="mb-2 text-lg">{title}</h2>
      <hr />
    </div>
  );
}
