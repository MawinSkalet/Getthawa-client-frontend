import { getBaseUrl } from "./api";

export async function logoutUser(): Promise<void> {
  const logoutEndpoint = `${getBaseUrl().replace(/\/+$/, "")}/line/logout`;
  try {
    await fetch(logoutEndpoint, {
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
