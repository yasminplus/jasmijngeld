import { AxiosError } from "axios"
import { CircleAlert } from "lucide-react"
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import MultipleSelector from '@/components/multiple-selector'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAllCurrencies, getCurrentSettings, updateSettings, type UserSettings } from '@/services/settings'
import { settingsOptionSchema, settingsFormSchema } from '@/schemas/settings'

export const Route = createFileRoute('/_dashboardLayout/settings')({
  component: SettingsComponent,
  loader: async () => await getCurrentSettings()
})

type OptionValue = z.infer<typeof settingsOptionSchema>

type FormValues = z.infer<typeof settingsFormSchema>

function convertToLabelValue(arr: string[]) {
  return arr.map(val => {
    return { label: val, value: val }
  })
}

function SettingsComponent() {
  const [currList, setCurrList] = useState([] as OptionValue[]) 
  const [currentSettings, settingsIdList] = Route.useLoaderData()
  const current: FormValues = {
    enabledCurrencies: convertToLabelValue(currentSettings.enabledCurrencies),
    defaultCurrency: currentSettings.defaultCurrency
  }
  
  const form = useForm<FormValues>({
    defaultValues: {
      enabledCurrencies: current.enabledCurrencies,
      defaultCurrency : current.defaultCurrency
    },
    resolver: zodResolver(settingsFormSchema),
  })
  const { errors, isSubmitting } = form.formState
  const watchEnabledCurr = form.watch('enabledCurrencies')
  /*
  TODO: BUG: if enabledCurrencies doesn't contain IDR, 
  it won't select the default currency automatically.
  even if in the form it seems that the default currency is empty,
  when submitted, it contains IDR.
   */

  async function onSubmit(data: FormValues) {
    console.log(data)
    const temp = data.enabledCurrencies.map(item => item.value)
    const payload: UserSettings = {
      enabledCurrencies: temp,
      defaultCurrency: data.defaultCurrency
    }

    updateSettings(payload, settingsIdList)
      .then(() =>
        toast.success("Settings successfully updated")
      )
      .catch(error => {
        console.error(error)
        if (error instanceof AxiosError) {
          form.setError("root.serverError", { 
            type: "custom", 
            message: error.response?.data.message 
          })
        }
      })
  }

  useEffect(() => {
    getAllCurrencies()
    .then(res => {
      setCurrList(convertToLabelValue(res))
    })
    .catch(error => {
      console.error(error)
    })
  }, [])

  return (
    <div className='w-66'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3 mx-auto'>
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
                    defaultOptions={currList} 
                    options={currList} 
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-muted-foreground">
                        No options.
                      </p>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      {watchEnabledCurr.map( choice => 
                        <SelectItem 
                          key={choice.value} 
                          value={choice.label}
                        >
                          {choice.label}
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
          {errors.root?.serverError.type === "custom" && 
            <div className="text-sm text-destructive flex flex-row gap-2">
              <CircleAlert/> <span className="pt-0.5">{errors.root?.serverError.message} </span>
            </div>
          }
        </form>
      </Form>
    </div>
  )
}
