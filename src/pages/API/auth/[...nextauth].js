// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    pages: {
        signIn: "/auth/signin",
    },
});
