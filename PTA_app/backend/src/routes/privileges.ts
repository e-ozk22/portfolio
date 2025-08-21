import express from 'express';
import { getUserPrivileges } from '../controllers/privileges-controller';

const router = express.Router();

// ユーザーの優先権一覧
router.get('/:userId', getUserPrivileges);

export default router;
