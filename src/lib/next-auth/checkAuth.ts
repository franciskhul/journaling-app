import { auth } from "@/auth";

export async function getServerSession() {
  return await auth();
}

export async function checkAuth() {
  const session = await auth();
  return {
    isAuthenticated: !!session?.user,
    user: session?.user,
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
  };
}
