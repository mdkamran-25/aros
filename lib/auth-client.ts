// Client-side auth helper
export function getSessionEmail(): string | null {
  if (typeof document === "undefined") return null;

  const emailCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_email="));

  if (!emailCookie) return null;

  try {
    const email = decodeURIComponent(emailCookie.split("=")[1]);
    return email;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  document.cookie =
    "user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
