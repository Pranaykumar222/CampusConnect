import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import { setSidebarOpen } from '../features/ui/uiSlice';
import { useEffect } from "react";
import { fetchNotifications } from "../features/notifications/notificationSlice";
import { getSocket } from "../services/socket";
import { addNotification } from "../features/notifications/notificationSlice";
import { addToast } from "../features/ui/uiSlice";



export default function AppLayout() {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
  
    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification));
    
      dispatch(
        addToast({
          id: Date.now(),
          type: "info",
          message: notification.message,
        })
      );
    });
    
  
    return () => {
      socket.off("newNotification");
    };
  }, [dispatch]);
  


  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() =>  dispatch(setSidebarOpen(false))}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
