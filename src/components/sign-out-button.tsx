import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.replace('/login'),
        onError: err => {
          console.error(err.error);
          toast.error(err.error.message);
        },
      },
    });
  };

  return (
    <Button variant='outline' onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
