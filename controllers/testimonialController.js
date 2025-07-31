import Testimonial from "../models/testimonialModel.js";
import { isAdminValid } from "./adminController.js";

// Get all testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to load testimonials", error: error.message });
  }
};

// Get a single testimonial by ID
export const getTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new testimonial (admin only)
export const createTestimonial = async (req, res) => {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
    const newTestimonial = await Testimonial.create(req.body);
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a testimonial (admin only)
export const updateTestimonial = async (req, res) => {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const { id } = req.params;

  try {
    const updated = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update testimonial", error: error.message });
  }
};

// Delete a testimonial (admin only)
export const deleteTestimonial = async (req, res) => {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const { id } = req.params;

  try {
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete testimonial", error: error.message });
  }
};
