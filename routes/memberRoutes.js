import express from 'express';
import {
    getMembersForAdmin, 
    getAllMembers, 
    createMember,
    getMemberById,
    updateMember,
    deleteMember,
    updateMemberStatus,
    searchMembers
} from '../controllers/memberController.js';

const memberRouter = express.Router();

// Public routes
memberRouter.get('/all-members', getAllMembers);
memberRouter.get('/search', searchMembers);
memberRouter.get('/:id', getMemberById);
memberRouter.post('/', createMember);

// Protected routes theat means admin authentication is required
memberRouter.get('/admin/all-members', getMembersForAdmin);
memberRouter.put('/:id', updateMember);
memberRouter.delete('/:id',deleteMember);
memberRouter.put('/:id/status',updateMemberStatus);

export default memberRouter;