import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams,useNavigate } from "react-router-dom";
import {
  MapPin,
  Mail,
  Calendar,
  Share2,
  Edit
} from "lucide-react";

import client from "../../services/api/client";
import { fetchMe } from "../../features/auth/authSlice";
import Modal from "../../components/ui/Modal";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const navigate = useNavigate();


  const isOwnProfile = !userId || userId === user?._id;

  const [profileUser, setProfileUser] = useState(null);
  const [relationship, setRelationship] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({});


  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (isOwnProfile) {
          setProfileUser(user);
        } else {
          const res = await client.get(`/users/${userId}`);
          setProfileUser(res.data.user);
        }
      } catch (err) {
        console.error("Request failed");
      }
    };

    if (user) loadProfile();
  }, [user, userId, isOwnProfile]);


  useEffect(() => {
    const loadRelationship = async () => {
      if (!isOwnProfile && userId) {
        try {
          const res = await client.get(`/follow/${userId}/relationship`);
          setRelationship(res.data);
        } catch (err) {
          console.error("Request failed");
        }
      }
    };

    loadRelationship();
  }, [userId, isOwnProfile]);


  useEffect(() => {
    if (profileUser && isOwnProfile) {
      setForm({
        firstName: profileUser.firstName || "",
        lastName: profileUser.lastName || "",
        university: profileUser.university || "",
        major: profileUser.major || "",
        academicYear: profileUser.academicYear || "",
        location: profileUser.location || "",
        bio: profileUser.bio || "",
        skills: profileUser.skills?.join(", ") || "",
        interests: profileUser.interests?.join(", ") || "",
      });
    }
  }, [profileUser, isOwnProfile]);


  const handleSave = async () => {
    try {
      await client.put("/users/me", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
        interests: form.interests.split(",").map((s) => s.trim()),
      });

      await dispatch(fetchMe());
      setEditOpen(false);
    } catch (err) {
      console.error("Request failed");
    }
  };


  const sendRequest = async () => {
    await client.post(`/connections/${userId}`);
    setRelationship((prev) => ({ ...prev, requestSent: true }));
  };

  const acceptRequest = async () => {
    const res = await client.get("/connections/requests");
    const request = res.data.requests.find(
      (r) => r.requester._id === userId
    );

    if (request) {
      await client.patch(`/connections/${request._id}/respond`, {
        action: "accept",
      });

      setRelationship({ isConnected: true });
    }
  };

  const rejectRequest = async () => {
    const res = await client.get("/connections/requests");
    const request = res.data.requests.find(
      (r) => r.requester._id === userId
    );

    if (request) {
      await client.patch(`/connections/${request._id}/respond`, {
        action: "reject",
      });

      setRelationship(null);
    }
  };


const handleMessage = async () => {
  try {
    const res = await client.post("/chats", {
      userId: profileUser._id,
    });

    const chat = res.data;

    navigate(`/messages/${chat._id}`);
  } catch (err) {
    console.error("Request failed");
  }
};


  const renderButtons = () => {

    if (isOwnProfile) {
      return (
        <>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            <Share2 size={16} />
          </button>

          <button
            onClick={() => setEditOpen(true)}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
          >
            <Edit size={16} />
            Edit Profile
          </button>
        </>
      );
    }

    if (!relationship) return null;

    if (relationship.isConnected) {
      return (
        <>
          <button
            onClick={handleMessage}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            Message
          </button>

          <button className="px-4 py-2 border rounded-lg bg-green-50 text-green-600">
            Connected
          </button>
        </>
      );
    }

    if (relationship.requestSent) {
      return (
        <button className="px-4 py-2 border rounded-lg">
          Requested
        </button>
      );
    }

    if (relationship.requestReceived) {
      return (
        <>
          <button
            onClick={acceptRequest}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Accept
          </button>
          <button
            onClick={rejectRequest}
            className="px-4 py-2 border rounded-lg"
          >
            Reject
          </button>
        </>
      );
    }

    return (
      <button
        onClick={sendRequest}
        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
      >
        Connect
      </button>
    );
  };

  if (!profileUser) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

        <div className="h-48 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-t-3xl"></div>

        <div className="px-8 pb-8 pt-6 relative">

          <div className="absolute -top-16 left-8">
            <div className="w-32 h-32 rounded-full bg-white shadow-lg p-2">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                {profileUser.firstName?.[0]}
                {profileUser.lastName?.[0]}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start ml-40">

            <div>
              <h1 className="text-3xl font-bold">
                {profileUser.firstName} {profileUser.lastName}
              </h1>

              <p className="text-gray-600 mt-1">
                {profileUser.major || "-"} • {profileUser.academicYear || "-"} • {profileUser.university || "-"}
              </p>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                {profileUser.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {profileUser.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  {profileUser.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  Joined {new Date(profileUser.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {renderButtons()}
            </div>

          </div>

          <div className="mt-6 border-t pt-4 text-gray-700">
            {profileUser.bio || "No bio added yet."}
          </div>

        </div>
      </div>

     
      <div className="grid lg:grid-cols-3 gap-6 mt-8">

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profileUser.skills?.length > 0 ? (
                profileUser.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No skills added</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="font-semibold mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profileUser.interests?.length > 0 ? (
                profileUser.interests.map((interest, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No interests added</p>
              )}
            </div>
          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="font-semibold mb-4">Info</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>University:</strong> {profileUser.university || "-"}</p>
            <p><strong>Major:</strong> {profileUser.major || "-"}</p>
            <p><strong>Year:</strong> {profileUser.academicYear || "-"}</p>
            <p><strong>Location:</strong> {profileUser.location || "-"}</p>
          </div>
        </div>

      </div>

      
      {isOwnProfile && (
        <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" size="lg">
          <div className="space-y-4">
            {["firstName","lastName","university","major","academicYear","location"].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium capitalize">{field}</label>
                <input
                  value={form[field] || ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Skills (comma separated)</label>
              <input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Interests (comma separated)</label>
              <input
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button onClick={() => setEditOpen(false)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-sky-600 text-white rounded-lg">
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}


