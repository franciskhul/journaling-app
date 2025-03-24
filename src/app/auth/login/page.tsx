"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
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

export default function LoginPage() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
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
        toast("Login successful. Welcome back!");
        router.push("/");
      }
    } catch (e) {
      console.error(e);
      form.setError("root", { type: "manual", message: "An error occurred" });
    }
    setPending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image
            className="mx-auto h-10 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Logo"
            width={40}
            height={40}
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Login to your account
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive text-center">
                {form.formState.errors.root.message}
              </p>
            )}

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel
                      className={fieldState.error ? "text-destructive" : ""}
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                        className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${
                          fieldState.error
                            ? "border-red-500"
                            : "border-gray-200"
                        } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel
                        className={fieldState.error ? "text-destructive" : ""}
                      >
                        Password
                      </FormLabel>
                      <Link
                        href="#"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"} // Toggle type
                          autoComplete="current-password"
                          {...field}
                          className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${
                            fieldState.error
                              ? "border-red-500"
                              : "border-gray-200"
                          } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="w-full justify-center py-3 px-4"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/registration"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
