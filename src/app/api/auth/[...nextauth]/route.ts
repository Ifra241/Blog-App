import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      authType?: "google" | "email"; //  custom field
    };
  }

  interface User {
    id: string;
    authType?: "google" | "email";
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt", //  session ko JWT-based banaya
  },

  callbacks: {
    async signIn({ user }) {
      await connectToDatabase();
      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        existingUser = await User.create({
          fullname: user.name,
          email: user.email,
          profilePic: user.image,
          authType: "google",
          createdAt: new Date(),
        });
      }

      user.id = existingUser._id.toString();
      user.authType = "google"; 
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.authType = user.authType || "google";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.authType = token.authType as "google" | "email"; 
      }
      return session;
    },

    async redirect() {
      return "/dashboard";
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
