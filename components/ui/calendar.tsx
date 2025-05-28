"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns"
import { ru } from "date-fns/locale"

export interface CalendarProps {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | { from: Date; to: Date }
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  initialFocus?: boolean
  className?: string
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  initialFocus,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  const days = React.useMemo(() => {
    const firstDayOfMonth = startOfMonth(currentMonth)
    const lastDayOfMonth = endOfMonth(currentMonth)
    const startDate = startOfWeek(firstDayOfMonth)
    const endDate = endOfWeek(lastDayOfMonth)
    
    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [currentMonth])
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }
  
  const handleSelectDate = (day: Date) => {
    if (disabled?.(day)) return
    onSelect?.(day)
  }
  
  const isSelectedDate = (day: Date) => {
    if (!selected) return false
    
    if (mode === "single" && selected instanceof Date) {
      return isSameDay(day, selected)
    }
    
    return false
  }
  
  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePreviousMonth}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Предыдущий месяц</span>
        </button>
        <div className="text-sm font-medium">
          {format(currentMonth, "LLLL yyyy", { locale: ru })}
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Следующий месяц</span>
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 text-center text-xs leading-6 text-muted-foreground">
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Вс</div>
      </div>
      <div className="mt-2 grid grid-cols-7 text-center">
        {days.map((day, dayIdx) => (
          <div
            key={dayIdx}
            className={cn(
              "py-1.5",
              dayIdx === 0 && `col-start-${day.getDay() || 7}`
            )}
          >
            <button
              type="button"
              onClick={() => handleSelectDate(day)}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full p-0 text-sm font-normal ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50",
                isSelectedDate(day) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                isToday(day) && !isSelectedDate(day) && "border border-input",
                disabled?.(day) && "pointer-events-none opacity-50"
              )}
              disabled={disabled?.(day)}
              tabIndex={initialFocus && dayIdx === 0 ? 0 : -1}
            >
              {format(day, "d")}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}