import { InputHTMLAttributes, useEffect, useMemo, useState } from "react";
import { Column } from "@tanstack/react-table";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Filter({ column }: {column: Column<any, unknown>}) {
  const { filterVariant } = column.columnDef.meta ?? {}

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      filterVariant === 'range'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 100),
    // [column, filterVariant]
    [column.getFacetedUniqueValues(), filterVariant]
  )

  return filterVariant === 'range' ? (
    <div>
      <p>Filter for Range</p>
    </div>
  ) : filterVariant === 'select' ? (
    // TODO: shadcn Select is not working
    // <Select
    //   value={columnFilterValue?.toString()}
    //   onValueChange={val => {
    //     val = val === "All" ? "" : val
    //     column.setFilterValue(val)
    //   } 
    // }
    // >
    //   <SelectTrigger className="">
    //     <SelectValue placeholder="All" />
    //   </SelectTrigger>
    //   <SelectContent>
    //     <SelectItem value="All">All</SelectItem>
    //     {sortedUniqueValues.map( value => (
    //       //dynamically generated select options from faceted values feature
    //       <SelectItem key={value} value={value.name}>
    //         {value}
    //       </SelectItem>
    //     ))}
    //   </SelectContent>
    // </Select>

    <select className="text-white"
      value={columnFilterValue?.toString()}
      onChange={e => column.setFilterValue(e.target.value)}
    >
      <option value="">All</option>
      {sortedUniqueValues.map(value => (
        //dynamically generated select options from faceted values feature
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </select>
  ) : (
    <>
    <DebouncedInput
      className="w-36 my-1 border shadow rounded"
      onChange={value => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
    </>
  )
}

// A typical debounced input react component
// From tanstack table example
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [debounce, onChange, value])

  return (
    <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}