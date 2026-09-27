import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import type { AuthMode } from "@/components/auth-dialog"
import { OPEN_AUTH_EVENT, loadAccountMenu, loadAuthDialog, openAuth, prefetchAuth } from "@/lib/auth"

const AuthDialog = lazy(loadAuthDialog)
const AccountMenu = lazy(loadAccountMenu)

export function AccountSlot() {
  const session = useSession()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>("login")
  // Stays mounted after first open so the close animation can play.
  const [mounted, setMounted] = useState(false)

  useEventListener(OPEN_AUTH_EVENT, (e) => {
    setMode((e as CustomEvent<AuthMode>).detail)
    setOpen(true)
    setMounted(true)
  })

  if (session.status === "loading") {
    return <div aria-hidden className="h-9 w-24 animate-pulse border border-dashed" />
  }

  if (session.loggedIn) {
    void loadAccountMenu()
    return (
      <Suspense fallback={<div aria-hidden className="h-9 w-24 border" />}>
        <AccountMenu name={session.name} />
      </Suspense>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        onPointerEnter={prefetchAuth}
        onFocus={prefetchAuth}
        onClick={() => openAuth("login")}
        className="h-9 border-primary/40 bg-transparent px-4 text-sm font-semibold text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground dark:bg-transparent dark:hover:bg-primary"
      >
        Log in
      </Button>
      {mounted && (
        <Suspense fallback={null}>
          <AuthDialog open={open} onOpenChange={setOpen} mode={mode} onModeChange={setMode} />
        </Suspense>
      )}
    </>
  )
}

function useEventListener(type: string, handler: (e: Event) => void) {
  const ref = useRef(handler)
  useLayoutEffect(() => {
    ref.current = handler
  })
  useEffect(() => {
    const listener = (e: Event) => ref.current(e)
    addEventListener(type, listener)
    return () => removeEventListener(type, listener)
  }, [type])
}
