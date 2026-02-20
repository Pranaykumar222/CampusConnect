import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth)

  if (!authChecked) {
    return null 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

