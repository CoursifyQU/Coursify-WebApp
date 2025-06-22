"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#00305f]">
      <SliderPrimitive.Range className="absolute h-full bg-[#00305f]" />
    </SliderPrimitive.Track>
    {props.value?.map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        className="block h-5 w-5 rounded-full border-2 border-[#00305f] bg-white focus:outline-none focus:ring-2 focus:ring-[#00305f] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        aria-label={i === 0 ? "Min GPA" : "Max GPA"}
      />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
