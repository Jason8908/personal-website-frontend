"use client";

import { LogoutButton } from "@/components/admin/navigation/logout-button";
import { Card, CardContent } from "@/components/ui/card";

export function AdminNavbar() {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center justify-end gap-4 px-0 py-0">
        <LogoutButton />
      </CardContent>
    </Card>
  );
}