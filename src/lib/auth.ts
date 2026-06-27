import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.passwordHash) return null;
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role, isStudent: user.isStudent };
      },
    }),
  ],
  callbacks: {
    // Create DB user on first OAuth sign-in
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        try {
          const existing = await prisma.user.findUnique({ where: { email: user.email } });
          if (!existing) {
            const newUser = await prisma.user.create({
              data: {
                name: user.name ?? user.email.split("@")[0],
                email: user.email,
                emailVerified: new Date(),
                role: "CUSTOMER",
              },
            });
            // Bootstrap loyalty account + dietary profile
            await prisma.loyaltyAccount.create({ data: { userId: newUser.id } });
            await prisma.dietaryProfile.create({ data: { userId: newUser.id } });
          }
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role?: string }).role ?? "CUSTOMER";
        token.isStudent = (user as unknown as { isStudent?: boolean }).isStudent ?? false;
      }
      // For OAuth logins resolve from DB
      if (account?.provider === "google") {
        if (token.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: token.email as string } });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.isStudent = dbUser.isStudent;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isStudent = token.isStudent as boolean;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
