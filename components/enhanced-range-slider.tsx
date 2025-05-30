"use client"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface EnhancedRangeSliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step: number
  className?: string
  formatLabel?: (value: number) => string
}

export function EnhancedRangeSlider({
  value,
  onValueChange,
  min,
  max,
  step,
  className,
  formatLabel = (val) => `₹${val}k`,
}: EnhancedRangeSliderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Value Display */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Salary Per Month</span>
        <span className="font-medium text-gray-900">
          {formatLabel(value[0])} - {formatLabel(value[1])}
        </span>
      </div>

      {/* Minimal Black Slider */}
      <div className="relative px-2">
        <SliderPrimitive.Root
          className="relative flex w-full touch-none select-none items-center"
          value={value}
          onValueChange={onValueChange}
          max={max}
          min={min}
          step={step}
        >
          {/* Thin Black Track */}
          <SliderPrimitive.Track className="relative h-0.5 w-full grow overflow-hidden rounded-full bg-gray-300">
            {/* Black Range */}
            <SliderPrimitive.Range className="absolute h-full bg-black rounded-full" />
          </SliderPrimitive.Track>

          {/* Min Thumb - Small Black Circle */}
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-white bg-black shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-800 cursor-grab active:cursor-grabbing" />

          {/* Max Thumb - Small Black Circle */}
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-white bg-black shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-800 cursor-grab active:cursor-grabbing" />
        </SliderPrimitive.Root>
      </div>
    </div>
  )
}
