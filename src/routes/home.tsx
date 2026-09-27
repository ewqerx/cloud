import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { openAuth, prefetchAuth } from "@/lib/auth"
import { DISCORD_URL } from "@/lib/links"
import { useSession } from "@/lib/session"

const rise = (i: number): CSSProperties => ({ animationDelay: `${80 + i * 90}ms` })

export function HomePage() {
  const session = useSession()
  const showSignup = session.status === "ready" && !session.loggedIn

  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 content-center px-4 py-16 sm:px-6">
      <section className="flex flex-col gap-8">
        <h1
          style={rise(0)}
          data-text="REMPORIA"
          className="glitch animate-rise text-[clamp(3rem,15vw,8.5rem)] leading-[0.9] font-extrabold tracking-[-0.04em]"
        >
          REMPORIA
        </h1>

        <p style={rise(1)} className="max-w-xl animate-rise text-base text-muted-foreground sm:text-lg">
          The best 1.8.9 client.
        </p>

        <div style={rise(2)} className="flex animate-rise flex-wrap gap-3">
          <Button asChild size="lg" className="h-11 px-5 text-sm font-semibold">
            <a href={DISCORD_URL} target="_blank" rel="noreferrer">
              Join the Discord
            </a>
          </Button>
          {showSignup && (
            <Button
              variant="outline"
              size="lg"
              onPointerEnter={prefetchAuth}
              onFocus={prefetchAuth}
              onClick={() => openAuth("signup")}
              className="h-11 bg-transparent px-5 text-sm font-semibold dark:bg-transparent"
            >
              Create account
            </Button>
          )}
        </div>
      </section>
    </main>
  )
}
