import { AdminDashboard } from "@/components/admin/dashboard/admin-dashboard";
import { RequireAuth } from "@/components/admin/auth/require-auth";

export default function Page() {
  return (
    <RequireAuth>
      <main className="min-h-svh p-6 md:p-10">
        <AdminDashboard />
      </main>
    </RequireAuth>
  );
}
