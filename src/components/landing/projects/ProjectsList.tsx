import type { Project } from "@/services/project/types";
import { ProjectCard } from "./ProjectCard";

type ProjectsListProps = {
  items: Project[];
};

export function ProjectsList({ items }: ProjectsListProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {items.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}

export default ProjectsList;