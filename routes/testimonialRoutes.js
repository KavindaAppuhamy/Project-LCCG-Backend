import express from "express";
import {getAllTestimonials, getTestimonial, createTestimonial, updateTestimonial, deleteTestimonial, searchTestimonials} from "../controllers/testimonialController.js";

const testimonialRouter = express.Router();


testimonialRouter.get("/", getAllTestimonials);

testimonialRouter.get("/:id", getTestimonial);

testimonialRouter.post("/", createTestimonial);

testimonialRouter.put("/:id", updateTestimonial);

testimonialRouter.delete("/:id", deleteTestimonial);

testimonialRouter.get("/search", searchTestimonials);

export default testimonialRouter;
