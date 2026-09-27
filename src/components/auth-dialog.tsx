import { startTransition, useActionState, useState, type FormEvent } from "react"
import { ApiError, api } from "@/lib/api"
import { refreshSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type AuthMode = "login" | "signup"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
}

function errorMessage(e: unknown) {
  return e instanceof ApiError ? e.message : "Something went wrong. Try again."
}

/**
 * Async form handler -> [error, onSubmit, pending]. Uses onSubmit rather than
 * `<form action>` so React doesn't reset the fields when a submit fails.
 */
function useFormAction(fn: (form: FormData) => Promise<void>) {
  const [error, dispatch, pending] = useActionState<string | null, FormData>(async (_, form) => {
    try {
      await fn(form)
      return null
    } catch (e) {
      return errorMessage(e)
    }
  }, null)
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    startTransition(() => dispatch(form))
  }
  return [error, onSubmit, pending] as const
}

export default function AuthDialog({ open, onOpenChange, mode, onModeChange }: Props) {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  const finish = async () => {
    await refreshSession()
    setPendingEmail(null)
    onOpenChange(false)
  }

  const [loginError, login, loggingIn] = useFormAction(async (f) => {
    await api.login(String(f.get("email")).trim(), String(f.get("password")))
    await finish()
  })

  const [signupError, signup, signingUp] = useFormAction(async (f) => {
    const email = String(f.get("email")).trim()
    await api.signup(email, String(f.get("password")))
    setPendingEmail(email)
  })

  const [verifyError, verify, verifying] = useFormAction(async (f) => {
    await api.verify(pendingEmail ?? "", String(f.get("code")).trim())
    await finish()
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 rounded-lg bg-popover/95 p-6 ring-border sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg tracking-tight">
            {pendingEmail ? "Check your email" : mode === "login" ? "Log in" : "Create an account"}
          </DialogTitle>
          <DialogDescription>
            {pendingEmail ? (
              <>
                We sent a 6-digit code to <span className="text-foreground">{pendingEmail}</span>
              </>
            ) : (
              mode === "login" ? "Welcome back." : "Sign up with your email."
            )}
          </DialogDescription>
        </DialogHeader>

        {pendingEmail ? (
          <form onSubmit={verify} className="grid gap-4">
            <Field label="Code" error={verifyError}>
              <Input
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                required
                autoFocus
                className="h-10 text-center text-base tracking-[0.6em]"
              />
            </Field>
            <Submit pending={verifying}>Verify</Submit>
          </form>
        ) : (
          <Tabs value={mode} onValueChange={(v) => onModeChange(v as AuthMode)} className="gap-5">
            <TabsList variant="line" className="w-full justify-start border-b p-0">
              <TabsTrigger value="login" className="flex-none px-3">
                Log in
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-none px-3">
                Sign up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={login} className="grid gap-4">
                <EmailField />
                <Field label="Password" error={loginError}>
                  <Input name="password" type="password" autoComplete="current-password" required className="h-10" />
                </Field>
                <Submit pending={loggingIn}>Log in</Submit>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={signup} className="grid gap-4">
                <EmailField />
                <Field label="Password" hint="At least 8 characters" error={signupError}>
                  <Input name="password" type="password" autoComplete="new-password" minLength={8} required className="h-10" />
                </Field>
                <Submit pending={signingUp}>Send code</Submit>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

function EmailField() {
  return (
    <Field label="Email">
      <Input name="email" type="email" autoComplete="email" placeholder="you@domain.gg" required autoFocus className="h-10" />
    </Field>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string | null
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        {hint && <span>{hint}</span>}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" size="lg" disabled={pending} className="mt-1 h-10 text-sm font-semibold">
      {pending ? "Working…" : children}
    </Button>
  )
}
