import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CURRENCY_CHOICES } from '@/services/expenses';

interface Props {
  currency: string
  setCurrency: (val: string) => void
}
export default function CurrencyRadioGroup({ currency, setCurrency } :Props ) {
  return (
    <RadioGroup value={currency} onValueChange={setCurrency} className='pb-4 pt-3' >
      <div className='flex flex-row justify-start space-x-10'>
        { CURRENCY_CHOICES.map(cur => {
          return (
            <div className="flex flex-row space-x-2" key={cur}>
                <RadioGroupItem value={cur} id={cur} />
                <Label htmlFor={cur}>{cur}</Label>
              </div>
          )
        })
      }
      </div>
    </RadioGroup>
  )
}