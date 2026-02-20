import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  LayoutDashboard, User, MessageSquare, Users, Calendar,
  FolderKanban, BookOpen, Compass, Bell, Settings, Shield,
  GraduationCap, X, ChevronLeft
} from 'lucide-react'
import { selectUser } from '../../features/auth/authSlice'
import { setSidebarOpen } from '../../features/ui/uiSlice'
import { cn } from '../../utils/helpers'

const mainNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Messages', icon: MessageSquare, path: '/messages' },
  { label: 'Community', icon: Users, path: '/community' },
  { label: 'Events', icon: Calendar, path: '/events' },
  { label: 'Projects', icon: FolderKanban, path: '/projects' },
  { label: 'Resources', icon: BookOpen, path: '/resources' },
  { label: 'Discover', icon: Compass, path: '/discover' },
  { label: 'Connections', icon: Users, path: '/connections' },
]

const secondaryNav = [
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

export default function Sidebar() {
  const user = useSelector(selectUser)
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen)
  const dispatch = useDispatch()
  const location = useLocation()

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-surface-900/50 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-surface-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-surface-200 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-surface-900">
              Campus<span className="text-brand-600">Connect</span>
            </span>
          </div>
          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
          <div className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="my-4 border-t border-surface-200" />

          <div className="flex flex-col gap-1">
            {secondaryNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </NavLink>
            ))}

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                onClick={() => dispatch(setSidebarOpen(false))}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  )
                }
              >
                <Shield className="h-5 w-5 shrink-0" />
                Admin
              </NavLink>
            )}
          </div>
        </nav>

        <div className="border-t border-surface-200 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-surface-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-surface-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
