import { useState } from 'react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { useCommandState } from 'cmdk';
import { CheckIcon, Loader2, PlusIcon } from "lucide-react";
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
  onCreateOption?: (name: string) => Promise<boolean>
}

function CommandInputWithCreate({
  searchValue,
  onSearchChange,
  onCreateOption,
  loadingCreateOption,
  onCreate,
}: {
  searchValue: string
  onSearchChange: (val: string) => void
  onCreateOption?: (name: string) => Promise<boolean>
  loadingCreateOption: boolean
  onCreate: () => void
}) {
  const count = useCommandState(state => state.filtered.count)

  return (
    <CommandInput
      placeholder="Search..."
      onValueChange={onSearchChange}
      onKeyDown={(e) => {
        if (
          e.key === 'Enter' &&
          count === 0 &&
          searchValue &&
          onCreateOption &&
          !loadingCreateOption
        ) {
          e.preventDefault()
          onCreate()
        }
      }}
    />
  )
}

export function SelectInputField<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  required = false,
  options,
  onCreateOption
}: SelectInputFieldProps<TFieldValues>) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [loadingCreateOption, setLoadingCreateOption] = useState(false)

  const onClearAllOptions = (fieldOnChange: (value: string) => void) => {
    fieldOnChange('');
    setOpen(false);
  };

  async function handleCreate() {
    if (loadingCreateOption) return
    setLoadingCreateOption(true)
    try {
      const success = await onCreateOption!(searchValue)
      if (success) {
        setOpen(false)
        setSearchValue('')
      }
    } finally {
      setLoadingCreateOption(false)
    }
  }

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
                  <CommandInputWithCreate
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onCreateOption={onCreateOption}
                    loadingCreateOption={loadingCreateOption}
                    onCreate={handleCreate}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {searchValue && onCreateOption ? (
                        <div
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 mx-1 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                            loadingCreateOption && 'hover:bg-muted hover:text-muted-foreground cursor-wait'
                          )}
                          onClick={handleCreate}
                        >
                          {loadingCreateOption
                            ? <Loader2 className="size-4 shrink-0 animate-spin" />
                            : <PlusIcon className="size-4 shrink-0" />
                          }
                          <span>Add "<span className="font-medium">{searchValue}</span>"</span>
                        </div>
                      ) : (
                        'No results found.'
                      )}
                    </CommandEmpty>
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