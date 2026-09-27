import { Link } from "react-router"
import { AccountSlot } from "@/components/account-slot"
import { DISCORD_URL } from "@/lib/links"

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 border border-white/10 bg-background/35 px-4 text-xs shadow-[0_8px_32px_-12px_oklch(0_0_0/60%)] backdrop-blur-xl backdrop-saturate-150">
        <Link to="/" className="group flex items-center gap-2.5 font-semibold tracking-[0.25em] uppercase">
          <span aria-hidden className="grid size-6 place-items-center bg-primary text-[13px] font-black tracking-normal text-primary-foreground">
            R
          </span>
          remporia
          <span className="hidden border border-primary/30 px-1.5 py-0.5 text-[10px] tracking-widest text-primary sm:inline">
            1.8.9
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-5 text-muted-foreground">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="hidden transition-colors hover:text-foreground sm:inline">
            Discord
          </a>
          <AccountSlot />
        </nav>
      </div>
    </header>
  )
}
