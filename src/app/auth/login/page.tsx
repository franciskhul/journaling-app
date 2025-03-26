import Link from "next/link";

import { Sparkles } from "lucide-react";
import LoginForm from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles
              className="h-6 w-6 text-amber-500"
              data-testid="sparkles-icon"
            />
            <h2 className="font-fugaz text-3xl bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              Welcome Back
            </h2>
          </div>
          <p className="font-alumni text-lg text-neutral-600">
            Continue your journaling journey
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <p className="font-alumni text-neutral-600">
            New to Journal Joy?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-amber-600 hover:text-amber-800 underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
