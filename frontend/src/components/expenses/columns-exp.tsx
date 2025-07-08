"use client"

import { 
  ColumnDef
 } from "@tanstack/react-table"
import { Link } from "@tanstack/react-router"
import { parse } from "date-fns"
import { ArrowUpDown, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Expense } from '@/services/expenses'

export const expensesColumns: ColumnDef<Expense>[] = [
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
    footer: ({ table }) => {
      const currencies = table.getColumn("currency")?.getFilterValue() as Array<string>
      if (currencies && currencies.length == 1) {
        const sum = table.getFilteredRowModel().rows.reduce((total, row) => total + Number(row.getValue('amount')), 0)
        return sum.toFixed(2)
      } else {
        return '-'
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
  },
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