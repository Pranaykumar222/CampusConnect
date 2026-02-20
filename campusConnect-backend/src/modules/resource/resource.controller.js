import Resource from "./resource.model.js";


export const createResource = async (req, res) => {
  try {
    const { title, type, description, category, externalLink } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type are required",
      });
    }

    const resource = await Resource.create({
      title,
      type,
      description,
      category,
      externalLink,
      uploadedBy: req.user.id,
      fileUrl: req.file ? req.file.path : null,
    });

    res.status(201).json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};


export const getResources = async (req, res) => {
  try {
    const { uploadedBy, type } = req.query;

    const query = {};

    if (uploadedBy) {
      query.uploadedBy = uploadedBy;
    }

    if (type) {
      query.type = type;
    }

    const resources = await Resource.find(query)
      .populate("uploadedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      resources,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};


export const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);

    if (!resource)
      return res.status(404).json({ success: false });

    const alreadyViewed = resource.views.some(
      (id) => id.toString() === req.user.id
    );

    if (!alreadyViewed && resource.uploadedBy.toString() !== req.user.id) {
      resource.views.push(req.user.id);
      await resource.save();
    }

    res.json({
      success: true,
      resource,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    if (resource.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { title, type, description, link, fileSize, category } = req.body;
    if (title) resource.title = title;
    if (type) resource.type = type;
    if (description) resource.description = description;
    if (link) resource.link = link;
    if (fileSize) resource.fileSize = fileSize;
    if (category) resource.category = category;

    await resource.save();
    res.status(200).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);

    if (!resource)
      return res.status(404).json({ success: false });

    if (resource.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false });
    }

    await resource.deleteOne();

    res.json({
      success: true,
      message: "Resource deleted",
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};



export const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);

    if (!resource)
      return res.status(404).json({ success: false });

    const alreadyDownloaded = resource.downloads.some(
      (id) => id.toString() === req.user.id
    );

    if (!alreadyDownloaded && resource.uploadedBy.toString() !== req.user.id) {
      resource.downloads.push(req.user.id);
      await resource.save();
    }

    let fileUrl = resource.fileUrl;

    if (fileUrl) {
      fileUrl = fileUrl.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
    }

    res.json({
      success: true,
      fileUrl,
      externalLink: resource.externalLink,
      downloadsCount: resource.downloads.length,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const rateResource = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false });
    }

    const resource = await Resource.findById(req.params.resourceId);

    if (!resource)
      return res.status(404).json({ success: false });

    const existingRating = resource.ratings.find(
      (r) => r.user.toString() === req.user.id
    );

    if (existingRating) {
      existingRating.value = rating; 
    } else {
      resource.ratings.push({
        user: req.user.id,
        value: rating,
      });
    }

    await resource.save();

    res.json({
      success: true,
      averageRating: resource.averageRating,
      ratingsCount: resource.ratings.length,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};
