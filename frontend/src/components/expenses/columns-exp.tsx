"use client"

import { parse } from 'date-fns';
import { ArrowUpDown, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { type Expense } from '@/services/expenses';
import { Link } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';

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
      if (table.getFilteredRowModel().rows.length > 0) {
        const currencies = table.getColumn("currency")?.getFilterValue() as Array<string>
        if (currencies && currencies.length == 1) {
          return 'Total'
        }
      }
    },
  },
  {
    accessorKey: "amount",
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
    cell: ({row}) => {
      const expense = row.original
      const amt = expense.amount.toLocaleString()
      return amt
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
          const sum = filteredData.reduce((total, row) => total + Number(row.getValue('amount')), 0)
          const [, decimalPart] = sum.toFixed(2).split('.')
          let fractionDigits = 0
          if (decimalPart !== '00') {
            fractionDigits = 2
          }
          return sum.toLocaleString(undefined, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
          })

        }
      }
    },
  },
  {
    accessorKey: "currency",
    header: ({ column }) => {
      return (
        <Button variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Currency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId))
    },
    footer: ({ table }) => {
      if (table.getFilteredRowModel().rows.length > 0) {
        const currencies = table.getColumn("currency")?.getFilterValue() as Array<string>
        if (currencies && currencies.length == 1) {
          return currencies[0]
        }
      }
    },
  },
  {
    accessorKey: "description",
    header: 'Description',
  },
  {
    accessorKey: "store",
    header: 'Store',
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
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId))
    },
  },
  {
    id: "edit_action",
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