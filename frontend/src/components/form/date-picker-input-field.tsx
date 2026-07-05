import { useState } from "react";
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerInputProps<TFieldValues extends FieldValues> {
  stringDate: string
  setStringDate: (param: string) => void
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  label: string
  required?: boolean
}

export function DatePickerInputField<TFieldValues extends FieldValues>({
  stringDate, 
  setStringDate,
  name, 
  control, 
  label, 
  required = false
}: DatePickerInputProps<TFieldValues>) {
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={ ({ field }) => (
          <FormItem className='text-left'>
            <FormLabel>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <div className="relative">
                  <Input
                    type="string"
                    value={stringDate}
                    onChange={(e) => {
                      setStringDate(e.target.value)
                      const parsedDate = parse(e.target.value, 'dd/MM/yyyy', new Date())
                      if (parsedDate.toString() === "Invalid Date") {
                        setErrorMessage("Invalid Date")
                        field.onChange(undefined)
                      } else {
                        setErrorMessage("")
                        field.onChange(parsedDate)
                      }
                    }}
                  />
                  {/* TODO: Display it better! */}
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
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                </div>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    weekStartsOn={1}
                    selected={field.value}
                    onDayClick={(selectedDate) => {
                      if (!selectedDate) return
                      setStringDate(format(selectedDate, "dd/MM/yyyy"))
                      field.onChange(selectedDate)
                      setErrorMessage("")
                      setOpen(false)
                    }}
                    defaultMonth={field.value}
                  />
                </PopoverContent>
              </Popover>
              </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}