import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import client from "../../services/api/client";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Select from "../../components/ui/Select";

import {
  HiOutlineCode,
  HiOutlineUserGroup,
  HiOutlineTrash,
  HiOutlinePencil,
} from "react-icons/hi";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchProject = async () => {
    const res = await client.get(`/projects/${projectId}`);
    setProject(res.data.project);
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  if (!project) return <p className="text-center mt-10">Loading...</p>;

  const isCreator = project.creator._id === user._id;

  const isContributor = project.contributors.some(
    (c) => c._id === user._id
  );


  const handleApply = async (role) => {
    try {
      await client.post(`/projects/${projectId}/apply`, { role });
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot apply");
    }
  };


  const handleApplicant = async (role, userId, action) => {
    try {
      await client.patch(`/projects/${projectId}/applicants`, {
        role,
        userId,
        action,
      });
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };


  const handleRemoveContributor = async (id) => {
    await client.patch(`/projects/${projectId}/contributors`, {
      userId: id,
      action: "remove",
    });

    fetchProject();
  };


  const handleDelete = async () => {
    await client.delete(`/projects/${projectId}`);
    navigate("/projects");
  };


  const handleUpdate = async () => {
    await client.patch(`/projects/${projectId}`, editData);
    setEditOpen(false);
    fetchProject();
  };


  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="p-6 space-y-6">

      
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-sm text-neutral-500">
              Category: {project.category}
            </p>
          </div>
          <Badge>{project.status}</Badge>
        </div>

        <p className="text-neutral-600">{project.description}</p>

       
        <div>
          <h3 className="font-semibold mb-2">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStacks?.map((t) => (
              <Badge key={t}>
                <HiOutlineCode className="inline mr-1 h-3 w-3" />
                {t}
              </Badge>
            ))}
          </div>
        </div>

       
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <HiOutlineUserGroup />
            Contributors ({project.contributors.length})
          </h3>

          {project.contributors.map((c) => (
            <div
              key={c._id}
              className="flex justify-between border p-2 rounded mt-2"
            >
              {c.firstName} {c.lastName}

              {isCreator && c._id !== user._id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveContributor(c._id)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

      
        {project.lookingFor?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Open Roles</h3>

            {project.lookingFor.map((role) => {

              const acceptedCount = role.accepted?.length || 0;
              const remainingSlots = role.slots - acceptedCount;

              const alreadyApplied = role.applicants?.some(
                (a) => a._id === user._id
              );

              const alreadyAccepted = role.accepted?.some(
                (a) => a._id === user._id
              );

              return (
                <div
                  key={role.role}
                  className="border p-4 rounded mt-3 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span>
                      {role.role} ({remainingSlots}/{role.slots} slots left)
                    </span>

                    {!isCreator &&
                      !alreadyApplied &&
                      !alreadyAccepted &&
                      remainingSlots > 0 && (
                        <Button
                          size="sm"
                          onClick={() => handleApply(role.role)}
                        >
                          Apply
                        </Button>
                      )}

                    {alreadyApplied && (
                      <Badge variant="warning">Applied</Badge>
                    )}

                    {alreadyAccepted && (
                      <Badge variant="success">Accepted</Badge>
                    )}

                    {remainingSlots <= 0 && (
                      <Badge>Closed</Badge>
                    )}
                  </div>

                 
                  {isCreator && role.applicants?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Applicants</h4>

                      {role.applicants.map((a) => (
                        <div
                          key={a._id}
                          className="flex justify-between border p-2 rounded"
                        >
                          {a.firstName} {a.lastName}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleApplicant(role.role, a._id, "accept")
                              }
                            >
                              Accept
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleApplicant(role.role, a._id, "reject")
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

       
        {isCreator && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setEditData(project);
                setEditOpen(true);
              }}
            >
              <HiOutlinePencil className="mr-1" />
              Edit
            </Button>

            <Button variant="outline" onClick={handleDelete}>
              <HiOutlineTrash className="mr-1" />
              Delete
            </Button>
          </div>
        )}
      </Card>

     
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Project"
      >
        {editData && (
          <div className="space-y-4">

            <Input
              label="Title"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />

            <Input
              label="Category"
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
            />

            <TextArea
              label="Description"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
            />

            <Input
              label="Tech Stack (comma separated)"
              value={editData.techStacks?.join(",")}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  techStacks: e.target.value.split(",").map((t) => t.trim()),
                })
              }
            />

            <Input
              label="Looking For (Role:Slots)"
              value={editData.lookingFor
                ?.map((r) => `${r.role}:${r.slots}`)
                .join(",")}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  lookingFor: e.target.value.split(",").map((r) => {
                    const [role, slots] = r.split(":");
                    return {
                      role: role.trim(),
                      slots: Number(slots) || 1,
                    };
                  }),
                })
              }
            />

            <Select
              label="Status"
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              options={[
                { value: "Planning", label: "Planning" },
                { value: "Active", label: "Active" },
                { value: "Completed", label: "Completed" },
              ]}
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
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
    </div>
  );
}
