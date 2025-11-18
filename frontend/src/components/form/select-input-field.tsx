import { useState } from 'react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { CheckIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from "@/lib/utils";
import { Separator } from '@/components/ui/separator';

interface OptionType {
  id: string | number
  name: string
}

interface SelectInputFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>,
  control: Control<TFieldValues>,
  label: string,
  required?: boolean,
  options: OptionType[],
}

export function SelectInputField<TFieldValues extends FieldValues>({ 
  name,
  control,
  label,
  required = false,
  options,
}: SelectInputFieldProps<TFieldValues>) {
  const [open, setOpen] = useState(false)
  const onClearAllOptions = (fieldOnChange) => {
    fieldOnChange('')
    setOpen(false)
  };

  return (
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
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={`h-9 text-sm justify-between ${ !field.value && 'text-muted-foreground' }`}>
                  {field.value
                  ? options.find((option) => option.name === field.value)?.name
                  : `Select ${name}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-max p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search..."  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => {
                        const isSelected = field.value === option.name
                        return (
                        <CommandItem
                          key={option.name}
                          value={option.name}
                          onSelect={(val) => {
                            field.onChange(val)
                            setOpen(false)
                          }}
                        >
                          <div
                            className={cn(
                              "mr-1 flex h-4 w-4 items-center justify-center",
                              isSelected ? "text-primary" : "invisible"
                            )}
                          >
                            <CheckIcon className="w-4 h-4" />
                          </div>
                          <span>
                            {option.name}
                          </span>
                        </CommandItem>
                      )}
                    )}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <div className="flex items-center justify-between">
                      {field.value && (
                        <>
                          <CommandItem
                            onSelect={() => onClearAllOptions(field.onChange)}
                            className="justify-center flex-1 cursor-pointer"
                          >
                            Clear
                          </CommandItem>
                          <Separator
                            orientation="vertical"
                            className="flex h-full mx-2 min-h-6"
                          />
                        </>
                      )}
                      <CommandItem
                        onSelect={() => setOpen(false)}
                        className="justify-center flex-1 max-w-full cursor-pointer"
                      >
                        Close
                      </CommandItem>
                    </div>
                  </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
        </FormControl>
        <FormMessage />
      </FormItem>
      )}
    />
  )
}