import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

export const redirectUnauthenticated = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/login');
};
