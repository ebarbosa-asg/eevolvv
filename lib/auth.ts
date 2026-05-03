import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    signIn({ user }) {
      return user.email === 'hello@eevolvv.com' || user.email === 'eduardocbarbosa1998@gmail.com'
    },
  },
})
