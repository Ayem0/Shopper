import NextAuth, { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

declare module 'next-auth/jwt' {
  interface JWT {
    /** Keycloak raw access token as provided by the provider/account */
    access_token?: string;
    refresh_token?: string;
    /** epoch seconds or timestamp you saved from account.expires_at */
    expires_at?: number;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID ?? '',
      clientSecret: process.env.KEYCLOAK_SECRET ?? '',
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: {
        params: { prompt: 'login' },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  adapter: undefined,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
