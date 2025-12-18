"use client"

import { useMemo, useState } from "react"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTableToolbar } from '@/components/expenses/data-table-toolbar'
import { DataTablePagination } from "./data-table-pagination"

const DEFAULT_PAGE_SIZE = 20

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  totalData: number,
  loading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalData, 
  loading
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // can set initial column filter state here
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: DEFAULT_PAGE_SIZE, //default page size
  });

  const [columnVisibility] = useState({
    date: true,
    amountCurrency: true,
    currency: false, // hide this column by default
    description: true,
    store: true,
    category: true,
    source: true,
    edit_action: true,
  });

  const tableData = useMemo(
    () => (loading? Array(20).fill({}) : data),
    [loading, data]
  )

  const tableColumns = useMemo(
    () => 
      loading
        ? columns.map((column) => ({
          ...column,
          cell: () => <Skeleton className="h-[20px] m-2 rounded-xl" />,
          accessorFn: () => ''
        }))
      : columns,
    [loading, columns]
  )

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // needed for client-side filtering
    getFacetedRowModel: getFacetedRowModel(), //if you need a list of values for a column (other faceted row models depend on this one)
    getFacetedUniqueValues: getFacetedUniqueValues(), //if you need a list of unique values
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    rowCount: totalData
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                          // TODO: decide which sorting UI we want to use
                            // {...{
                            //   className: header.column.getCanSort()
                            //     ? 'cursor-pointer select-none'
                            //     : '',
                            //   onClick: header.column.getToggleSortingHandler(),
                            // }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {/* {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null} */}
                          </div>
                        </>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map(footerGroup => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}