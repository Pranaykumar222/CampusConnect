import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import discoverService from "../../services/api/discoverService";
import client from "../../services/api/client";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Tabs from "../../components/ui/Tabs";

import {
  HiOutlineSearch,
  HiOutlineUserAdd,
  HiOutlineCheck,
  HiOutlineLocationMarker,
} from "react-icons/hi";

const TABS = ["People"];

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [relationships, setRelationships] = useState({});


  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await discoverService.getUsers({ search });
      const usersData = res.data.users;

      setUsers(usersData);

      await fetchRelationships(usersData);

    } catch (err) {
      console.error("Discover error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchRelationships = async (usersList) => {
    const relationMap = {};

    for (let user of usersList) {
      try {
        const res = await client.get(
          `/connections/status/${user._id}`
        );

        relationMap[user._id] = res.data;
      } catch (err) {
        relationMap[user._id] = { status: "none" };
      }
    }

    setRelationships(relationMap);
  };


  const handleConnect = async (userId) => {
    try {
      await client.post(`/connections/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Request failed");
    }
  };


  const handleRespond = async (connectionId, action) => {
    try {
      await client.patch(
        `/connections/${connectionId}/respond`,
        { action }
      );

      fetchUsers();
    } catch (err) {
      console.error("Request failed");
    }
  };


  return (
    <div className="mx-auto max-w-5xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Discover Students
        </h1>
        <p className="text-neutral-500 mt-1">
          Find students, connect and collaborate.
        </p>
      </div>

     
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchUsers();
        }}
        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3"
      >
        <HiOutlineSearch className="h-5 w-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by name or university..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </form>

      <Tabs tabs={TABS} active="People" onChange={() => {}} />

      
      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">

          {users.length === 0 && (
            <p className="text-neutral-500">No users found.</p>
          )}

          {users.map((user) => {
            const relation = relationships[user._id] || { status: "none" };

            return (
              <Card key={user._id} className="p-5">
                <div className="flex gap-4">

                  <Avatar
                    name={`${user.firstName} ${user.lastName}`}
                    src={user.avatar}
                    size="lg"
                  />

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between">

                      <div>
                        <Link
                          to={`/profile/${user._id}`}
                          className="font-semibold text-neutral-900 hover:text-sky-600"
                        >
                          {user.firstName} {user.lastName}
                        </Link>

                        <p className="text-sm text-neutral-500">
                          {user.major} • {user.academicYear}
                        </p>
                      </div>

                  

                      {relation.status === "none" && (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(user._id)}
                        >
                          <HiOutlineUserAdd className="mr-1 h-3 w-3" />
                          Connect
                        </Button>
                      )}

                      {relation.status === "sent" && (
                        <Button size="sm" variant="outline" disabled>
                          Requested
                        </Button>
                      )}

                      {relation.status === "received" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleRespond(
                                relation.connectionId,
                                "accept"
                              )
                            }
                          >
                            Accept
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRespond(
                                relation.connectionId,
                                "reject"
                              )
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )}

                      {relation.status === "connected" && (
                        <Button size="sm" variant="outline" disabled>
                          <HiOutlineCheck className="mr-1 h-3 w-3" />
                          Connected
                        </Button>
                      )}

                    </div>

                    <p className="mt-2 text-sm text-neutral-600">
                      {user.bio || "No bio available."}
                    </p>

                    {user.skills?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {user.skills.map((skill) => (
                          <Badge key={skill}>{skill}</Badge>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 text-xs text-neutral-400 flex items-center gap-2">
                      <HiOutlineLocationMarker className="h-3 w-3" />
                      {user.location || "Location not set"}
                    </div>

                  </div>
                </div>
              </Card>
            );
          })}

        </div>
      )}
    </div>
  );
}
