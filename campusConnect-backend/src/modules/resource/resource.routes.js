import express from "express";
import {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  downloadResource,
  rateResource,
} from "../resource/resource.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = express.Router();


router.use(authMiddleware);


router.post(
  "/",
  authMiddleware,
  upload.single("file"),   
  createResource
);
router.get("/", getResources);

router.get("/:resourceId", getResource);

router.patch("/:resourceId", updateResource);

router.delete("/:resourceId", deleteResource);

router.post("/:resourceId/download", downloadResource);

router.post("/:resourceId/rate", rateResource);


export default router;
