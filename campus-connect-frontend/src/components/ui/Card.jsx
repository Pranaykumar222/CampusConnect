import { cn } from '../../utils/helpers'

export default function Card({ children, className, hover, onClick, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-surface-200 bg-white p-5 shadow-sm',
        hover && 'transition-shadow hover:shadow-md cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }) {
  return <h3 className={cn('text-lg font-semibold text-surface-900', className)}>{children}</h3>
}

export function CardDescription({ children, className }) {
  return <p className={cn('text-sm text-surface-500 mt-1', className)}>{children}</p>
}

export function CardContent({ children, className }) {
  return <div className={cn(className)}>{children}</div>
}

export function CardFooter({ children, className }) {
  return <div className={cn('mt-4 flex items-center gap-3', className)}>{children}</div>
}
