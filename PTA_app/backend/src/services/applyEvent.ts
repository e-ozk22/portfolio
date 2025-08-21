import prisma from "../../prisma/client";

// イベントIDとユーザーIDを使ってイベントに申し込む
// $transaction()は、複数のDB操作を一つのトランザクションとして扱うためのprismaのメソッド
export const applyEvent = async (eventId: string, userId: string) => {
  return await prisma.$transaction(async (tx) => {
    // 現在の申し込み状況を確認
    if (!eventId || !userId) {
      throw new Error("イベントIDとユーザーIDは必須です");
    }

    // イベントと参加者情報を取得
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: { applications: true },
    });

    if (!event) {
      throw new Error("イベントが見つかりません");
    }

    if (
      event.applications.some((application) => application.userId === userId)
    ) {
      throw new Error("すでに申し込み済みです");
    }

    // 定員OK
    return await tx.eventApplication.create({
      data: {
        eventId,
        userId,
        status: "APPLIED", // 申し込み状態を設定
      },
    });
  });
};
