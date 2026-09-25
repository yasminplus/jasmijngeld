import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner"
import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AlertDeleteDialog } from "@/components/alert-delete";
import { deleteExpense, type Expense } from "@/services/expenses";

interface Props {
  expense: Expense,
  onDeleted?: () => void,
}

export default function ExpenseRowMenu({expense, onDeleted}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDelete = async() => {
    const amount = `${expense.amount} ${expense.currency}`
    try {
      const success = await deleteExpense(expense.id)
      if (success) {
        onDeleted?.()
        toast.success(`Expense with the amount ${amount} has been deleted`)
      } else {
        throw new Error('API return false')
      }
    }
    catch (err) {
      toast.error(`Unable to delete expense with the amount ${amount}.`)
      console.error(err)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon"
            className="h-auto w-auto p-1 text-faint"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/expenses/$expId/edit" params={{ expId: String(expense.id) }}>
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setTimeout(() => setConfirmOpen(true), 0)
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        handleDelete={handleDelete}
        record={expense}
        recordType="expense"
      />
    </>
  )
}