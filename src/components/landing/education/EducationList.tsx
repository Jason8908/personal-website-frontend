import type { Education } from "@/services/education/types";
import { EducationItem } from "./EducationItem";

type EducationListProps = {
  items: Education[];
};

export function EducationList({ items }: EducationListProps) {
  return (
    <ul className="grid gap-6">
      {items.map((item) => (
        <EducationItem key={item.id} item={item} />
      ))}
    </ul>
  );
}

export default EducationList;