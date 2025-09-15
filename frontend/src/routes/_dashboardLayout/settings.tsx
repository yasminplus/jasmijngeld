import { SelectInputField } from '@/components/form/select-input-field'
import MultipleSelector, { type Option } from '@/components/multiple-selector'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CURRENCY_CHOICES } from '@/services/expenses'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import z from 'zod'

export const Route = createFileRoute('/_dashboardLayout/settings')({
  component: SettingsComponent,
})

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  enabledCurrencies: z.array(optionSchema).min(1),
  defaultCurrency: z.string()
})

type FormValues = z.infer<typeof formSchema>

function SettingsComponent() {
  const form = useForm<FormValues>({
    defaultValues: {
      enabledCurrencies: [{label: 'IDR', value: 'IDR'}],
      defaultCurrency : 'IDR'
    },
    resolver: zodResolver(formSchema),
  })
  const { isSubmitting } = form.formState

  async function onSubmit(data) {
    console.log(data)
  }

  const currencyList: Option[] = CURRENCY_CHOICES.map(c => {
    return {label: c, value: c}
  })
  const currencyList2 = CURRENCY_CHOICES.map(c => {
    return {id: c, name: c}
  })

  return (
    <div className='w-60'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
          <FormField
            control={form.control}
            name="enabledCurrencies"
            render={({ field}) => (
              <FormItem>
                <FormLabel>
                  Enabled currencies <span className="text-destructive"> *</span>
                </FormLabel>
                <FormControl>
                  <MultipleSelector 
                    {...field}
                    defaultOptions={currencyList} 
                    options={currencyList} 
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* <SelectInputField
            name='defaultCurrency'
            control={form.control}
            label='Default currency'
            options={currencyList2}
          /> */}

          <FormField
            control={form.control}
            name="defaultCurrency"
            render={({ field }) => (
              <FormItem className='text-left'>
                <FormLabel>
                  Default currency <span className="text-destructive"> *</span>
                </FormLabel> 
                <FormControl>
                  <Select
                    // try either this or the line below
                    // defaultValue={expense? expense.source_type : undefined} 
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select default currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyList2.map( choice => 
                        <SelectItem 
                          key={choice.id} 
                          value={choice.name}
                        >
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

          <Button disabled={isSubmitting} type='submit'>
            Save
          </Button>

        </form>
      </Form>
    </div>
  )
}
