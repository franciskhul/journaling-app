"use client";
import { useState } from "react";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      toast.success("Welcome to your new journal!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-4">
          {/* Full Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field /*, fieldState*/ }) => (
              <FormItem>
                <FormLabel className="font-alumni font-semibold">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Alex Johnson"
                    {...field}
                    className="font-alumni py-6 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </FormControl>
                <FormMessage className="font-alumni" />
              </FormItem>
            )}
          />

          {/* Email Field */}
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
                    placeholder="alex@example.com"
                    type="email"
                    {...field}
                    className="font-alumni py-6 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </FormControl>
                <FormMessage className="font-alumni" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field /*, fieldState*/ }) => (
              <FormItem>
                <FormLabel className="font-alumni font-semibold">
                  Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field /*, fieldState*/ }) => (
              <FormItem>
                <FormLabel className="font-alumni font-semibold">
                  Confirm Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="font-alumni py-6 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
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

          <Button
            type="submit"
            className="w-full py-6 font-fugaz text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Start Journaling
          </Button>
        </div>
      </form>
    </Form>
  );
}
