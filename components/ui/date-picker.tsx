"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
    date?: Date;
    onSelect?: (date: Date) => void;
    className?: string;
    disabled?: boolean;
    error?: string;
    label?: string;
    helperText?: string;
    containerClassName?: string;
    placeholder?: string;
    format?: string;
    minDate?: Date;
    maxDate?: Date;
    id?: string;
}

export function DatePicker({
    date,
    onSelect,
    className,
    disabled,
    error,
    label,
    helperText,
    containerClassName,
    placeholder = "Pick a date",
    format: dateFormat = "PPP",
    minDate,
    maxDate,
    id,
}: DatePickerProps) {
    const datePickerId = id || React.useId();
    const errorId = `${datePickerId}-error`;
    const helperId = `${datePickerId}-helper`;

    return (
        <div className={cn("space-y-2", containerClassName)}>
            {label && (
                <label
                    htmlFor={datePickerId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </label>
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={datePickerId}
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            error && "border-destructive focus:ring-destructive",
                            className
                        )}
                        disabled={disabled}
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={cn(
                            error && errorId,
                            helperText && helperId
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, dateFormat) : <span>{placeholder}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={onSelect}
                        initialFocus
                        disabled={disabled}
                        fromDate={minDate}
                        toDate={maxDate}
                    />
                </PopoverContent>
            </Popover>
            {error && (
                <p
                    id={errorId}
                    className="text-sm font-medium text-destructive"
                >
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p
                    id={helperId}
                    className="text-sm text-muted-foreground"
                >
                    {helperText}
                </p>
            )}
        </div>
    );
} 