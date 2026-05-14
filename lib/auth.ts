import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { getAllClientAgentEmails, isOwnerEmail, normalizeEmail } from '@/lib/client-agent-pages'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    signIn({ user }) {
      const email = normalizeEmail(user.email)
      const allowedClientEmails = new Set<string>(getAllClientAgentEmails())
      return isOwnerEmail(email) || allowedClientEmails.has(email)
    },
  },
})
