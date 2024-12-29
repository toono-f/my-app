import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { DefaultSession } from "next-auth";
import { accounts, sessions, users } from "@/lib/db/schema";

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
    async session({ session, user }) {
      console.log("Session created:", session);

      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
