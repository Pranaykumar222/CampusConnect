import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotificationAsync
} from "../../features/notifications/notificationSlice";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Tabs from "../../components/ui/Tabs";

import {
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineUserAdd,
  HiOutlineCalendar,
  HiOutlineChatAlt2,
  HiOutlineThumbUp,
  HiOutlineFolder,
} from "react-icons/hi";

const TABS = ["All", "Unread"];

const TYPE_CONFIG = {
  connection_request: { icon: HiOutlineUserAdd, color: "text-sky-600 bg-sky-50" },
  request_accepted: { icon: HiOutlineUserAdd, color: "text-sky-600 bg-sky-50" },
  post_like: { icon: HiOutlineThumbUp, color: "text-rose-600 bg-rose-50" },
  post_comment: { icon: HiOutlineChatAlt2, color: "text-amber-600 bg-amber-50" },
  new_message: { icon: HiOutlineChatAlt2, color: "text-amber-600 bg-amber-50" },
  event_invite: { icon: HiOutlineCalendar, color: "text-emerald-600 bg-emerald-50" },
  project_invite: { icon: HiOutlineFolder, color: "text-violet-600 bg-violet-50" },
};

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { items, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );

  const [activeTab, setActiveTab] = useState("All");


  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);


  const markRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const markAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const deleteNotification = (id) => {
    dispatch(deleteNotificationAsync(id));
  };


  const filtered =
    activeTab === "Unread"
      ? items.filter((n) => !n.isRead)
      : items;

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-neutral-500">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : "All caught up 🎉"}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <HiOutlineCheck className="mr-1 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="space-y-2">

        {filtered.length === 0 && (
          <Card className="py-12 text-center">
            <HiOutlineBell className="mx-auto h-10 w-10 text-neutral-300" />
            <p className="mt-3 text-neutral-500">
              No notifications to show.
            </p>
          </Card>
        )}

        {filtered.map((notif) => {
          const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.post_like;
          const Icon = config.icon;

          return (
            <Card
              key={notif._id}
              className={`flex items-center gap-4 p-4 ${
                !notif.isRead ? "bg-sky-50/50 border-sky-200" : ""
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.color}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className={`text-sm ${!notif.isRead ? "font-medium" : ""}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-neutral-400">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                {!notif.isRead && (
                  <button
                    onClick={() => markRead(notif._id)}
                    className="p-1 text-neutral-400 hover:text-sky-600"
                  >
                    <HiOutlineCheck className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(notif._id)}
                  className="p-1 text-neutral-400 hover:text-rose-600"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

