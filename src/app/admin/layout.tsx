import AdminLayout from "@/components/Layouts/AdminLayout";
import { getAuthSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "e-commerce - Admin panel",
  description: "Administration panel",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session || session.user.role !== "ADMIN") redirect("/sign-in");

  return <AdminLayout>{children}</AdminLayout>;
}
