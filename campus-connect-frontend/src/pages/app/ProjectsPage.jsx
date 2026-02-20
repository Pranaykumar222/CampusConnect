import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import client from "../../services/api/client";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Select from "../../components/ui/Select";
import Tabs from "../../components/ui/Tabs";

import {
  HiOutlineFolder,
  HiOutlineStar,
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineEye,
} from "react-icons/hi";

const TABS = ["All Projects", "My Projects", "Bookmarked"];

const STATUS_COLORS = {
  Planning: "default",
  Active: "success",
  Completed: "default",
};

export default function ProjectsPage() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("All Projects");
  const [createOpen, setCreateOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    desc: "",
    tech: "",
    lookingFor: "",
    status: "Planning",
  });

  const fetchProjects = async () => {
    const res = await client.get("/projects");
    setProjects(res.data.projects);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "My Projects")
      return p.creator?._id === user._id;

    if (activeTab === "Bookmarked")
      return p.bookmarkedBy?.includes(user._id);

    return true;
  });


  const handleCreate = async () => {
    if (!newProject.title || !newProject.category) {
      alert("Title & Category required");
      return;
    }

    const parsedRoles = newProject.lookingFor
      ? newProject.lookingFor.split(",").map((r) => {
          const [role, slots] = r.split(":");
          return {
            role: role.trim(),
            slots: Number(slots) || 1,
          };
        })
      : [];

    await client.post("/projects", {
      title: newProject.title,
      category: newProject.category,
      description: newProject.desc,
      techStacks: newProject.tech
        ? newProject.tech.split(",").map((t) => t.trim())
        : [],
      lookingFor: parsedRoles,
      status: newProject.status,
    });

    setCreateOpen(false);
    setNewProject({
      title: "",
      category: "",
      desc: "",
      tech: "",
      lookingFor: "",
      status: "Planning",
    });

    fetchProjects();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        <Button onClick={() => setCreateOpen(true)}>
          <HiOutlinePlus className="mr-1.5 h-4 w-4" />
          New Project
        </Button>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {filteredProjects.map((project) => (
          <Card key={project._id} className="flex flex-col p-5">

            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <HiOutlineFolder className="h-5 w-5" />
              </div>
              <Badge variant={STATUS_COLORS[project.status]}>
                {project.status}
              </Badge>
            </div>

            <h3 className="mt-3 text-lg font-semibold">
              {project.title}
            </h3>

            <p className="mt-1 text-sm text-neutral-500 flex-1">
              {project.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.techStacks?.slice(0, 3).map((t) => (
                <span key={t} className="rounded bg-neutral-100 px-2 py-0.5 text-xs">
                  {t}
                </span>
              ))}
            </div>

            {project.lookingFor?.length > 0 && (
              <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50 p-2">
                <p className="text-xs text-sky-700">
                  Looking for:{" "}
                  {project.lookingFor
                    .map((r) => `${r.role} (${r.slots})`)
                    .join(", ")}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-3 text-sm text-neutral-400">
                <span>
                  <HiOutlineStar className="inline mr-1" />
                  {project.starsCount}
                </span>
                <span>
                  <HiOutlineUserGroup className="inline mr-1" />
                  {project.membersCount}
                </span>
              </div>

              <button
                onClick={() => navigate(`/projects/${project._id}`)}
                className="flex items-center gap-1 text-sm text-sky-600"
              >
                <HiOutlineEye /> View
              </button>
            </div>

          </Card>
        ))}
      </div>

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Project"
      >
        <div className="space-y-4">

          <Input
            label="Project Name"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
          />

          <Input
            label="Category"
            value={newProject.category}
            onChange={(e) =>
              setNewProject({ ...newProject, category: e.target.value })
            }
          />

          <TextArea
            label="Description"
            value={newProject.desc}
            onChange={(e) =>
              setNewProject({ ...newProject, desc: e.target.value })
            }
          />

          <Input
            label="Tech Stack (comma separated)"
            value={newProject.tech}
            onChange={(e) =>
              setNewProject({ ...newProject, tech: e.target.value })
            }
          />

          <Input
            label="Looking For (Role:Slots)"
            placeholder="Frontend:2, Backend:1"
            value={newProject.lookingFor}
            onChange={(e) =>
              setNewProject({ ...newProject, lookingFor: e.target.value })
            }
          />

          <Select
            label="Status"
            value={newProject.status}
            onChange={(e) =>
              setNewProject({ ...newProject, status: e.target.value })
            }
            options={[
              { value: "Planning", label: "Planning" },
              { value: "Active", label: "Active" },
              { value: "Completed", label: "Completed" },
            ]}
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleCreate}>
              Create Project
            </Button>
          </div>

        </div>
      </Modal>

    </div>
  );
}
