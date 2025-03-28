import { auth } from "@/auth";

export async function getServerSession() {
  return await auth();
}

export async function checkAuth() {
  const session = await auth();
  console.log("*session**", session);
  return {
    isAuthenticated: !!session?.user,
    user: session?.user,
  };
}
