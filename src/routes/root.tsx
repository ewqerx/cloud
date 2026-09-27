import { Link, Outlet } from "react-router"
import { BlackHole } from "@/components/black-hole"
import { SiteHeader } from "@/components/site-header"

export function RootLayout() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col pt-[4.75rem]">
      <Backdrop />
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-background/35 backdrop-blur-xl">
      <div className="mx-auto flex h-10 max-w-7xl items-center gap-6 px-4 text-[11px] text-muted-foreground sm:px-6">
        <span className="ml-auto">© {new Date().getFullYear()} remporia</span>
      </div>
    </footer>
  )
}

/**
 * Atmosphere layers. All fixed + pointer-events-none; animations are limited to
 * transform/opacity so they stay on the compositor.
 */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <BlackHole />
      <div className="bg-cyber-grid absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-40 animate-scan bg-linear-to-b from-transparent via-primary/[0.04] to-transparent will-change-transform" />
      <div className="bg-scanlines absolute inset-0 opacity-60" />
    </div>
  )
}

export function NotFound() {
  return (
    <main className="grid flex-1 place-items-center p-6 text-center">
      <div className="grid gap-3">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link to="/" className="text-primary underline underline-offset-4">
          Back to home
        </Link>
      </div>
    </main>
  )
}
