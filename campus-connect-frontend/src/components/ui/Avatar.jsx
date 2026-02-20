import { cn, getInitials } from '../../utils/helpers'

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-24 w-24 text-2xl',
}

export default function Avatar({ src, name, size = 'md', className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User avatar'}
        className={cn(
          'rounded-full object-cover ring-2 ring-white',
          sizes[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ring-2 ring-white',
        sizes[size],
        className
      )}
      aria-label={name || 'User avatar'}
    >
      {getInitials(name)}
    </div>
  )
}
