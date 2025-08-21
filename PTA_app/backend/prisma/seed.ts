import { PrismaClient } from "@prisma/client";
import "dotenv/config";
const prisma = new PrismaClient();

async function main() {
  // -----------------------------
  // 1. Stampテーブル初期化 → 3件作成
  // -----------------------------
  await prisma.stamp.deleteMany();

  await prisma.stamp.createMany({
    data: [
      {
        name: "ありがとうございます",
        imageUrl:
          "https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/arigatou.png",
      },
      {
        name: "おつかれさまでした",
        imageUrl:
          "https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/otukaresama.png",
      },
      {
        name: "がんばった",
        imageUrl:
          "https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/ganbatta.png",
      },
    ],
  });

  // -----------------------------
  // 2. 保育園を1件作成
  // -----------------------------
  const nursery = await prisma.nursery.create({
    data: {
      name: "テスト保育園",
    },
  });

  await prisma.child.deleteMany();
  await prisma.point.deleteMany();
  await prisma.eventApplication.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany({
    where: {
      email: { in: ["ayaka@example.com", "staff@example.com"] },
    },
  });

  // -----------------------------
  // 3. ユーザー（保護者）1件作成
  // -----------------------------
  const parentUser = await prisma.user.create({
    data: {
      firebaseUid: "SqOV1EyG14au8o00EzGBJ3DHTTF3",
      email: "ayaka@example.com",
      passwordHash: "hashedpassword",
      name: "中村あやか",
      role: "parent",
      isAdmin: false,
      nursery: {
        connect: { id: nursery.id },
      },
    },
  });

  // -----------------------------
  // 4. ユーザー（職員）1件作成
  // -----------------------------
  const staffUser = await prisma.user.create({
    data: {
      firebaseUid: "Ti3i2LSZwxO2ovoR4TQeCJxEnpF3",
      email: "staff@example.com",
      passwordHash: "hashedpassword",
      name: "高橋さやか",
      role: "staff",
      isAdmin: true,
      nursery: {
        connect: { id: nursery.id },
      },
    },
  });

  // -----------------------------
  // 5. イベント1件作成
  // -----------------------------
  const createdEvent = await prisma.event.create({
    data: {
      title: "運動会準備",
      date: new Date(),
      capacity: 5,
      description: "運動会の準備をします",
      deadline: new Date(),
      pointReward: 20,
      createdById: staffUser.id,
      startTime: new Date().toISOString(), // 修正
      endTime: new Date().toISOString(), // 修正
      location: "場所",
      privilegeAllowed: true,
    },
  });

  // -----------------------------
  // 6. 保護者のポイント履歴を作成
  // -----------------------------
  await prisma.point.create({
    data: {
      userId: parentUser.id,
      eventId: createdEvent.id,
      points: 100,
      grantedAt: new Date(),
    },
  });

  // -----------------------------
  // 7. 景品（rewards）を複数作成
  // -----------------------------
  const rewards = [
    {
      name: "運動会前列スペース 秋",
      pointsRequired: 100,
      description: "1家庭1回まで、定員6家庭",
      capacity: 6,
    },
    {
      name: "面談時間 優先予約枠",
      pointsRequired: 30,
      description: "各時間帯ごとに枠制限あり",
      capacity: 10,
    },
  ];

  for (const r of rewards) {
    await prisma.reward.create({ data: r });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
