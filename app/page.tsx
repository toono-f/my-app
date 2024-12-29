import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <Link href="/api/auth/signin">Sign in</Link>
      <br />
      <Link href="/dashboard">Go to Dashboard</Link>
    </div>
  );
}
