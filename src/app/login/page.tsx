'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Zap } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

function getPostAuthRedirect(): string {
  if (typeof window === 'undefined') return '/blueprint';
  const params = new URLSearchParams(window.location.search);
  const target = params.get('redirect');
  if (target && target.startsWith('/')) {
    return target;
  }
  return '/blueprint';
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data);
      toast({ title: 'Logged In!', description: 'Welcome back!' });
      router.push(getPostAuthRedirect());
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed. Please try again.';
      toast({ title: 'Login Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const signupHref =
    typeof window !== 'undefined' && window.location.search
      ? `/signup${window.location.search}`
      : '/signup';

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Zap className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline text-primary">Blueprint</h1>
      </Link>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
            <LogIn className="h-6 w-6" /> Welcome Back!
          </CardTitle>
          <CardDescription>Log in to continue to Blueprint.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging In...' : 'Log In'}
              </Button>
            </form>
          </Form>

          <div className="relative my-4 flex items-center">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink mx-3 text-muted-foreground text-xs uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                await login({ email: 'designer@blueprint.app', password: 'password123' });
                toast({ title: 'Welcome to Blueprint!', description: 'Logged in as Demo Designer.' });
                router.push(getPostAuthRedirect());
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <Zap className="mr-2 h-4 w-4 text-primary" />
            Continue as Guest / Demo
          </Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href={signupHref} className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
