import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../utils/dbConnect";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
    maxAge:  24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const client = await clientPromise;
      const db = client.db();
      const existingUser = await db.collection("users").findOne({ email: user.email });
      if (!existingUser) {
        const newUser = await db.collection("users").insertOne({
          name: user.name,
          email: user.email,
          image: user.image,
        });
        user.id = newUser.insertedId.toString();
      } else {
        user.id = existingUser._id.toString();
      }

      return true;
    },
    async session({ session, token }) {
      console.log("Session from auth page:", session);
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },
});
