import { LoginForm } from "@/components/admin/auth/login-form";

export default function Page() {
  return (
    <main className="grid min-h-svh grid-cols-1 md:grid-cols-1">
      <div className="flex items-center justify-center p-6 md:p-10">
        <LoginForm />
      </div>
    </main>
  );
}