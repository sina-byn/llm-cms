'use client';

import { useRouter } from 'next/navigation';

import * as z from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

import { signIn } from '@/server/auth';

import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from './ui/form';

const LoginCredentialsSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(LoginCredentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  const router = useRouter();

  const onSubmit = async (values: LoginCredentials) => {
    const { email, password } = values;

    const error = await signIn(email, password);

    if (error) {
      console.log(error);
      toast.error(error.message);
      return;
    }

    router.replace('/');
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-6'>
                <div className='grid gap-3'>
                  <FormField
                    name='email'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={field.name}>Email</FormLabel>
                        <FormControl>
                          <Input
                            id={field.name}
                            type='email'
                            placeholder='m@example.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-3'>
                  <FormField
                    name='password'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={field.name}>Password</FormLabel>
                        <FormControl>
                          <Input
                            id={field.name}
                            type='password'
                            placeholder='password...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <div className='flex items-center'>
                    <Label htmlFor='password'>Password</Label>
                    <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                    Forgot your password?
                    </a>
                    </div> */}
                </div>
                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    Login
                  </Button>
                  {/* <Button variant="outline" className="w-full">
                  Login with Google
                  </Button> */}
                </div>
              </div>
              {/* <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
              Sign up
              </a>
              </div> */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
