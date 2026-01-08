import type { LucideIcon } from 'lucide-react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import {
  FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

export interface OptionType {
  id: string | number
  name: string
  iconObj?: LucideIcon
}
interface SelectFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>,
  control: Control<TFieldValues>,
  label?: string,
  required?: boolean,
  placeholder?: string,
  options: OptionType[]
}

export function SelectField<TFieldValues extends FieldValues>({ 
  name, 
  control, 
  label = '', 
  required = false, 
  placeholder = '',
  options
}: SelectFieldProps<TFieldValues>) {

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={ ({ field }) => (
          <FormItem className='text-left'>
            {label &&
              <FormLabel>
                {label}
                {required && <span className="text-destructive"> *</span>}
              </FormLabel>
            }
            <FormControl>
              <Select
                // if below does not work, try with defaultValue=x ? x : undefined
                value={field.value || ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map( choice => 
                    <SelectItem key={choice.id} value={choice.name}>
                      {choice.iconObj ? <choice.iconObj className="inline mr-2" /> : null}
                      {choice.name}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}