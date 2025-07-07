"use client"

import { Table } from "@tanstack/react-table"
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
import { Button } from "../ui/button"
import { Input } from "../ui/input"

import { 
  CURRENCY_CHOICES,
  getExpenseCategories,
  getStoreList
} from '@/services/expenses'
import { getPaymentSourceList } from "@/services/accounts-cards"
import { DatePickerInput } from "../date-picker-input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

interface DTFacetedFilterPropsOption<> {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

type DateRange = { start?: Date | null; end?: Date | null }
type RangeType = "this_month" | "last_month" | ""

function arr_to_options(arr: string[]) {
  return arr.map(val => ({ label: val, value: val }));
}
function arr_to_options_typed<T extends { name: string }>(arr: T[]) {
  return arr.map(val => ({ label: val.name, value: val.name }));
}

const currency_options = arr_to_options(CURRENCY_CHOICES)

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

  const isFiltered = table.getState().columnFilters.length > 0

  const fetchSelectOptions = useCallback(() => {
    Promise.all([getExpenseCategories(), getStoreList(), getPaymentSourceList()])
    .then(results => {
      setCategoryOptions(arr_to_options_typed(results[0]))
      setStoreOptions(arr_to_options_typed(results[1]))
      setSourceOptions(arr_to_options_typed(results[2]))
    })
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
    fetchSelectOptions()
  }, [fetchSelectOptions]) 

  function clearFilters() {
    table.resetColumnFilters()
    setStartDate(undefined)
    setEndDate(undefined)
    setStringStartDate("")
    setStringEndDate("")
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

  function changeRangeType(rangeType: RangeType) {
    setRangeType(rangeType)
    const today = new Date()
    const cur_mo = today.getMonth()
    let year = today.getFullYear()
    let s_start = '', s_end = ''
    let d_start = new Date(), d_end = new Date()

    if (rangeType === 'this_month') {
      s_start = `01/` + `${cur_mo + 1}`.padStart(2, '0') + `/${year}`
      d_start = parse(s_start, 'dd/MM/yyyy', d_start)

      d_end = lastDayOfMonth(d_start)
      s_end = format(d_end, 'dd/MM/yyyy')

    } else if (rangeType === 'last_month') {
      year -= cur_mo !== 11? 0 : -1
      s_start = `01/` + `${cur_mo}`.padStart(2, '0') + `/${year}`
      d_start = parse(s_start, 'dd/MM/yyyy', d_start)

      d_end = lastDayOfMonth(d_start)
      s_end = format(d_end, 'dd/MM/yyyy')
    } 
    setStringStartDate(s_start)
    setStartDate(d_start)
    setStringEndDate(s_end)
    setEndDate(d_end)
  }

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Filter by description"
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('currency') && (
          <DataTableFacetedFilter
            column={table.getColumn("currency")}
            title="Currency"
            options={currency_options}
          />
        )}
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
          onDateChange={setStartDate} date={startDate} 
          stringDate={stringStartDate} setStringDate={setStringStartDate} />
        {/* TODO: validate that endDate >= startDate */}
        <DatePickerInput 
          onDateChange={setEndDate} date={endDate} 
          stringDate={stringEndDate} setStringDate={setStringEndDate} />
      </div>
    </div>
  )

}