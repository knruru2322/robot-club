# Node.js 18をベースイメージとして使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 開発依存関係も含めてインストール（--only=productionを削除）
RUN npm ci

# アプリケーションのソースコードをコピー
COPY . .

# ポート3000を公開
EXPOSE 3000

# 非rootユーザーを作成して使用
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# アプリケーションを起動
CMD ["npm", "run", "dev"]