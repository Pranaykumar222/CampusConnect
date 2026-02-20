import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import {
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineFolder,
  HiOutlineDocumentText,
  HiOutlineTrendingUp,
  HiOutlineShieldCheck,
  HiOutlineBan,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineEye,
} from 'react-icons/hi';

const TABS = ['Overview', 'Users', 'Content', 'Reports'];

const MOCK_STATS = [
  { label: 'Total Users', value: '2,547', change: '+12%', icon: HiOutlineUserGroup, color: 'text-sky-600 bg-sky-50' },
  { label: 'Active Events', value: '24', change: '+5%', icon: HiOutlineCalendar, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Projects', value: '186', change: '+8%', icon: HiOutlineFolder, color: 'text-amber-600 bg-amber-50' },
  { label: 'Resources', value: '1,023', change: '+15%', icon: HiOutlineDocumentText, color: 'text-rose-600 bg-rose-50' },
];

const MOCK_USERS = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@campus.edu', role: 'Student', department: 'Computer Science', status: 'active', joined: '2025-01-15' },
  { id: 2, name: 'Raj Patel', email: 'raj@campus.edu', role: 'Student', department: 'Data Science', status: 'active', joined: '2025-02-20' },
  { id: 3, name: 'Dr. Smith', email: 'smith@campus.edu', role: 'Faculty', department: 'Computer Science', status: 'active', joined: '2024-08-01' },
  { id: 4, name: 'Emily Wong', email: 'emily@campus.edu', role: 'Student', department: 'Software Eng.', status: 'suspended', joined: '2025-03-10' },
  { id: 5, name: 'Mike Torres', email: 'mike@campus.edu', role: 'Student', department: 'Electrical Eng.', status: 'active', joined: '2025-01-28' },
  { id: 6, name: 'Admin User', email: 'admin@campus.edu', role: 'Admin', department: 'Administration', status: 'active', joined: '2024-01-01' },
];

const MOCK_REPORTS = [
  { id: 1, type: 'Spam', reporter: 'Sarah Chen', target: 'Post #4521', reason: 'Promotional spam content', status: 'pending', date: '2026-02-10' },
  { id: 2, type: 'Harassment', reporter: 'Raj Patel', target: 'User: fake_acc', reason: 'Sending harassing messages', status: 'pending', date: '2026-02-09' },
  { id: 3, type: 'Inappropriate', reporter: 'Emily Wong', target: 'Resource #89', reason: 'Contains inappropriate content', status: 'resolved', date: '2026-02-07' },
];

const MOCK_RECENT = [
  { text: 'New user registration: Lisa Park', time: '10m ago' },
  { text: 'Event "AI Workshop" created by AI Club', time: '30m ago' },
  { text: 'Resource flagged for review', time: '1h ago' },
  { text: 'User account suspended: john_spam', time: '2h ago' },
  { text: 'New project: MentorMatch submitted', time: '3h ago' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = MOCK_USERS.filter(
    (u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="mt-1 text-neutral-500">Manage your campus platform.</p>
        </div>
        <Badge variant="warning">
          <HiOutlineShieldCheck className="mr-1 h-3 w-3" /> Admin
        </Badge>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {MOCK_STATS.map((stat) => (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                    <HiOutlineTrendingUp className="h-3 w-3" /> {stat.change}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="mb-4 font-semibold text-neutral-900">Recent Activity</h3>
              <div className="space-y-3">
                {MOCK_RECENT.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                    <p className="text-sm text-neutral-700">{item.text}</p>
                    <span className="flex-shrink-0 text-xs text-neutral-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="mb-4 font-semibold text-neutral-900">Pending Reports</h3>
              <div className="space-y-3">
                {MOCK_REPORTS.filter((r) => r.status === 'pending').map((report) => (
                  <div key={report.id} className="rounded-lg border border-neutral-100 p-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="warning">{report.type}</Badge>
                      <span className="text-xs text-neutral-400">{report.date}</span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-700">{report.reason}</p>
                    <p className="mt-1 text-xs text-neutral-500">Target: {report.target} | Reported by: {report.reporter}</p>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline" className="text-emerald-600">
                        <HiOutlineCheck className="mr-1 h-3 w-3" /> Resolve
                      </Button>
                      <Button size="sm" variant="outline" className="text-rose-600">
                        <HiOutlineBan className="mr-1 h-3 w-3" /> Take Action
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'Users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2">
              <HiOutlineSearch className="h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            <Button variant="outline" size="sm">
              <HiOutlineRefresh className="mr-1 h-4 w-4" /> Refresh
            </Button>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-200 bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-neutral-500">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-neutral-500">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-neutral-500">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-neutral-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-neutral-500">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{u.name}</p>
                            <p className="text-xs text-neutral-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === 'Admin' ? 'warning' : u.role === 'Faculty' ? 'info' : 'default'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{u.department}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.status === 'active' ? 'success' : 'error'}>
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{u.joined}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-sky-600"
                          >
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          <button className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-rose-600">
                            <HiOutlineBan className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Content */}
      {activeTab === 'Content' && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Posts', count: 1243, pending: 5 },
            { label: 'Resources', count: 1023, pending: 12 },
            { label: 'Events', count: 89, pending: 3 },
          ].map((item) => (
            <Card key={item.label} className="p-5">
              <h3 className="text-lg font-semibold text-neutral-900">{item.label}</h3>
              <p className="mt-1 text-3xl font-bold text-neutral-900">{item.count}</p>
              <p className="mt-2 text-sm text-amber-600">{item.pending} pending review</p>
              <Button variant="outline" size="sm" className="mt-3">Review</Button>
            </Card>
          ))}
        </div>
      )}

      {/* Reports */}
      {activeTab === 'Reports' && (
        <div className="space-y-3">
          {MOCK_REPORTS.map((report) => (
            <Card key={report.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.status === 'pending' ? 'warning' : 'success'}>{report.status}</Badge>
                    <Badge variant="error">{report.type}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-neutral-700">{report.reason}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Target: {report.target} | Reported by: {report.reporter} | {report.date}
                  </p>
                </div>
                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <HiOutlineCheck className="mr-1 h-3 w-3" /> Resolve
                    </Button>
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                      <HiOutlineBan className="mr-1 h-3 w-3" /> Ban
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* User Detail Modal */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={selectedUser.name} size="lg" />
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{selectedUser.name}</h3>
                <p className="text-sm text-neutral-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-neutral-50 p-4 text-sm">
              <div><span className="text-neutral-500">Role:</span> <strong>{selectedUser.role}</strong></div>
              <div><span className="text-neutral-500">Department:</span> <strong>{selectedUser.department}</strong></div>
              <div><span className="text-neutral-500">Status:</span> <Badge variant={selectedUser.status === 'active' ? 'success' : 'error'}>{selectedUser.status}</Badge></div>
              <div><span className="text-neutral-500">Joined:</span> <strong>{selectedUser.joined}</strong></div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
              <Button variant="outline" className="text-rose-600">Suspend User</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
