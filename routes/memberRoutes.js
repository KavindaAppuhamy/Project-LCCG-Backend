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
import { authenticate, isAdminValid } from '../controllers/adminController.js';

const memberRouter = express.Router();

// Public routes
memberRouter.get('/', getMembers);
memberRouter.get('/search', searchMembers);
memberRouter.get('/:id', getMemberById);
memberRouter.post('/', createMember);

// Protected routes theat means admin authentication is required
memberRouter.put('/:id', authenticate, isAdminValid, updateMember);
memberRouter.delete('/:id', authenticate, isAdminValid, deleteMember);
memberRouter.patch('/:id/status', authenticate, isAdminValid, updateMemberStatus);

export default memberRouter;