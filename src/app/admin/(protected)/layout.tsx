import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Container } from "@/components/layout/Container";

/**
 * Everything in this route group is behind the auth gate and inherits the admin
 * shell. New admin screens only need to add their own page.tsx.
 */
export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGate>
      <div className="flex min-h-svh flex-col">
        <AdminHeader />
        <main className="flex-1">
          <Container className="mb-0 py-8">{children}</Container>
        </main>
      </div>
    </AdminAuthGate>
  );
}
