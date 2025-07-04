"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Button } from "../ui/button"
import { CURRENCY_CHOICES } from "@/services/expenses"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const currency_options = CURRENCY_CHOICES.map(val => {return {label: val, value: val}})

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <span className="flex items-center gap-x-2">
      {/* TODO: 
        - BUG - if both IDR and EUR are selected, nothing is shown 
        - Add other filters in the headers here
      */}
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