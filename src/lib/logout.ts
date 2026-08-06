const LOGOUT_ENDPOINT = 
  process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.length > 0
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "")}/line/logout`
    : "/line/logout";

export async function logoutUser(): Promise<void> {
  try {
    await fetch(LOGOUT_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to call logout endpoint", error);
  }
}
