import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/src/lib/db";
import { DefaultSession } from "next-auth";
import { accounts, sessions, users } from "@/src/lib/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }) {
      // ALLOWED_EMAILS環境変数が設定されていない場合はアクセスを拒否
      if (!process.env.ALLOWED_EMAILS) {
        console.warn("ALLOWED_EMAILS environment variable is not set");
        return false;
      }

      // カンマ区切りのメールアドレスリストを配列に変換し、各アドレスを正規化
      const allowedEmails = process.env.ALLOWED_EMAILS.split(",").map((email) =>
        email.trim().toLowerCase()
      );

      // ユーザーのメールアドレスを取得し、小文字に変換
      const userEmail = (user.email ?? "").toLowerCase();

      // メールアドレスが存在しないか、許可リストに含まれていない場合はアクセスを拒否
      if (!userEmail || !allowedEmails.includes(userEmail)) {
        console.warn(`Unauthorized access attempt: ${userEmail}`);
        return false;
      }

      // すべての検証をパスした場合はアクセスを許可
      return true;
    },
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
