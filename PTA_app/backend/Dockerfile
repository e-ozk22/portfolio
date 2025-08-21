# backend/Dockerfile

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ ポートを明示（任意だが推奨）
EXPOSE 4000

# ✅ Prisma クライアントをビルド後に起動する
CMD ["sh", "-c", "npx prisma generate && npm run dev"]