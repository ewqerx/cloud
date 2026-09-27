import { useSyncExternalStore } from "react"
import { api, type Me } from "@/lib/api"

// A tiny external store instead of context: the session fetch starts at module
// load (in parallel with React mounting), and only subscribers re-render.
type Session = { status: "loading" } | ({ status: "ready" } & Me)

let state: Session = { status: "loading" }
const listeners = new Set<() => void>()

function set(next: Session) {
  state = next
  listeners.forEach((l) => l())
}

export function refreshSession() {
  return api
    .me()
    .then((me) => set({ status: "ready", ...me }))
    .catch(() => set({ status: "ready", loggedIn: false }))
}

export function setDisplayName(name: string) {
  if (state.status === "ready" && state.loggedIn) set({ ...state, name })
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useSession() {
  return useSyncExternalStore(subscribe, () => state)
}

refreshSession()
