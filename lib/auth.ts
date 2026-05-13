import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { getAllClientAgentEmails } from '@/data/clientAgentPages'

const OWNER_EMAILS = ['hello@eevolvv.com', 'eduardocbarbosa1998@gmail.com']

function isAllowedEmail(email?: string | null) {
  if (!email) return false
  const normalized = email.toLowerCase()
  return [...OWNER_EMAILS, ...getAllClientAgentEmails()].some(allowed => allowed.toLowerCase() === normalized)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    signIn({ user }) {
      return isAllowedEmail(user.email)
    },
  },
})
