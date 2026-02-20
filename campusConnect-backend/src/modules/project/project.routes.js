import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  applyToProject,
  manageApplicants,
  manageContributors,
  toggleStarProject,
  toggleBookmarkProject,
} from "../project/project.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();


router.use(authMiddleware);

router.post("/", createProject);

router.get("/", getProjects);

router.get("/:projectId", getProject);

router.patch("/:projectId", updateProject);

router.delete("/:projectId", deleteProject);

router.post("/:projectId/apply", applyToProject);

router.patch("/:projectId/applicants", manageApplicants);




router.patch("/:projectId/contributors", manageContributors);

router.post("/:projectId/star", toggleStarProject);
router.post("/:projectId/bookmark", toggleBookmarkProject);


export default router;
