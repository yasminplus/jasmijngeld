"use client"

import type { RowData, ColumnDef, Row } from "@tanstack/react-table"
import { Link } from '@tanstack/react-router';
import { parse } from 'date-fns';
import { ArrowUpDown, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import CategoryIcon from "@/components/category-icon";
import { type Expense } from '@/services/expenses';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

export const expensesColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      const dateDate = parse(row.getValue(columnId), "yyyy-MM-dd", new Date())
      const startOk = 'start' in filterValue && filterValue['start'] ? 
        dateDate >= filterValue['start'] : true
      const endOk = 'end' in filterValue && filterValue['end'] ? 
        dateDate <= filterValue['end'] : true
      return startOk && endOk 
    },
    footer: ({ table }) => {
      const filteredData = table.getFilteredRowModel().rows
      if (filteredData.length > 0) {
        const currencies = table.getColumn("currency")?.getFilterValue() as Array<string>
        const filteredCurrencies = new Set()
        if (!currencies) {
          filteredData.forEach(row => {
            filteredCurrencies.add(row.getValue('currency'))
          });
        }
        if (currencies && currencies.length == 1 || filteredCurrencies.size == 1) {
          return 'Total'
        }
      }
    },
  },
  {
    accessorKey: "description",
    header: 'Description',
    cell: ({ row }) => {
      const expense = row.original
      return (
        <div className="flex flex-row gap-2">
          {/* Handle mobile */}
          <div className="sm:hidden">
            <CategoryIcon 
              category={expense.category}
              iconSize="size-6"
              circleDia="43px"
            />
          </div>
          <div>
            <div className="">{expense.description}</div>
            <div className="sm:hidden text-muted-foreground">{expense.source}</div>
          </div>
        </div>
      )
    }
  },
  {
    id: 'amountCurrency',
    accessorFn: (row) => {
      return `${row.currency} ${row.amount.toLocaleString()}`
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    sortingFn: (rowA: Row<Expense>, rowB: Row<Expense>) => {
      return rowA.original.amount - rowB.original.amount
    },
    footer: ({ table }) => {
      const filteredData = table.getFilteredRowModel().rows
      if (filteredData.length > 0) {
        const currencies = table.getColumn("currency")?.getFilterValue() as Array<string>
        const filteredCurrencies = new Set()
        if (!currencies) {
          filteredData.forEach(row => {
            filteredCurrencies.add(row.getValue('currency'))
          });
        }
        if (currencies && currencies.length == 1 || filteredCurrencies.size == 1) {
          // const sum = filteredData.reduce((total, row) => total + Number(row.getValue('amount')), 0)
          const sum = filteredData.reduce((total, row) => total + Number(row.original.amount), 0)
          const [, decimalPart] = sum.toFixed(2).split('.')
          let fractionDigits = 0
          if (decimalPart !== '00') {
            fractionDigits = 2
          }
          const cur = currencies? currencies[0] : filteredCurrencies.values().next().value
          const total = sum.toLocaleString(undefined, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
          })
          return `${cur} ${total}`
        }
      }
    },
  },
  {
    accessorKey: "currency",
    header: 'Currency',
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId))
    },
  },
  {
    accessorKey: "store",
    header: 'Store',
    meta: {
      className: "hidden sm:table-cell"
    },
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId))
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    meta: {
      className: "hidden sm:table-cell"
    },
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId))
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => {
      return (
        <Button variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment source <source />
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    meta: {
      className: "hidden sm:table-cell"
    },
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId))
    },
  },
  {
    id: "edit_action",
    header: '',
    cell: ({ row }) => {
      const expense = row.original

      return (
        <Link to="/expenses/$expId/edit" params={{ expId: String(expense.id) }}>
          <Button className='p-0 w-8 h-8'>
            <Pencil />
          </Button>
        </Link>
      )
    },
  },
]