import { cn } from '@/lib/utils'

export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn('block text-[0.72rem] tracking-[0.18em] font-medium uppercase', className)}>
      {children}
    </span>
  )
}