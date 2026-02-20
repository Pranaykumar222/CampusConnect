import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  HiOutlineDocumentText,
  HiOutlineVideoCamera,
  HiOutlineLink,
  HiOutlineDownload,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineStar,
  HiOutlineTrash,
} from "react-icons/hi";

const TABS = ["All", "Notes", "Video", "PDF", "Link", "My Uploads"];

const TYPE_ICONS = {
  Notes: HiOutlineDocumentText,
  Video: HiOutlineVideoCamera,
  PDF: HiOutlineDocumentText,
  Link: HiOutlineLink,
};

export default function ResourcesPage() {

  const { user } = useSelector((state) => state.auth);
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "Notes",
    category: "",
    externalLink: "",
  });

  

  const fetchResources = async () => {
    try {
      if (!user) return;
  
      let params = {};
  
      if (activeTab === "My Uploads") {
        params.uploadedBy = user._id;   
      }
  
      if (
        activeTab !== "All" &&
        activeTab !== "My Uploads"
      ) {
        params.type = activeTab;
      }
  
      const res = await client.get("/resources", { params });
  
      setResources(res.data.resources);
    } catch (err) {
      console.error("Request failed");
    }
  };
   

  useEffect(() => {
    fetchResources();
  }, [activeTab, user]);
  
  

  const handleUpload = async () => {
    try {
      setUploading(true);

      const formData = new FormData();
      Object.keys(newResource).forEach((key) => {
        formData.append(key, newResource[key]);
      });

      if (file) {
        formData.append("file", file);
      }

      await client.post("/resources", formData);

      setUploadOpen(false);
      setFile(null);
      setNewResource({
        title: "",
        description: "",
        type: "Notes",
        category: "",
        externalLink: "",
      });

      fetchResources();
    } catch (err) {
      console.error("Request failed");
    } finally {
      setUploading(false);
    }
  };


const handleDownload = async (resource) => {
  const res = await client.post(
    `/resources/${resource._id}/download`
  );

  fetchResources();

  if (res.data.fileUrl) {
    const link = document.createElement("a");
    link.href = res.data.fileUrl;
    link.download = "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (res.data.externalLink) {
    window.open(res.data.externalLink, "_blank");
  }
};




  const handleView = async (id) => {
    await client.get(`/resources/${id}`);
    fetchResources();
  };



  const handleRate = async (id, rating) => {
    await client.post(`/resources/${id}/rate`, { rating });
    fetchResources();
  };



  const handleDelete = async (id) => {
    await client.delete(`/resources/${id}`);
    fetchResources();
  };

 

  return (
    <div className="mx-auto max-w-5xl space-y-6">

     
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-neutral-500 text-sm">
            Upload and share study materials
          </p>
        </div>

        <Button onClick={() => setUploadOpen(true)}>
          <HiOutlinePlus className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>

     
      <div className="flex items-center gap-2 border rounded-xl px-4 py-2">
        <HiOutlineSearch />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent focus:outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      
      <div className="space-y-3">
      {resources.length === 0 ? (
          <Card className="p-6 text-center text-neutral-400">
            No resources found
          </Card>
        ) : (
          resources.map((r) => {
            const Icon = TYPE_ICONS[r.type];

            return (
              <Card key={r._id} className="p-4 flex items-center gap-4">

                <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <h3
                    onClick={() => handleView(r._id)}
                    className="font-semibold cursor-pointer hover:text-sky-600"
                  >
                    {r.title}
                  </h3>

                  <p className="text-sm text-neutral-500">
                    {r.description}
                  </p>

                  <div className="flex gap-4 text-xs text-neutral-400 mt-2">
                  <span>Views: {r.viewsCount}</span>
<span>Downloads: {r.downloadsCount}</span>


                  </div>

                 
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HiOutlineStar
                        key={star}
                        onClick={() => handleRate(r._id, star)}
                        className={`cursor-pointer ${
                          star <= Math.round(r.averageRating || 0)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-neutral-400 ml-2">
                    ({r.ratingsCount})
                    </span>
                  </div>
                </div>

                
                <div className="flex flex-col gap-2">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(r)}
                  >
                    <HiOutlineDownload className="mr-1 h-4 w-4" />
                    Download
                  </Button>

                  {r.uploadedBy?._id === user?.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(r._id)}
                    >
                      <HiOutlineTrash className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  )}

                </div>

              </Card>
            );
          })
        )}
      </div>

     
      <Modal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload Resource"
        size="lg"
      >
        <div className="space-y-4">

          <Input
            label="Title"
            value={newResource.title}
            onChange={(e) =>
              setNewResource({ ...newResource, title: e.target.value })
            }
          />

          <TextArea
            label="Description"
            value={newResource.description}
            onChange={(e) =>
              setNewResource({
                ...newResource,
                description: e.target.value,
              })
            }
          />

          <Select
            label="Type"
            value={newResource.type}
            onChange={(e) =>
              setNewResource({ ...newResource, type: e.target.value })
            }
            options={[
              { value: "Notes", label: "Notes" },
              { value: "Video", label: "Video" },
              { value: "PDF", label: "PDF" },
              { value: "Link", label: "Link" },
            ]}
          />

          <Input
            label="Category"
            value={newResource.category}
            onChange={(e) =>
              setNewResource({
                ...newResource,
                category: e.target.value,
              })
            }
          />

          <Input
            label="External Link (optional)"
            value={newResource.externalLink}
            onChange={(e) =>
              setNewResource({
                ...newResource,
                externalLink: e.target.value,
              })
            }
          />

          <div className="border-2 border-dashed rounded-xl p-6 text-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && (
              <p className="text-xs mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>

        </div>
      </Modal>

    </div>
  );
}

