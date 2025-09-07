import { useState } from 'react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
                      {options.map((option) => (
                      <CommandItem
                        key={option.name}
                        value={option.name}
                        onSelect={(val) => {
                          field.onChange(val)
                          setOpen(false)
                        }}
                        // TODO: add Check icon on selected item in the list
                        // TODO: how to add remove functionality?
                      >
                        {option.name}
                      </CommandItem>
                    ))}
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