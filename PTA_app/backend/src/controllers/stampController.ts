// src/controllers/stampController.ts

import { RequestHandler } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// スタンプ一覧取得（GET /api/stamps）
export const getStamps: RequestHandler = async (_req, res, next) => {
  try {
    const stamps = await prisma.stamp.findMany()
    res.json(stamps)
  } catch (error) {
    next(error)
  }
}

// スタンプ送信（POST /api/send-stamp）
export const sendStamp: RequestHandler = async (req, res, next) => {
  const { userId, stampId } = req.body

  if (!userId || !stampId) {
    res.status(400).json({ error: 'userIdとstampIdが必要です' })
    return
  }

  try {
    res.json({ message: 'スタンプを送信しました（仮動作）', userId, stampId })
  } catch (error) {
    next(error)
  }
}
