import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-4">
      {session ? (
        <Link
          href="/dashboard"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          ダッシュボードへ
        </Link>
      ) : (
        <Link
          href="/api/auth/signin"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          ログイン
        </Link>
      )}
    </div>
  );
}
