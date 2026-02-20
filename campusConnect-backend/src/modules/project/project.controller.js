import Project from "./project.model.js";
import User from "../user/user.model.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      techStacks,
      lookingFor,
      status,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    const project = await Project.create({
      title,
      category,
      description,
      techStacks: techStacks || [],
      lookingFor: lookingFor || [],
      status: status || "Planning",
      creator: req.user.id,
      contributors: [req.user.id],
    });

    res.status(201).json({
      success: true,
      project,
    });

  } catch (error) {
    console.log("CREATE PROJECT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("creator", "firstName lastName")
      .populate("contributors", "firstName lastName");

    res.json({
      success: true,
      projects,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("creator", "firstName lastName")
      .populate("contributors", "firstName lastName")
      .populate("lookingFor.applicants", "firstName lastName")


    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { title, category, description, techStacks, lookingFor, status } = req.body;
    if (title) project.title = title;
    if (category) project.category = category;
    if (description) project.description = description;
    if (techStacks) project.techStacks = techStacks;
    if (lookingFor) project.lookingFor = lookingFor;
    if (status) project.status = status;

    await project.save();
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project)
      return res.status(404).json({ success: false });

    if (project.creator.toString() !== req.user.id.toString())
      return res.status(403).json({ success: false });

    await Project.findByIdAndDelete(req.params.projectId);

    res.json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false });
  }
};

  
export const applyToProject = async (req, res) => {
  try {
    const { role } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    if (project.creator.toString() === req.user.id)
      return res.status(400).json({ message: "Creator cannot apply" });

    const roleObj = project.lookingFor.find(r => r.role === role);
    if (!roleObj)
      return res.status(400).json({ message: "Role not found" });

    const alreadyApplied = roleObj.applicants.some(
      id => id.toString() === req.user.id
    );

    const alreadyAccepted = roleObj.accepted?.some(
      id => id.toString() === req.user.id
    );

    const remainingSlots =
      roleObj.slots - (roleObj.accepted?.length || 0);

    if (alreadyApplied || alreadyAccepted)
      return res.status(400).json({ message: "Already applied" });

    if (remainingSlots <= 0)
      return res.status(400).json({ message: "No slots remaining" });

    roleObj.applicants.push(req.user.id);

    await project.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const manageApplicants = async (req, res) => {
  try {
    const { userId, role, action } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    if (project.creator.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const roleObj = project.lookingFor.find(r => r.role === role);
    if (!roleObj)
      return res.status(400).json({ message: "Role not found" });

    if (action === "accept") {

      const remaining =
        roleObj.slots - (roleObj.accepted?.length || 0);

      if (remaining <= 0)
        return res.status(400).json({
          message: "No slots remaining"
        });

      roleObj.accepted.push(userId);

      if (!project.contributors.includes(userId)) {
        project.contributors.push(userId);
      }

      roleObj.applicants = roleObj.applicants.filter(
        id => id.toString() !== userId.toString()
      );
    }

    if (action === "reject") {
      roleObj.applicants = roleObj.applicants.filter(
        id => id.toString() !== userId.toString()
      );
    }

    await project.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const manageContributors = async (req, res) => {
  try {
    const { userId, action } = req.body;

    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        message: "userId and action are required",
      });
    }

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.creator.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    project.contributors = project.contributors.filter(
      (id) => id && id.toString()
    );

    if (action === "add") {
      const exists = project.contributors.some(
        (id) => id.toString() === userId.toString()
      );

      if (!exists) {
        project.contributors.push(userId);
      }
    }

    if (action === "remove") {
      project.contributors = project.contributors.filter(
        (id) => id && id.toString() !== userId.toString()
      );
    }

    await project.save();

    res.json({
      success: true,
      contributors: project.contributors,
    });

  } catch (err) {
    console.error("Manage contributors error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};





export const toggleStarProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project)
      return res.status(404).json({ success: false });

    const userId = req.user.id;

    const alreadyStarred = project.stars.includes(userId);

    if (alreadyStarred) {
      project.stars.pull(userId);
    } else {
      project.stars.push(userId);
    }

    await project.save();

    res.json({
      success: true,
      starsCount: project.stars.length,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};



export const toggleBookmarkProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project)
      return res.status(404).json({ success: false });

    const userId = req.user.id;

    const alreadyBookmarked = project.bookmarkedBy.includes(userId);

    if (alreadyBookmarked) {
      project.bookmarkedBy.pull(userId);
    } else {
      project.bookmarkedBy.push(userId);
    }

    await project.save();

    res.json({
      success: true,
      bookmarkedCount: project.bookmarkedBy.length,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

