import express from "express";
import {getAllTestimonials, getTestimonial, createTestimonial, updateTestimonial, deleteTestimonial, searchTestimonials, getTestimonialsPaginated} from "../controllers/testimonialController.js";

const testimonialRouter = express.Router();

testimonialRouter.get("/search", getTestimonialsPaginated);

testimonialRouter.get("/", getAllTestimonials);

testimonialRouter.get("/:id", getTestimonial);

testimonialRouter.post("/", createTestimonial);

testimonialRouter.put("/:id", updateTestimonial);

testimonialRouter.delete("/:id", deleteTestimonial);



export default testimonialRouter;
