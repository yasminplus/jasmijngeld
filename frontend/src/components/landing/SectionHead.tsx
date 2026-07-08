import { cn } from '@/lib/utils'
import { Eyebrow } from './Eyebrow'

export function SectionHead({
  eyebrow,
  eyebrowClassName,
  title,
  description,
  descriptionClassName,
}: {
  eyebrow: React.ReactNode
  eyebrowClassName?: string
  title: React.ReactNode
  description: React.ReactNode
  descriptionClassName?: string
}) {
  return (
    <div className="mb-[52px] max-w-[640px]">
      <Eyebrow className={cn('mb-[16px]', eyebrowClassName)}>{eyebrow}</Eyebrow>
      <h2 className="mb-[16px] font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.06] tracking-[-0.01em]">
        {title}
      </h2>
      <p className={cn('text-[1.08rem] leading-[1.6]', descriptionClassName)}>{description}</p>
    </div>
  )
}
