import { useState } from "react";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerInputProps {
  date: Date | undefined
  // onDateChange: Dispatch<SetStateAction<Date | undefined>>
  onDateChange: (param: Date | undefined) => void
  stringDate: string
  setStringDate: (param: string) => void
}

export function DatePickerInput({ date, onDateChange, stringDate, setStringDate}: DatePickerInputProps) {
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-[180px]">
        <Input
          type="string"
          value={stringDate}
          onChange={(e) => {
            setStringDate(e.target.value)
            const parsedDate = parse(e.target.value, 'dd/MM/yyyy', new Date())
            onDateChange(parsedDate)
            if (parsedDate.toString() === "Invalid Date") {
              setErrorMessage("Invalid Date")
              onDateChange(undefined)
            } else {
              setErrorMessage("")
              onDateChange(parsedDate)
            }
          }}
        />
        {errorMessage !== "" && (
          <div className="absolute bottom-[-1.75rem] left-0 text-red-400 text-sm">
            {errorMessage}
          </div>
        )}
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "font-normal absolute right-0 translate-y-[-50%] top-[50%] rounded-l-none",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date!}
          onSelect={(selectedDate) => {
            if (!selectedDate) return
            // setDate(selectedDate)
            setStringDate(format(selectedDate, "dd/MM/yyyy"))
            onDateChange(selectedDate)
            setErrorMessage("")
            setOpen(false)
          }}
          defaultMonth={date}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}