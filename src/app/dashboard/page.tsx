import { authOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">ようこそ、{session.user?.name}さん！</p>
      <SignOutButton />
    </div>
  );
}
