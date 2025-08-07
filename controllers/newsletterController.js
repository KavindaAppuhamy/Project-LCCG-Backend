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
// View all newsletters with pagination
export async function viewAllNewslettersPaginated(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Newsletter.countDocuments();
    const newsletters = await Newsletter.find()
      .sort({ date: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    res.json({
      newsletters,
      page,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load newsletters", error: error.message });
  }
}
// Search + Pagination
export async function searchNewsletters(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const query = req.query.query?.trim() || "";
    const status = req.query.status;

    const filter = {
      ...(query && {
        title: { $regex: new RegExp(query, "i") } // title search
      }),
      ...(status === "active"
        ? { disabled: false }
        : status === "disabled"
        ? { disabled: true }
        : {})
    };

    const total = await Newsletter.countDocuments(filter);
    const newsletters = await Newsletter.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      newsletters,
      page,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to search newsletters",
      error: error.message
    });
  }
}
