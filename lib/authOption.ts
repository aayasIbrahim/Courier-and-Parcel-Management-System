import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// ✅ Extend NextAuth types safely
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      role: string | null;
    };
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          await connectDB();

          const email = credentials.email.trim().toLowerCase(); // ✅ normalize
          const user = await User.findOne({ email });
          if (!user) {
            console.log("User not found");
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            console.log("Password incorrect");
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name ?? null,
            email: user.email ?? null,
            role: user.role ?? "user",
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // ✅ If user exists (login), attach user info to token
      if (user) {
        token.id = user.id;
        token.name = user.name ?? null;
        token.email = user.email ?? null;
        token.role = user.role ?? "user";
      }
      return token;
    },

    async session({ session, token }) {
      // ✅ Attach token info to session.user safely
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? null;
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // ✅ Custom login page
  },
};

export default NextAuth(authOptions);