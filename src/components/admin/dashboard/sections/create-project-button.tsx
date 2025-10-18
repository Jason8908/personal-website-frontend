"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateProjectDialog } from "@/components/admin/dashboard/sections/create-project-dialog";

export function CreateProjectButton() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Create Project</Button>
      <CreateProjectDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}


