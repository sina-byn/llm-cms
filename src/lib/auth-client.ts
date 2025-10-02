import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  basePath: process.env.NEXT_PUBLIC_BASE_URL,
});
