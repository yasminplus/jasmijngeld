import { useState } from "react"
import { Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'

interface AlertDeleteDialogProps<TData> {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  handleDelete: (record: TData) => Promise<void>,
  record: TData
  recordType: string,
}

// The dialog with no trigger. 
// For callers (e.g. a DropdownMenuItem) that must setup
// the open state themselves rather than nesting a trigger here.
export function AlertDeleteDialog<TData>({
  open,
  onOpenChange,
  handleDelete,
  record,
  recordType,
}: AlertDeleteDialogProps<TData>) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this {recordType}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {recordType} and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(record)}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface AlertDeleteProps<TData> {
  handleDelete: (record: TData) => Promise<void>,
  record: TData
  recordType: string,
}

// Self-contained wrapper: has its own trigger button and open state.
export function AlertDelete<TData>({ handleDelete, record, recordType }: AlertDeleteProps<TData>) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button className="p-0 w-8 h-8" onClick={() => setOpen(true)}>
        <Trash />
      </Button>
      <AlertDeleteDialog
        open={open}
        onOpenChange={setOpen}
        handleDelete={handleDelete}
        record={record}
        recordType={recordType}
      />
    </>
  );
}