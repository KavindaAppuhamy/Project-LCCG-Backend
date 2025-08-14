import Member from "../models/member.js";
import { isAdminValid } from "./adminController.js";
import mongoose from "mongoose";

// Utility to enrich member with age and fullName
async function enrichMember(member) {
    return {
        ...member._doc,
        age: member.age,
        fullName: member.fullName
    };
}

export async function getAllMembers(req, res) {
    try {
        const members = await Member.find(); // No filter on status

        const enrichedMembers = await Promise.all(
            members.map(async (member) => {
                try {
                    return await enrichMember(member);
                } catch (e) {
                    console.error("Failed to enrich member:", member._id, e);
                    return member;
                }
            })
        );

        res.json({ members: enrichedMembers });

    } catch (err) {
        console.error("Error in getAllMembersForUsers:", err);
        res.status(500).json({
            message: "Failed to fetch members",
            error: err.message
        });
    }
}

export async function getMembersForAdmin(req, res) {
    if (!isAdminValid(req)) {
        return res.status(403).json({
            message: "You are not authorized to view all members"
        });
    }

    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const [members, totalMembers] = await Promise.all([
            Member.find().skip(skip).limit(limit),
            Member.countDocuments()
        ]);

        const enrichedMembers = await Promise.all(
            members.map(async (member) => {
                try {
                    return await enrichMember(member);
                } catch (e) {
                    console.error("Failed to enrich member:", member._id, e);
                    return member;
                }
            })
        );

        res.json({
            members: enrichedMembers,
            total: totalMembers,
            page,
            pages: Math.ceil(totalMembers / limit)
        });

    } catch (err) {
        console.error("Error in getMembersForAdmin:", err);
        res.status(500).json({
            message: "Failed to fetch members",
            error: err.message
        });
    }
}

export async function createMember(req, res) {
    try {
        
        if (!req.body.mylci || req.body.mylci.trim() === "") {
            delete req.body.mylci; // removes the field entirely
        }

        const member = new Member(req.body);
        await member.save();

        res.status(201).json({
            message: "Member created successfully",
            member: await enrichMember(member)
        });
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            res.status(409).json({
                message: `${field} already exists`,
                error: err.message
            });
        } else if (err.name === 'ValidationError') {
            res.status(400).json({
                message: "Validation failed",
                error: err.message
            });
        } else {
            res.status(500).json({
                message: "Failed to create member",
                error: err.message
            });
        }
    }
}


export async function getMemberById(req, res) {
    try {
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        if (member.status !== 'accept' && !isAdminValid(req)) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.json(await enrichMember(member));
    } catch (err) {
        res.status(500).json({
            message: "Failed to get member",
            error: err.message
        });
    }
}

export async function updateMember(req, res) {
    if (!isAdminValid(req)) {
        return res.status(403).json({
            message: "You are not authorized to update member details"
        });
    }

    try {
        const updateData = { ...req.body };
        const updateOps = {};

        // Handle normal fields
        const fieldsToUpdate = { ...updateData };
        delete fieldsToUpdate.mylci; // remove mylci from normal fields

        if (Object.keys(fieldsToUpdate).length > 0) {
            updateOps.$set = fieldsToUpdate;
        }

        // Handle mylci removal
        if (!updateData.mylci || updateData.mylci.trim() === "") {
            updateOps.$unset = { mylci: "" };
        } else {
            updateOps.$set = { ...updateOps.$set, mylci: updateData.mylci };
        }

        const member = await Member.findByIdAndUpdate(
            req.params.id,
            updateOps,
            { new: true, runValidators: true, context: 'query' }
        );

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.json({
            message: "Member updated successfully",
            member: await enrichMember(member)
        });
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            res.status(409).json({
                message: `${field} already exists`,
                error: err.message
            });
        } else if (err.name === 'ValidationError') {
            res.status(400).json({
                message: "Validation failed",
                error: err.message
            });
        } else {
            res.status(500).json({
                message: "Failed to update member",
                error: err.message
            });
        }
    }
}



export async function deleteMember(req, res) {
    if (!isAdminValid(req)) {
        return res.status(403).json({
            message: "You are not authorized to delete members"
        });
    }

    try {
        const member = await Member.findByIdAndDelete(req.params.id);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.json({ message: "Member deleted successfully" });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete member",
            error: err.message
        });
    }
}

export async function updateMemberStatus(req, res) {
    // Debug auth
    console.log("User:", req.user);
    if (!isAdminValid(req)) {
        return res.status(403).json({
            message: "You are not authorized to update member status"
        });
    }

    try {
        const memberId = req.params.id;
        const { status } = req.body;
        const validStatuses = ['accept', 'reject', 'pending'];

        if (!mongoose.Types.ObjectId.isValid(memberId)) {
            return res.status(400).json({ message: "Invalid member ID format" });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        console.log("Updating member ID:", memberId, "with status:", status);

        const member = await Member.findByIdAndUpdate(
            memberId,
            { status },
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Try enrichMember if defined
        let enriched = member;
        if (typeof enrichMember === 'function') {
            enriched = await enrichMember(member);
        }

        res.json({
            message: "Member status updated successfully",
            member: enriched
        });
    } catch (err) {
        console.error("Error updating member status:", err);
        res.status(500).json({
            message: "Failed to update member status",
            error: err.message
        });
    }
}


export async function searchMembers(req, res) {
    try {
        const { query, status } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const baseSearch = {
            $or: [
                { firstName: { $regex: query || '', $options: 'i' } },
                { lastName: { $regex: query || '', $options: 'i' } },
                { email: { $regex: query || '', $options: 'i' } },
                { mylci: { $regex: query || '', $options: 'i' } }
            ]
        };

        const validStatuses = ['accept', 'reject', 'pending'];
        const isAdmin = isAdminValid(req);

        // 🔍 Apply status filter
        if (isAdmin) {
            if (status && validStatuses.includes(status)) {
                baseSearch.status = status;
            }
            // else show all statuses (no filter)
        } else {
            baseSearch.status = 'accept'; // users can only see accepted
        }

        const members = await Member.find(baseSearch).skip(skip).limit(limit);
        const total = await Member.countDocuments(baseSearch);

        const enrichedMembers = await Promise.all(members.map(enrichMember));

        res.json({
            members: enrichedMembers,
            total,
            page,
            pages: Math.ceil(total / limit)
        });

    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({
            message: "Search failed",
            error: err.message
        });
    }
}


//In a frontend application, you can use this logic for searching members
/*
<select onChange={(e) => setStatus(e.target.value)}>
  <option value="">All</option>
  <option value="accept">Accepted</option>
  <option value="reject">Rejected</option>
  <option value="pending">Pending</option>
</select>
*/
