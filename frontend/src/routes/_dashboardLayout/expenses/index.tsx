import { Plus } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, createFileRoute, useRouterState } from '@tanstack/react-router'
import { toast } from "sonner"

import { Button } from '@/components/ui/button'

import { expensesColumns } from '@/components/expenses/columns-exp'
import { DataTable } from '@/components/expenses/data-table'
import { AlertDelete } from "@/components/alert-delete"
import ExpenseRow from "@/components/dashboard/expense-row"
import ExpenseRowMenu from "@/components/dashboard/expense-row-menu"
import { useIsMobile } from "@/hooks/use-mobile"

import { 
  type Expense, 
  deleteExpense, 
  getExpenseList,
} from '@/services/expenses'

export const Route = createFileRoute('/_dashboardLayout/expenses/')({
  component: ListExpenses,
})

// num of rows added to the mobile list each time the sentinel scrolls into view
const MOBILE_PAGE_SIZE = 50

function ListExpenses() {
  const state = useRouterState({ select: s => s.location.state });
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [cols, setCols] = useState(expensesColumns)
  const [totalData, setTotalData] = useState(0)
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()
  // number of rows currently rendered in the mobile list
  // starts at MOBILE_PAGE_SIZE and increments by that amount 
  // each time the sentinel scrolls into view
  const [visibleCount, setVisibleCount] = useState(MOBILE_PAGE_SIZE)
  // the target element for the infinite scroll observer, 
  // which is only rendered when there are more rows to load
  const sentinelRef = useRef<HTMLDivElement>(null)
  // boolean, to be used to display the sentinel
  const hasMore = visibleCount < expenses.length

  const fetchTableData = useCallback(() => {
    getExpenseList()
    .then(results => {
      setExpenses(results.rows)
      setTotalData(results.total)
      setLoading(false)
    })
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
    if (state.message)
      toast.success(state.message)
  }, [state])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  useEffect(() => {
    const handleDelete = async(expense: Expense) => {
      const amount = `${expense.amount} ${expense.currency}`
      try {
        const success = await deleteExpense(expense.id)
        if (success) {
          fetchTableData()
          // fetchDataPaginated(pagination)
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

    if (cols.length == 8) {
      setCols(prev => [
        ...prev,
        {
          id: "delete_action",
          header: '',
          cell: ({ row }) => {
            const expense = row.original
            return (
              <AlertDelete handleDelete={handleDelete} record={expense} recordType="expense" />
          )},
        }
      ])
    }
  } , [cols, fetchTableData])

  // Infinite scroll for the mobile list: an empty sentinel div sits after
  // the last rendered row, and when it nears the viewport we render more.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    // create the observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount(n => n + MOBILE_PAGE_SIZE)
      },
      { rootMargin: "200px" }
    )
    // start observing the sentinel
    observer.observe(el)
    return () => observer.disconnect()
  }, [isMobile, hasMore, visibleCount])
  // 3 dependencies:
  // isMobile: useIsMobile starts as false even on a phone, so the first
  // render is the desktop layout (no sentinel). re-run effect when it becomes true.
  // hasMore: initially false (expenses is empty until the fetch returns),
  // so there's no sentinel yet. re-run effect when data arrives and it becomes true.
  // at the end of the list it becomes false, thus we don't need to observe anymore  
  // visibleCount: we want to re-observe the sentinel after each batch renders. 
  // if sentinel is still on a screen after a batch renders (e.g. a tall screen), 
  // the next batch loads too. 

  if (isMobile) {
    return (
      <div>
        <h1 className="font-display text-[26px] mt-4 mb-[14px]">Expenses</h1>
        <div className="flex flex-col">
          {expenses.slice(0, visibleCount).map(exp => (
            <ExpenseRow
              key={exp.id}
              expense={exp}
              actions={<ExpenseRowMenu expense={exp} onDeleted={fetchTableData} />}
            />
          ))}
          {hasMore && <div ref={sentinelRef} className="h-px" />}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link to={'/expenses/new'} >
        <Button className='mb-4'>
          <Plus />Add new expense
        </Button>
      </Link>

      <DataTable 
        columns={cols} 
        data={expenses}
        totalData={totalData}
        loading={loading}
      />
    </div>
  )
}
