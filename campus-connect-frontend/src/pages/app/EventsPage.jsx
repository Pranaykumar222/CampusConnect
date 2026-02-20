import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import client from "../../services/api/client";
import { useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Select from "../../components/ui/Select";
import Tabs from "../../components/ui/Tabs";

import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineSearch,
  HiOutlineBookmark,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";

const TABS = ["All", "My Events", "Saved Events"];

export default function EventsPage() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [editEvent, setEditEvent] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);

const [newEvent, setNewEvent] = useState({
  title: "",
  description: "",
  category: "Workshop",
  date: "",
  time: "",
  location: "",
  maxAttendees: 50,
});


const handleCreateEvent = async () => {
  if (!newEvent.title || !newEvent.date) return;

  await client.post("/events", newEvent);

  setCreateOpen(false);

  setNewEvent({
    title: "",
    description: "",
    category: "Workshop",
    date: "",
    time: "",
    location: "",
    maxAttendees: 50,
  });

  fetchEvents();
};


  const fetchEvents = async () => {
    let url = `/events?search=${search}`;

    if (activeTab === "My Events") {
      url = `/events?createdBy=${user._id}`;
    }

    const res = await client.get(url);
    setEvents(res.data.events);
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab, search]);


  const displayedEvents =
    activeTab === "Saved Events"
      ? events.filter((e) =>
          e.savedBy.some((s) => s._id === user._id)
        )
      : events;


  const handleRSVP = async (id) => {
    await client.post(`/events/${id}/rsvp`);
    fetchEvents();
  };


  const handleSave = async (id) => {
    await client.post(`/events/${id}/save`);
    fetchEvents();
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await client.delete(`/events/${id}`);
    fetchEvents();
  };


  const handleUpdate = async () => {
    await client.patch(`/events/${editEvent._id}`, editEvent);
    setEditEvent(null);
    fetchEvents();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">

<div className="flex justify-between items-center">
  <h1 className="text-2xl font-bold">Events</h1>

  <Button onClick={() => setCreateOpen(true)}>
    Create Event
  </Button>
</div>


      
      <Tabs
        tabs={TABS}
        active={activeTab}
        onChange={setActiveTab}
      />

    
      <div className="flex items-center gap-2 border rounded-xl px-4 py-2">
        <HiOutlineSearch />
        <input
          placeholder="Search events..."
          className="w-full bg-transparent outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

    
      <div className="grid gap-4 md:grid-cols-2">

        {displayedEvents.map((event) => {

          const isJoined = event.attendees.some(
            (a) => a._id === user._id
          );

          const isSaved = event.savedBy.some(
            (s) => s._id === user._id
          );

          const isCreator = event.createdBy._id === user._id;

          return (
            <Card key={event._id} className="p-5">

              <div className="flex justify-between">
                <Badge>{event.category}</Badge>

                <button onClick={() => handleSave(event._id)}>
                  <HiOutlineBookmark
                    className={`h-5 w-5 ${
                      isSaved ? "text-sky-600" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              <h3
                className="mt-3 font-semibold text-lg cursor-pointer hover:text-sky-600"
                onClick={() => navigate(`/events/${event._id}`)}
              >
                {event.title}
              </h3>

              <div className="mt-3 space-y-1 text-sm">

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

           
              <div className="mt-4 flex gap-2">

                <Button
                  variant="ghost"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  Details
                </Button>

                {!event.isPast && (
                  <Button
                    variant={isJoined ? "outline" : "primary"}
                    onClick={() => handleRSVP(event._id)}
                  >
                    {isJoined ? "Leave" : "Join"}
                  </Button>
                )}

                {isCreator && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setEditEvent(event)}
                    >
                      <HiOutlinePencil />
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleDelete(event._id)}
                    >
                      <HiOutlineTrash />
                    </Button>
                  </>
                )}

              </div>

            </Card>
          );
        })}
      </div>


      <Modal
        isOpen={!!editEvent}
        onClose={() => setEditEvent(null)}
        title="Edit Event"
      >
        {editEvent && (
          <div className="space-y-4">

            <Input
              label="Title"
              value={editEvent.title}
              onChange={(e) =>
                setEditEvent({ ...editEvent, title: e.target.value })
              }
            />

            <TextArea
              label="Description"
              value={editEvent.description}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  description: e.target.value,
                })
              }
            />

            <Select
              label="Category"
              value={editEvent.category}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  category: e.target.value,
                })
              }
              options={[
                { value: "Workshop", label: "Workshop" },
                { value: "Competition", label: "Competition" },
                { value: "Career", label: "Career" },
                { value: "Meetup", label: "Meetup" },
              ]}
            />

            <Input
              label="Date"
              type="date"
              value={editEvent.date?.slice(0, 10)}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  date: e.target.value,
                })
              }
            />

            <Input
              label="Time"
              value={editEvent.time}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  time: e.target.value,
                })
              }
            />

            <Input
              label="Location"
              value={editEvent.location}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  location: e.target.value,
                })
              }
            />

            <Input
              label="Max Attendees"
              type="number"
              value={editEvent.maxAttendees}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  maxAttendees: Number(e.target.value),
                })
              }
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setEditEvent(null)}
              >
                Cancel
              </Button>

              <Button onClick={handleUpdate}>
                Save Changes
              </Button>
            </div>

          </div>
        )}
      </Modal>

      <Modal
  isOpen={createOpen}
  onClose={() => setCreateOpen(false)}
  title="Create Event"
>
  <div className="space-y-4">

    <Input
      label="Title"
      value={newEvent.title}
      onChange={(e) =>
        setNewEvent({ ...newEvent, title: e.target.value })
      }
    />

    <TextArea
      label="Description"
      value={newEvent.description}
      onChange={(e) =>
        setNewEvent({ ...newEvent, description: e.target.value })
      }
    />

    <Select
      label="Category"
      value={newEvent.category}
      onChange={(e) =>
        setNewEvent({ ...newEvent, category: e.target.value })
      }
      options={[
        { value: "Workshop", label: "Workshop" },
        { value: "Competition", label: "Competition" },
        { value: "Career", label: "Career" },
        { value: "Meetup", label: "Meetup" },
      ]}
    />

    <Input
      label="Date"
      type="date"
      value={newEvent.date}
      onChange={(e) =>
        setNewEvent({ ...newEvent, date: e.target.value })
      }
    />

    <Input
      label="Time"
      value={newEvent.time}
      onChange={(e) =>
        setNewEvent({ ...newEvent, time: e.target.value })
      }
    />

    <Input
      label="Location"
      value={newEvent.location}
      onChange={(e) =>
        setNewEvent({ ...newEvent, location: e.target.value })
      }
    />

    <Input
      label="Max Attendees"
      type="number"
      value={newEvent.maxAttendees}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          maxAttendees: Number(e.target.value),
        })
      }
    />

    <div className="flex justify-end gap-3">
      <Button
        variant="outline"
        onClick={() => setCreateOpen(false)}
      >
        Cancel
      </Button>

      <Button onClick={handleCreateEvent}>
        Create Event
      </Button>
    </div>

  </div>
</Modal>


    </div>
  );
}
