import { Router } from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  applyEvent,
  cancelEvent,
} from "../controllers/event-controller";
import {
  requireAuth,
  requireStaff,
  requireAdmin,
  requireParent,
} from "../middlewares/auth-middleware";

const router = Router();

// ＊＊一般公開OK＊＊
// GET イベント一覧取得
router.get("/", requireAuth, getEvents);
// GET 特定のイベント取得
router.get("/:id", requireAuth, getEventById);

// ＊＊保護者だけアクセスできる＊＊
// イベント参加申込
router.post("/:eventId/apply", requireAuth, requireParent, applyEvent);
// イベントキャンセル
router.post("/:eventId/cancel", requireAuth, requireParent, cancelEvent);
// イベント参加者一覧取得
router.get(
  "/:id/participants",
  requireAuth,
  requireStaff,
  getEventParticipants
);

// ＊＊管理者のみアクセスできる＊＊
// POST 新規イベント作成
router.post("/", requireAuth, requireAdmin, createEvent);
// PUT イベント更新
router.put("/:id", requireAuth, requireAdmin, updateEvent);
// DELETE イベント削除
router.delete("/:id", requireAuth, requireAdmin, deleteEvent);

export default router;
