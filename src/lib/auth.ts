import type { AuthMode } from "@/components/auth-dialog"

// Radix-backed UI is split out of the entry chunk and fetched on intent.
export const loadAuthDialog = () => import("@/components/auth-dialog")
export const loadAccountMenu = () => import("@/components/account-menu")

export const OPEN_AUTH_EVENT = "remporia:open-auth"

export function prefetchAuth() {
  void loadAuthDialog()
}

/** Open the auth dialog from anywhere on the page. */
export function openAuth(mode: AuthMode) {
  prefetchAuth()
  dispatchEvent(new CustomEvent<AuthMode>(OPEN_AUTH_EVENT, { detail: mode }))
}
