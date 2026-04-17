# =========================
# 1️⃣ Builder Stage
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# 安裝依賴（只安裝 production + build 需要）
COPY package.json package-lock.json ./
RUN npm ci

# 複製 source
COPY tsconfig.json ./
COPY src ./src

# 編譯 TypeScript
RUN npm run build


# =========================
# 2️⃣ Runtime Stage
# =========================
FROM node:22-alpine

WORKDIR /app

# 只安裝 production 依賴
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 複製 build 後的檔案
COPY --from=builder /app/dist ./dist

# （可選）設定環境變數
ENV NODE_ENV=production

# container 對外 port
EXPOSE 5000

# 啟動 server
CMD ["node", "dist/server.js"]