// import NextAuth from "next-auth";
// import authOptions from "@/lib/next-auth/authOptions";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
// export default handler;
// export const auth = () => handler.auth();

import NextAuth from "next-auth";
import authOptions from "@/lib/next-auth/authOptions";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
