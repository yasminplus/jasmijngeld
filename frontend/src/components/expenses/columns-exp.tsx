"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Link } from "@tanstack/react-router"
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
  },
  {
    accessorKey: "description",
    header: 'Description',
  },
  {
    accessorKey: "store",
    header: 'Store',
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