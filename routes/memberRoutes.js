import express from 'express';
import {
    getMembers,
    createMember,
    getMemberById,
    updateMember,
    deleteMember,
    updateMemberStatus,
    searchMembers
} from '../controllers/memberController.js';
import { isAdminValid } from '../controllers/adminController.js';

const memberRouter = express.Router();

// Public routes
memberRouter.get('/', getMembers);
memberRouter.get('/search', searchMembers);
memberRouter.get('/:id', getMemberById);
memberRouter.post('/', createMember);

// Protected routes theat means admin authentication is required
memberRouter.put('/:id', isAdminValid, updateMember);
memberRouter.delete('/:id',isAdminValid, deleteMember);
memberRouter.patch('/:id/status',isAdminValid, updateMemberStatus);

export default memberRouter;