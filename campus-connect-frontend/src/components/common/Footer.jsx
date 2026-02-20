import { Link } from 'react-router-dom'
import { GraduationCap, Github, Twitter, Linkedin, Mail } from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Features', path: '/#features' },
    { label: 'Events', path: '/#events' },
    { label: 'Community', path: '/about' },
    { label: 'Projects', path: '/about' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/about' },
    { label: 'Blog', path: '/about' },
    { label: 'Contact', path: '/about' },
  ],
  Legal: [
    { label: 'Privacy Policy', path: '/about' },
    { label: 'Terms of Service', path: '/about' },
    { label: 'Cookie Policy', path: '/about' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@campusconnect.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-surface-900">
                Campus<span className="text-brand-600">Connect</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-surface-500 leading-relaxed">
              Connecting students across campuses. Build projects, join events, and grow your network.
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-100 text-surface-500 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-surface-900">{heading}</h4>
              <ul className="mt-3 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-surface-500 transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-surface-200 pt-6 text-center text-sm text-surface-400">
          2026 CampusConnect. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
