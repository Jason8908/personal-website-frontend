"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateExperienceDialog } from "@/components/admin/dashboard/sections/create-experience-dialog";

export function CreateExperienceButton() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Experience</Button>
      </DialogTrigger>
      <CreateExperienceDialog open={open} onOpenChange={setOpen} />
    </Dialog>
  );
}