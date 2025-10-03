'use server';

import { auth } from '@/lib/auth';

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: true,
      },
    });
  } catch (err) {
    console.error(err);
    return err as Error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        rememberMe: true,
        name: crypto.randomUUID(),
      },
    });
  } catch (err) {
    console.error(err);
    return err as Error;
  }
};
