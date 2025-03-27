"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/my-journal";

  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setPending(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res?.error) {
        form.setError("root", { type: "manual", message: res.error });
      } else {
        toast.success("Welcome back to your journal!");
        router.push(callbackUrl);
      }
    } catch (e) {
      console.error(e);
      form.setError("root", { type: "manual", message: "An error occurred" });
    }
    setPending(false);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <p className="font-alumni text-sm text-red-500 text-center">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field /*, fieldState*/ }) => (
              <FormItem>
                <FormLabel className="font-alumni font-semibold">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="your@email.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                    className="font-alumni py-6 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </FormControl>
                <FormMessage className="font-alumni" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field /*, fieldState */ }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="font-alumni font-semibold">
                    Password
                  </FormLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="font-alumni text-sm text-amber-600 hover:text-amber-800 underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...field}
                      className="font-alumni py-6 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FormMessage className="font-alumni" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full py-6 font-fugaz text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" />
              Continue Journaling
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
