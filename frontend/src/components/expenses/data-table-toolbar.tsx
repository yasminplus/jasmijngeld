"use client"

import { type Table } from "@tanstack/react-table"
import { useCallback, useEffect, useState } from "react"
import { 
  format, 
  isFirstDayOfMonth, 
  isLastDayOfMonth, 
  lastDayOfMonth, 
  parse 
} from "date-fns"
import { X } from "lucide-react"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePickerInput } from "@/components/date-picker-input"

import { useExpenseStatic } from "@/context/expense-static"
import { useGlobalDataContext } from "@/context/globaldata"
import { getPaymentSourceList } from "@/services/accounts-cards"
import {
  getStoreList
} from '@/services/expenses'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

interface DTFacetedFilterPropsOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

type DateRange = { start?: Date | null; end?: Date | null }
type RangeType = "this_month" | "last_month" | ""

type AmountRange = { min?: number | null; max?: number | null }

function arr_to_options(arr: string[]) {
  return arr.map(val => ({ label: val, value: val }));
}
function arr_to_options_typed<T extends { name: string }>(arr: T[]) {
  return arr.map(val => ({ label: val.name, value: val.name }));
}

const DATE_FORMAT = 'yyyy-MM-dd'

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  // options for the filter, later we should move it up and do this only once when the app first loads
  const [categoryOptions, setCategoryOptions] = useState<DTFacetedFilterPropsOption[]>([])
  const [storeOptions, setStoreOptions] = useState<DTFacetedFilterPropsOption[]>([])
  const [sourceOptions, setSourceOptions] = useState<DTFacetedFilterPropsOption[]>([])
  // for date range picker
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [stringStartDate, setStringStartDate] = useState<string>("")
  const [stringEndDate, setStringEndDate] = useState<string>("")
  const [rangeType, setRangeType] = useState<RangeType>("")
  const [minAmount, setMinAmount] = useState<string>()
  const [maxAmount, setMaxAmount] = useState<string>()

  const isFiltered = table.getState().columnFilters.length > 0

  const globalDataContext = useGlobalDataContext()
  const currency_options = arr_to_options(globalDataContext.enabledCurrencies)

  const expStatic = useExpenseStatic()

  const fetchSelectOptions = useCallback(() => {
    Promise.all([getStoreList(), getPaymentSourceList()])
    .then(results => {
      setStoreOptions(arr_to_options_typed(results[0]))
      setSourceOptions(arr_to_options_typed(results[1]))
    })
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
    fetchSelectOptions()
  }, [fetchSelectOptions])

  useEffect(() => {
    setCategoryOptions(arr_to_options_typed(expStatic.categories))
  }, [expStatic.categories])

  function clearFilters() {
    table.resetColumnFilters()
    setStartDate(undefined)
    setEndDate(undefined)
    setStringStartDate("")
    setStringEndDate("")
    setMinAmount(undefined)
    setMaxAmount(undefined)
  }

  const updateRangeType = useCallback(() => {
    if (rangeType == '') return

    if (!startDate || !endDate) {
      setRangeType('')
    }
    else if (startDate && endDate) {
      const today = new Date()
      // kalo bulan start&end beda, dan bulannya bukan today's month
      if ( (startDate.getMonth() != endDate.getMonth()) ||
        (today.getMonth() != startDate.getMonth() &&
        today.getMonth() - 1 != startDate.getMonth()) ) {
          setRangeType('')
      }
      else if (!isFirstDayOfMonth(startDate) || !isLastDayOfMonth(endDate)) {
        setRangeType('')
      }
    }
  }, [startDate, endDate, rangeType])

  useEffect(() => {
    const currentRange: DateRange = (table.getColumn("date")?.getFilterValue() as DateRange) ?? {}
    currentRange.start = startDate
    table.getColumn("date")?.setFilterValue(currentRange)
    updateRangeType()
  }, [startDate, table, updateRangeType])

  useEffect(() => {
    const currentRange: DateRange = (table.getColumn("date")?.getFilterValue() as DateRange) ?? {}
    currentRange.end = endDate
    table.getColumn("date")?.setFilterValue(currentRange)
    updateRangeType()
  }, [endDate, table, updateRangeType])

  function changeRangeType(newRangeType: RangeType) {
    if (rangeType == newRangeType) {
      setRangeType('')
      setStringStartDate('')
      setStartDate(undefined)
      setStringEndDate('')
      setEndDate(undefined)
    }
    else {
      let strStart = '', strEnd = ''
      let dateStart = new Date(), dateEnd = new Date()
      setRangeType(newRangeType)
      const today = new Date()
      let mo = today.getMonth() + 1     // today.getMonth() is 0-based
      let year = today.getFullYear()

      if (newRangeType) {
        if (newRangeType === 'last_month') {
          year -= mo !== 1? 0 : 1
          mo = mo - 1 > 0 ? mo - 1 : 12
        }
        const moPadded = `${mo}`.padStart(2, '0')
        strStart = `${year}-${moPadded}-01`
        dateStart = parse(strStart, DATE_FORMAT, dateStart)
        dateEnd = lastDayOfMonth(dateStart)
        strEnd = format(dateEnd, DATE_FORMAT)
      }

      setStringStartDate(strStart)
      setStartDate(dateStart)
      setStringEndDate(strEnd)
      setEndDate(dateEnd)
    }
  }

  useEffect(() => {
    const currentRange: AmountRange = (table.getColumn("amountCurrency")?.getFilterValue() as AmountRange) ?? {}
    currentRange.min = minAmount ? Number(minAmount) : undefined
    table.getColumn("amountCurrency")?.setFilterValue(currentRange)
  }, [minAmount, table])

  useEffect(() => {
    const currentRange: AmountRange = (table.getColumn("amountCurrency")?.getFilterValue() as AmountRange) ?? {}
    currentRange.max = maxAmount ? Number(maxAmount) : undefined
    table.getColumn("amountCurrency")?.setFilterValue(currentRange)
  }, [maxAmount, table])

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Filter by description"
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] text-sm"
        />
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categoryOptions}
          />
        )}
        {table.getColumn("store") && (
          <DataTableFacetedFilter
            column={table.getColumn("store")}
            title="Store"
            options={storeOptions}
          />
        )}
        {table.getColumn("source") && (
          <DataTableFacetedFilter
            column={table.getColumn("source")}
            title="Source"
            options={sourceOptions}
          />
        )}
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <Button 
            variant={rangeType === 'this_month' ? 'default' : 'outline'}
            onClick={() => changeRangeType("this_month")}
          >
          This month
        </Button>
        <Button 
            variant={rangeType === 'last_month' ? 'default' : 'outline'}
            onClick={() => changeRangeType("last_month")}
          >
          Last month
        </Button>
        <DatePickerInput 
          placeholder="From date"
          onDateChange={setStartDate} date={startDate} 
          stringDate={stringStartDate} setStringDate={setStringStartDate} />
        {/* TODO: validate that endDate >= startDate */}
        <DatePickerInput 
          placeholder="To date"
          onDateChange={setEndDate} date={endDate} 
          stringDate={stringEndDate} setStringDate={setStringEndDate} />
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <Input
          type="number"
          placeholder="Min amount"
          value={minAmount? minAmount : ""}
          onChange={(event) =>
            setMinAmount(event.target.value)
          }
          className="h-9 w-[125px] text-sm"
        />
        <Input
          type="number"
          placeholder="Max amount"
          value={maxAmount? maxAmount : ""}
          onChange={(event) =>
            setMaxAmount(event.target.value)
          }
          className="h-9 w-[125px] text-sm"
        />
        {table.getColumn('currency') && (
          <DataTableFacetedFilter
            column={table.getColumn("currency")}
            title="Currency"
            options={currency_options}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => clearFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  )
}