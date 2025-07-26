import Project from "../models/projectModel"


export const getProject = async (req, res) => {
    try {
        const { id } = req.params; //
        const project = await Project.findById(id); // 
        res.status(200).json(project);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProject = async (req, res) => {
    try {   // Validate the request body
        console.log(req.body);
        const project = await Project.create(req.body);
        res.status(200).json(project); 
    }
    catch (error) { 
        res.status(500).json({ message: error.message }); // Respond with an error message
    }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Failed to update Project", error: error.message });
  }
};



  export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Project", error: error.message });
  }
};


