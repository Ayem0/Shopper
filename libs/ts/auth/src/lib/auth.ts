// import { betterAuth } from 'better-auth';
// import { nextCookies } from 'better-auth/next-js';
// import { genericOAuth } from 'better-auth/plugins';

// export const auth = betterAuth({
//   session: {
//     preserveSessionInDatabase: false,
//     storeSessionInDatabase: false,
//   },

//   // ... other config options
//   plugins: [
//     genericOAuth({
//       config: [
//         {
//           providerId: 'keycloak',
//           clientId: process.env.KEYCLOAK_ID ?? '',
//           clientSecret: process.env.KEYCLOAK_SECRET ?? '',
//           discoveryUrl: process.env.KEYCLOAK_DISCOVERY_URL ?? '',
//           scopes: ['openid', 'email', 'profile'],
//           authorizationUrlParams: { prompt: 'login' },
//         },
//       ],
//     }),
//     nextCookies(),
//   ],
// });
