import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGlobalDataContext } from '@/context/globaldata';

interface Props {
  currency: string
  setCurrency: (val: string) => void
}
export default function CurrencyRadioGroup({ currency, setCurrency } :Props ) {
  const globalDataContext = useGlobalDataContext()

  return (
    <RadioGroup value={currency} onValueChange={setCurrency} className='pb-4 pt-3' >
      <div className='flex flex-row justify-start space-x-10'>
        { globalDataContext.enabledCurrencies.map(cur => {
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