"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Link } from "@tanstack/react-router"
import { ArrowUpDown, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"

import { PaymentSource } from '@/services/accounts-cards' 

export const sourcesColumns: ColumnDef<PaymentSource>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "source_type",
    header: ({ column }) => {
      return (
        <Button variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Source type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "acc_identifier",
    header: "Account identifier",
    cell: props => (
      <span>
        {`${ props.getValue() == '' ? '-' : props.getValue()}`}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const source = row.original
 
      return (
        <Link to="/accountscards/$sourceId/edit" params={{ sourceId: source.id}}>
          <Button className='p-0 w-8 h-8'>
            <Pencil />
          </Button>
        </Link>
      )
    },
  },
]

