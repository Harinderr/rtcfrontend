
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {


  providers: [
   GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here

  ],
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      // Add your JWT logic here
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      return session;
    },
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
}

