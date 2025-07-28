import express from "express";
import {createProject, getProject, deleteProject, updateProject, viewAllProjects} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.put('/update/:id', updateProject);
projectRouter.delete('/delete/:id', deleteProject);
projectRouter.get('/get/:id', getProject);
projectRouter.get('/all', viewAllProjects);
projectRouter.post('/create', createProject);

export default projectRouter;