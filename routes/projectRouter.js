import express from "express";
import {createProject, getProject, deleteProject, updateProject} from "../controllers/projectController";

const projectRouter = express.Router();

projectRouter.put('/update/:id', updateProject);
projectRouter.delete('/delete/:id', deleteProject);
projectRouter.get('/get/:id', getProject )
projectRouter.post('/create'/ createProject)


export default projectRouter;