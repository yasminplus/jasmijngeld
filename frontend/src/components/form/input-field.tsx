import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface InputFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>,
  control: Control<TFieldValues>,
  label: string,
  required?: boolean,
  type?: string
}

export function InputField<TFieldValues extends FieldValues>({ 
  name, 
  control, 
  label, 
  required = false, 
  type = 'text' 
}: InputFieldProps<TFieldValues>) {

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
              <Input
                value={field.value || ""}
                onChange={field.onChange}
                type={type}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}