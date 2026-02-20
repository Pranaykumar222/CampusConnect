import { Outlet, Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-brand-600 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome to CampusConnect</h1>
          <p className="mt-3 text-brand-100 leading-relaxed">
            Join thousands of students collaborating on projects, attending events, and building meaningful connections across campuses.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-2xl font-bold text-white">15K+</p>
              <p className="text-xs text-brand-200">Students</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-xs text-brand-200">Projects</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-2xl font-bold text-white">200+</p>
              <p className="text-xs text-brand-200">Events</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 lg:justify-start">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">
              Campus<span className="text-brand-600">Connect</span>
            </span>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
