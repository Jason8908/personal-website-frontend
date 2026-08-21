import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  // Covers the whole admin area, login page included.
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
