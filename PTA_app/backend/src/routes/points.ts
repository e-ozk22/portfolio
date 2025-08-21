import express from 'express';
import { getUserPoint, getUserPointHistory, grantPoint, spendPoint } from '../controllers/point-controller';


const router = express.Router();

// ユーザーの保有ポイント
router.get('/:userId', getUserPoint);

// ユーザーのポイント履歴
router.get('/:userId/history', getUserPointHistory);

// ★ ポイント付与（管理者）
router.post('/', grantPoint);

// ポイント交換
router.post("/spend", spendPoint);
export default router;
