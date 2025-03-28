import { checkAuth } from "@/lib/next-auth/checkAuth";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import RegistrationForm from "@/components/registration/registration-form";

export default async function GetStartedPage() {
  const { isAuthenticated } = await checkAuth();
  if (isAuthenticated) {
    redirect("/my-journal");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white text-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Left Column  */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles
                className="h-6 w-6 text-amber-500"
                data-testid="sparkles-icon"
              />
              <h1 className="font-fugaz text-3xl text-center bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Get Started
              </h1>
            </div>
            <p className="font-alumni text-lg text-neutral-600 mb-8 text-center">
              Begin your journaling adventure today
            </p>

            <RegistrationForm />

            <p className="mt-6 text-sm font-alumni text-neutral-600 text-center">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-amber-600 hover:text-amber-800 underline"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column - Visual Section */}
        <div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-100 to-amber-50 items-center justify-center p-8"
          data-testid="visual-section"
        >
          <div className="text-center">
            <Image
              src="/journal-illustration.webp"
              alt="Happy journaling"
              width={400}
              height={400}
              className="m
              x-auto"
            />
            <h2 className="font-fugaz text-2xl text-amber-900 mt-6">
              Your Story Begins Here
            </h2>
            <p className="font-alumni text-lg text-amber-800 mt-2">
              Capture memories, reflect on growth, and celebrate life&apos;s
              moments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
