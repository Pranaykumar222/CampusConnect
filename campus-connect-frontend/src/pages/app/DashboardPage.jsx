import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import client from "../../services/api/client";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Spinner from "../../components/ui/Spinner";

import {
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineFolder,
  HiOutlineChatAlt2,
  HiOutlineBookOpen,
  HiOutlineArrowRight,
  HiOutlineTrendingUp,
  HiOutlineLightningBolt,
} from "react-icons/hi";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);


  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await client.get("/dashboard/overview");
      setDashboard(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboard) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }


  const stats = [
    {
      label: "Connections",
      value: dashboard.counts.connectionsCount,
      icon: HiOutlineUserGroup,
      color: "text-sky-600 bg-sky-50",
    },
    {
      label: "Events Joined",
      value: dashboard.counts.eventsCount,
      icon: HiOutlineCalendar,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Projects",
      value: dashboard.counts.projectsCount,
      icon: HiOutlineFolder,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Messages",
      value: dashboard.counts.messagesCount,
      icon: HiOutlineChatAlt2,
      color: "text-rose-600 bg-rose-50",
    },
  ];

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = { d: 86400, h: 3600, m: 60 };

    for (let key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) return `${interval}${key} ago`;
    }
    return "Just now";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Welcome back, {user?.firstName || "Student"}
          </h1>
          <p className="mt-1 text-neutral-500">
            Here is what is happening on your campus today.
          </p>
        </div>

        <Link
          to="/discover"
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          <HiOutlineLightningBolt className="h-4 w-4" /> Explore Campus
        </Link>
      </div>

     
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4 p-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {stat.value}
              </p>
              <p className="text-sm text-neutral-500">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

       
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Recent Activity
            </h2>
            <Link
              to="/community"
              className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700"
            >
              View All <HiOutlineArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {dashboard.recentPosts.length === 0 && (
            <Card className="p-6 text-center text-neutral-500">
              No recent posts yet.
            </Card>
          )}

          {dashboard.recentPosts.map((post) => (
            <Card key={post._id} className="p-4">
              <div className="flex gap-3">
                <Avatar
                  name={`${post.author.firstName} ${post.author.lastName}`}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-900">
                      {post.author.firstName} {post.author.lastName}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {timeAgo(post.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-neutral-600">
                    {post.content}
                  </p>

                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                      <HiOutlineTrendingUp className="h-4 w-4" />
                      {post.likes.length}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                      <HiOutlineChatAlt2 className="h-4 w-4" />
                      {post.comments.length}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

     
        <div className="space-y-6">

       
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900">
                Upcoming Events
              </h3>
              <Link to="/events" className="text-xs text-sky-600 hover:text-sky-700">
                See all
              </Link>
            </div>

            {dashboard.upcomingEvents.length === 0 && (
              <p className="text-sm text-neutral-500">
                No upcoming events.
              </p>
            )}

            <div className="space-y-3">
              {dashboard.upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-start gap-3 rounded-lg border border-neutral-100 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <HiOutlineCalendar className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {event.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                    <Badge className="mt-1">{event.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900">
                People You May Know
              </h3>
              <Link to="/discover" className="text-xs text-sky-600 hover:text-sky-700">
                Discover
              </Link>
            </div>

            {dashboard.peopleYouMayKnow.length === 0 && (
              <p className="text-sm text-neutral-500">
                No suggestions available.
              </p>
            )}

            <div className="space-y-3">
              {dashboard.peopleYouMayKnow.map((person) => (
                <div key={person._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={`${person.firstName} ${person.lastName}`}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {person.firstName} {person.lastName}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {person.department}
                      </p>
                    </div>
                  </div>

                  <button className="rounded-lg border border-sky-200 px-3 py-1 text-xs font-medium text-sky-600 hover:bg-sky-50">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
