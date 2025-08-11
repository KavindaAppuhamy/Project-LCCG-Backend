import Project from "../models/projectModel.js";
import { isAdminValid } from "./adminController.js";

// Get single project
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new project (admin only)
export const createProject = async (req, res) => {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
    // If highlight is true, un-highlight all others first
    if (req.body.highlight === true) {
      await Project.updateMany({ highlight: true }, { $set: { highlight: false } });
    }

    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `Duplicate value for '${field}': '${error.keyValue[field]}'. Please use a unique value.`
      });
    }
    res.status(500).json({ message: error.message });
  }
};


// Update project (admin only)
export const updateProject = async (req, res) => {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const { id } = req.params;

  try {
    // If highlight is being set to true, remove it from others
    if (req.body.highlight === true) {
      await Project.updateMany({ highlight: true }, { $set: { highlight: false } });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
   } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `Duplicate value for '${field}': '${error.keyValue[field]}'. Please use a unique value.`
      });
    }
    res.status(500).json({ message: "Failed to update project", error: error.message });
  }
};



// Delete project (admin only)
export const deleteProject = async (req, res) => {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project", error: error.message });
  }
};
export const viewAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to load projects", error: error.message });
  }
};

// Get projects with pagination
export const getProjectsPaginated = async (req, res) => {
  try {
    let { page = 1, limit = 10, status } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // Build query object
    const query = {};
    if (status && status !== "all" && status !== "order") {
      query.status = status;
    }

    const [projects, total] = await Promise.all([
      Project.find(query).skip(skip).limit(limit),
      Project.countDocuments(query)
    ]);

    res.status(200).json({
      projects,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load projects", error: error.message });
  }
};




// Get highlight project + 4 related projects
export const getFeaturedAndRelatedProjects = async (req, res) => {
  try {
    // Find the highlight project, status != 'disabled'
    const highlightProject = await Project.findOne({ highlight: true, status: { $ne: "disabled" } });

    // Find related projects with order 1-5, highlight false, status != disabled, limit 4, sorted by order ascending
    const relatedProjects = await Project.find({
      highlight: false,
      status: { $ne: "disabled" },
      order: { $gt: 0, $lte: 5 }
    })
      .sort({ order: 1 })
      .limit(4);

    res.status(200).json({ highlightProject, relatedProjects });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
};

