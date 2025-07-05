"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

import { 
  CURRENCY_CHOICES,
  getExpenseCategories,
  getStoreList
} from '@/services/expenses';
import { getPaymentSourceList } from "@/services/accounts-cards"
import { useCallback, useEffect, useState } from "react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

interface DTFacetedFilterPropsOption<> {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

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
  const [categoryOptions, setCategoryOptions] = useState<DTFacetedFilterPropsOption[]>([])
  const [storeOptions, setStoreOptions] = useState<DTFacetedFilterPropsOption[]>([])
  const [sourceOptions, setSourceOptions] = useState<DTFacetedFilterPropsOption[]>([])
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

  return (
    <span className="flex items-center gap-x-2">
      {/* TODO: 
          BUG: for selections, if > 1 filter are selected/applied, nothing is shown
      */}
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
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
    </span>
  )

}