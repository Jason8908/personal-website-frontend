"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type PasswordInputProps = React.ComponentProps<"input"> & {
  toggleAriaLabel?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, toggleAriaLabel = "Toggle password visibility", ...props }, ref) {
    const [visible, setVisible] = React.useState(false)

    return (
      <div className={cn("relative", className)}>
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm shadow-xs",
            "ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring",
            "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/40",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={toggleAriaLabel}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </Button>
      </div>
    )
  }
)

export { PasswordInput }


