import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ユーザーの優先権一覧取得
export const getUserPrivileges = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const privileges = await prisma.privilege.findMany({
      where: { userId },
      include: {
        event: true,
        reward: true
      },
      orderBy: { exchangedAt: 'desc' }
    });
    res.json(privileges);
  } catch (err) {
    res.status(400).json({ message: '優先権取得失敗', error: err });
  }
};
