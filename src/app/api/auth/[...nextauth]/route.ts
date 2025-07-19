// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user?.email ?? undefined },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.email = dbUser.email;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
