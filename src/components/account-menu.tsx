import { useActionState } from "react"
import { api } from "@/lib/api"
import { refreshSession, setDisplayName } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function AccountMenu({ name }: { name: string }) {
  const [renameError, rename, renaming] = useActionState<string | null, FormData>(async (_, form) => {
    const next = String(form.get("name")).trim()
    if (!next || next === name) return null
    try {
      await api.rename(next)
      setDisplayName(next)
      return null
    } catch {
      return "Rename failed."
    }
  }, null)

  const [, logout, loggingOut] = useActionState(async () => {
    await api.logout().catch(() => {})
    await refreshSession()
  }, undefined)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 gap-2 border-border bg-transparent px-2 text-xs">
          <span className="grid size-5 place-items-center bg-primary text-[11px] font-bold text-primary-foreground">
            {name.trim().charAt(0).toUpperCase() || "?"}
          </span>
          <span className="hidden max-w-32 truncate sm:inline">{name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-64 gap-3 rounded-lg bg-popover/95 p-3">
        <div className="text-xs text-muted-foreground">Signed in as</div>
        <div className="truncate text-sm">{name}</div>
        <form action={rename} className="grid gap-2 border-t pt-3">
          <Input name="name" defaultValue={name} key={name} aria-label="Display name" maxLength={32} />
          {renameError && <p className="text-xs text-destructive">{renameError}</p>}
          <Button type="submit" variant="outline" disabled={renaming}>
            {renaming ? "Saving…" : "Save name"}
          </Button>
        </form>
        <form action={logout}>
          <Button type="submit" variant="destructive" disabled={loggingOut} className="w-full">
            {loggingOut ? "Logging out…" : "Log out"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}
