import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuth } from '../features/auth/authSlice'
import { PageSpinner } from '../components/ui/Spinner'

export default function AdminRoute() {
  const { isAuthenticated, isLoading, user } = useSelector(selectAuth)

  if (isLoading) return <PageSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <Outlet />
}
