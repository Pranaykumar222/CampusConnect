import { Routes, Route,useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchMe,setAuthChecked } from './features/auth/authSlice'

import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'

import LandingPage from './pages/public/LandingPage'
import AboutPage from './pages/public/AboutPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import VerifyOtpPage from "./pages/auth/VerifyOtpPage"
import DashboardPage from './pages/app/DashboardPage'
import ProfilePage from './pages/app/ProfilePage'
import MessagesPage from './pages/app/MessagesPage'
import CommunityPage from './pages/app/CommunityPage'
import PostDetailPage from './pages/app/PostDetailPage'
import EventsPage from './pages/app/EventsPage'
import EventDetailPage from './pages/app/EventDetailPage'
import ProjectsPage from './pages/app/ProjectsPage'
import ProjectDetailPage from './pages/app/ProjectDetailPage'
import ResourcesPage from './pages/app/ResourcesPage'
import DiscoverPage from './pages/app/DiscoverPage'
import ConnectionsPage from './pages/app/ConnectionsPage'
import NotificationsPage from './pages/app/NotificationsPage'
import SettingsPage from './pages/app/SettingsPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import { Toaster } from "react-hot-toast"
import ToastContainer from './components/ui/ToastContainer'

export default function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
  
    if (token) {
      dispatch(fetchMe())
    } else {
      dispatch(setAuthChecked()) 
    }
  }, [dispatch])
  
  

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyOtpPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/:chatId" element={<MessagesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:postId" element={<PostDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
      <Toaster position="top-right" />
    </>
  )
}
