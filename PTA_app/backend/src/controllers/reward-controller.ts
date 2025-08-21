import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 一覧取得
export const getRewards = async (req: Request, res: Response) => {
  const rewards = await prisma.reward.findMany();
  res.json(rewards);
};

// 追加
export const createReward = async (req: Request, res: Response) => {
  const { name, description, pointsRequired, capacity } = req.body;
  if (!name || pointsRequired == null) {
    return res.status(400).json({ message: 'name, pointは必須です' });
  }
  const reward = await prisma.reward.create({ data: { name, description, pointsRequired, capacity } });
  res.status(201).json(reward);
};

// 編集
export const updateReward = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('updateReward id:', id); // ← ここでidが本当に値入ってるかチェック！
  // DBに本当にそのidがあるかを事前に確認
  const exists = await prisma.reward.findUnique({ where: { id } });
  console.log('DB exists:', exists);
  if (!exists) {
    return res.status(404).json({ message: `id ${id} は存在しません` });
  }
  const { name, description, pointsRequired, capacity } = req.body;
  try {
    const reward = await prisma.reward.update({
      where: { id: id! }, // ←ここ
      data: { name, description, pointsRequired, capacity }
    });
    res.json(reward);
  } catch (err) {
    console.error('Prisma update error:', err);
    res.status(400).json({ message: '更新に失敗しました', error: err });
  }
};

// 削除
export const deleteReward = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.reward.delete({ where: { id } });
  res.status(204).end();
};
