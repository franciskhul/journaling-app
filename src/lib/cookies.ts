export function getCookieValue(
  req: Request,
  cookieName: string
): string | null {
  const cookies = req.headers.get("cookie");
  return (
    cookies
      ?.split("; ")
      .find((c) => c.startsWith(`${cookieName}=`))
      ?.split("=")[1] || null
  );
}
