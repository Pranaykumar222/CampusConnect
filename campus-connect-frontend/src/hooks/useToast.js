import { useDispatch } from 'react-redux'
import { addToast, removeToast } from '../features/ui/uiSlice'

export default function useToast() {
  const dispatch = useDispatch()

  const toast = {
    success: (message) => dispatch(addToast({ type: 'success', message })),
    error: (message) => dispatch(addToast({ type: 'error', message })),
    info: (message) => dispatch(addToast({ type: 'info', message })),
    dismiss: (id) => dispatch(removeToast(id)),
  }

  return toast
}
