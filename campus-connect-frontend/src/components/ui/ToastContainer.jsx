import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { removeToast } from '../../features/ui/uiSlice'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/helpers'

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-sky-50 border-sky-200 text-sky-800',
}

export default function ToastContainer() {
  const toasts = useSelector((state) => state.ui.toasts)
  const dispatch = useDispatch()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dispatch(removeToast(toast.id))} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onDismiss }) {
  const Icon = icons[toast.type] || Info

  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg min-w-[300px]',
        colors[toast.type]
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={onDismiss} className="shrink-0 rounded p-0.5 hover:bg-black/5">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
