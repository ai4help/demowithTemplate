import { NextAuthOptions } from 'next-auth'
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from 'next-auth/providers/credentials'

export default async function handler(req, res) {
    GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
    })
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
            email: { label: "Email", type: "text", placeholder: "emai.@example.com" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            const user = {
                id: 1, name: 'kranthi  ', email: ''
            }
            if (user) {
                res.status(200).json({ user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }
    })
}
// Compare this snippet from Staterkit/app/pages/api/loginOptions.js:
