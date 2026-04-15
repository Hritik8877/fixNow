import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 select-none", className)}
      classNames={{
        months: "relative",
        month: "space-y-4",
        month_caption: "flex justify-center items-center h-10 mb-2 relative",
        caption_label: "text-sm font-bold font-manrope",
        nav: "absolute inset-x-0 top-0 flex justify-between items-center h-10 px-1 z-10",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 rounded-full opacity-60 hover:opacity-100 hover:bg-zinc-100 transition-all"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 rounded-full opacity-60 hover:opacity-100 hover:bg-zinc-100 transition-all"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "",
        weekday: "text-zinc-400 w-9 h-9 font-semibold text-[11px] uppercase text-center align-middle",
        week: "",
        day: "p-0 h-9 w-9 text-center align-middle",
        day_button: cn(
          "h-9 w-9 rounded-full font-medium transition-colors text-sm",
          "hover:bg-zinc-100 text-foreground cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        ),
        selected: "!bg-blue-600 !text-white hover:!bg-blue-700 shadow-md",
        today: "bg-zinc-100 font-bold",
        outside: "text-zinc-300 opacity-50 pointer-events-none",
        disabled: "text-zinc-300 opacity-50 pointer-events-none cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
