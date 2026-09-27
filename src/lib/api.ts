const API_ORIGIN = "https://little-bonus-c967.3mjjackson2.workers.dev"

export type Me = { loggedIn: true; name: string } | { loggedIn: false }

export class ApiError extends Error {}

async function request<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(API_ORIGIN + path, {
    method: body === undefined ? "GET" : "POST",
    credentials: "include",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || "Request failed.")
  return data as T
}

export const api = {
  me: () => request<Me>("/api/me"),
  login: (email: string, password: string) => request("/api/login", { email, password }),
  signup: (email: string, password: string) => request("/api/signup", { email, password }),
  verify: (email: string, code: string) => request("/api/verify", { email, code }),
  rename: (name: string) => request("/api/rename", { name }),
  logout: () => request("/api/logout", {}),
}
