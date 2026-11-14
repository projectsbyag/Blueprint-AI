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
import { UserPlus, Zap } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof formSchema>;

function getPostAuthRedirect(): string {
  if (typeof window === 'undefined') return '/blueprint';
  const params = new URLSearchParams(window.location.search);
  const target = params.get('redirect');
  if (target && target.startsWith('/')) {
    return target;
  }
  return '/blueprint';
}

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      await signUp({ email: data.email, password: data.password });
      toast({ title: 'Account Created!', description: 'You have successfully signed up.' });
      router.push(getPostAuthRedirect());
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create account. Please try again.';
      toast({ title: 'Sign Up Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const loginHref =
    typeof window !== 'undefined' && window.location.search
      ? `/login${window.location.search}`
      : '/login';

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Zap className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline text-primary">Blueprint</h1>
      </Link>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" /> Create your Account
          </CardTitle>
          <CardDescription>Enter your details below to get started.</CardDescription>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
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
                await signUp({ email: 'designer@blueprint.app', password: 'password123' });
                toast({ title: 'Welcome to Blueprint!', description: 'Logged in with instant demo access.' });
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
            Already have an account?{' '}
            <Link href={loginHref} className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
