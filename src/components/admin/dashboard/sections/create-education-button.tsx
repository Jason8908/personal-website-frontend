"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateEducationDialog } from "@/components/admin/dashboard/sections/create-education-dialog";

export function CreateEducationButton() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Create Education</Button>
      <CreateEducationDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}