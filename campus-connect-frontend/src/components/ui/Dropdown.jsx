import { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/helpers'

export default function Dropdown({ trigger, children, align = 'right', className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-[200px] rounded-xl border border-surface-200 bg-white py-1.5 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({ children, onClick, danger, className }) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors',
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-surface-700 hover:bg-surface-50',
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
