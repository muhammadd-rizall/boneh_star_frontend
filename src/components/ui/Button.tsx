import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:  "bg-action-blue text-white hover:bg-action-blue/90 shadow-button",
        primary:  "bg-action-blue text-white hover:bg-action-blue/90 shadow-button",
        outline:  "border-platinum-tint bg-white text-midnight-indigo hover:bg-cloud-mist hover:border-platinum-tint",
        secondary: "bg-pale-gray text-glacier-blue hover:bg-pale-gray/80",
        ghost:    "text-midnight-indigo hover:bg-cloud-mist",
        ghostNeutral: "text-text-black hover:bg-cloud-mist",
        ghostLight: "text-white hover:bg-white/10",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        danger:   "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        success:  "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
        warning:  "bg-sunset-gold text-white hover:bg-sunset-gold/90 shadow-sm",
        info:     "bg-glacier-blue text-white hover:bg-glacier-blue/90 shadow-sm",
        link:     "text-action-blue underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        xs: "h-7 gap-1 rounded-md px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-md px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        lg: "h-12 gap-2.5 px-8 text-base has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        icon: "size-10",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ElementType
  suffix?: React.ElementType
}

function Button({
  className,
  variant = "default",
  size = "default",
  loading,
  icon: Icon,
  suffix: SuffixIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        Icon && <Icon className="shrink-0" />
      )}
      {children}
      {!loading && SuffixIcon && <SuffixIcon className="shrink-0" />}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
