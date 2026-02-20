import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../features/ui/uiSlice';
import { clearCredentials } from '../../features/auth/authSlice';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import {
  HiOutlineMenu,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineUser,
} from 'react-icons/hi';

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <HiOutlineMenu className="h-5 w-5" />
        </button>

        {showSearch ? (
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, projects, events..."
              className="w-48 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none sm:w-72"
            />
            <button type="button" onClick={() => setShowSearch(false)} className="ml-2 text-sm text-neutral-500 hover:text-neutral-700">
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-400 hover:border-neutral-300 hover:text-neutral-500"
          >
            <HiOutlineSearch className="h-4 w-4" />
            <span className="hidden sm:inline">Search...</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/notifications"
          className="relative rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
          aria-label="Notifications"
        >
          <HiOutlineBell className="h-5 w-5" />
          {unreadCount > 0 && (
  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-xs text-white">
    {unreadCount}
  </span>
)}

          </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-neutral-100"
          >
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
            <span className="hidden text-sm font-medium text-neutral-700 md:inline">
              {user?.name || 'User'}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
              <div className="border-b border-neutral-100 px-4 py-3">
                <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
                {user?.role && <Badge variant="info" className="mt-1">{user.role}</Badge>}
              </div>
              <Link
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <HiOutlineUser className="h-4 w-4" /> My Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <HiOutlineCog className="h-4 w-4" /> Settings
              </Link>
              <hr className="my-1 border-neutral-100" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <HiOutlineLogout className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
