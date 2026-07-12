import type { ReactNode } from 'react'

export function Container({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1120px] px-7 max-[480px]:px-[20px] ${className}`}>{children}</div>
}
