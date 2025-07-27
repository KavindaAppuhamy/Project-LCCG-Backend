import Newsletter from "../models/newsletter.js";
import { isAdminValid } from "./adminController.js";

// Create newsletter
export async function createNewsletter(req, res) {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
    const newsletter = new Newsletter(req.body);
    await newsletter.save();
    res.status(201).json({ message: "Newsletter created", newsletter });
  } catch (error) {
    res.status(500).json({ message: "Creation failed", error: error.message });
  }
}

// Update newsletter
export async function updateNewsletter(req, res) {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const id = req.params.id;

  try {
    const updated = await Newsletter.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    res.json({ message: "Newsletter updated", newsletter: updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
}

// Delete newsletter
export async function deleteNewsletter(req, res) {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const id = req.params.id;

  try {
    const deleted = await Newsletter.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    res.json({ message: "Newsletter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
}

// View single newsletter
export async function viewNewsletter(req, res) {
  const id = req.params.id;

  try {
    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ message: "View failed", error: error.message });
  }
}

// View all newsletters
export async function viewAllNewsletters(req, res) {
  try {
    const newsletters = await Newsletter.find();
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: "Failed to load newsletters", error: error.message });
  }
}
