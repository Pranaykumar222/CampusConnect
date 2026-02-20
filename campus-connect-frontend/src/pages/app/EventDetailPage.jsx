import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import client from "../../services/api/client";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
} from "react-icons/hi";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);

  const fetchEvent = async () => {
    const res = await client.get(`/events/${eventId}`);
    setEvent(res.data.event);
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handleRSVP = async () => {
    await client.post(`/events/${eventId}/rsvp`);
    fetchEvent();
  };

  if (!event) return <p className="p-6">Loading...</p>;

  const isJoined = event.attendees.some(
    (a) => a._id === user._id
  );

  const isPast = new Date(event.date) < new Date();

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <Card className="p-6 space-y-4">

        <Badge>{event.category}</Badge>

        <h1 className="text-2xl font-bold">
          {event.title}
        </h1>

        <p className="text-neutral-600">
          {event.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-neutral-700">

          <div className="flex items-center gap-2">
            <HiOutlineCalendar />
            {new Date(event.date).toDateString()}
          </div>

          <div className="flex items-center gap-2">
            <HiOutlineClock />
            {event.time}
          </div>

          <div className="flex items-center gap-2">
            <HiOutlineLocationMarker />
            {event.location}
          </div>

          <div className="flex items-center gap-2">
            <HiOutlineUserGroup />
            {event.attendees.length}/{event.maxAttendees}
          </div>

        </div>

        <div className="pt-4 border-t">

          {isPast ? (
            <Badge variant="warning">
              Event Closed
            </Badge>
          ) : (
            <Button
              variant={isJoined ? "outline" : "primary"}
              onClick={handleRSVP}
            >
              {isJoined ? "Leave Event" : "Join Event"}
            </Button>
          )}

        </div>

      </Card>

  
      <Card className="p-6">
        <h2 className="font-semibold mb-3">
          Attendees ({event.attendees.length})
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {event.attendees.map((a) => (
            <div
              key={a._id}
              className="border rounded-lg p-3 text-sm"
            >
              {a.firstName} {a.lastName}
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}

