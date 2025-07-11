import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-normal ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-helix-border bg-white/80 text-helix-gradient-start hover:bg-helix-gradient-start/10 hover:text-helix-gradient-start shadow-none",
  {
    variants: {
      variant: {
        default: "bg-white/80 text-helix-gradient-start hover:bg-helix-gradient-start/10 hover:text-helix-gradient-start border border-helix-border shadow-none",
        destructive: "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 shadow-none",
        outline: "border border-helix-border bg-transparent text-helix-gradient-start hover:bg-helix-gradient-start/10 shadow-none",
        secondary: "bg-helix-gradient-start/5 text-helix-gradient-start hover:bg-helix-gradient-start/10 border border-helix-border shadow-none",
        ghost: "bg-transparent text-helix-gradient-start hover:bg-helix-gradient-start/10 border-none shadow-none",
        link: "text-helix-gradient-start underline-offset-4 hover:underline border-none bg-transparent shadow-none",
      },
      size: {
        default: "h-8 px-3 py-1.5 text-sm",
        sm: "h-7 rounded px-2 text-xs",
        lg: "h-9 rounded px-4 text-base",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
