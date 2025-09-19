# Vercel Deployment Guide

このプロジェクトをVercelにデプロイする際の設定方法について説明します。

## Vercel Postgres Integration

### 1. Vercel Postgresの追加

1. Vercelダッシュボードでプロジェクトを開く
2. 「Storage」タブを選択
3. 「Create Database」をクリック
4. 「Postgres」を選択してデータベースを作成

### 2. 自動設定される環境変数

Vercel Postgresを追加すると、以下の環境変数が自動的に設定されます：

```bash
# メイン接続URL（コネクションプーリング有効）
POSTGRES_PRISMA_URL="postgres://username:password@host:port/database?pgbouncer=true&connect_timeout=15"

# 標準接続URL
POSTGRES_URL="postgres://username:password@host:port/database"

# 直接接続URL（コネクションプーリング無効）
POSTGRES_URL_NON_POOLING="postgres://username:password@host:port/database"

# 個別の値
POSTGRES_USER="username"
POSTGRES_HOST="host"
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="database"
```

### 3. Prisma設定

PrismaはシンプルにDATABASE_URLを使用します：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**重要**: Vercelは自動的に`DATABASE_URL`を`POSTGRES_PRISMA_URL`の値で上書きします。
- **ローカル開発**: `DATABASE_URL`にDocker PostgreSQLのURLを設定
- **Vercel本番**: `DATABASE_URL`が自動的に`POSTGRES_PRISMA_URL`になる

## 環境変数の優先順位

1. **本番環境（Vercel）**: `POSTGRES_PRISMA_URL`を使用
2. **ローカル開発**: `DATABASE_URL`を使用（Docker Compose）

## デプロイ手順

### 1. GitHubリポジトリの準備

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2. Vercelプロジェクトの作成

1. [Vercel](https://vercel.com)にログイン
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. 以下の設定を確認：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. データベースの設定

1. プロジェクトデプロイ後、「Storage」タブでPostgresを追加
2. データベーステーブルの作成（以下のいずれかの方法）：

#### 方法A: Vercel CLIを使用

```bash
# Vercel CLIをインストール
npm i -g vercel

# ログイン
vercel login

# 環境変数をローカルに取得
vercel env pull .env.local

# Prismaマイグレーション実行
npx prisma migrate deploy

# または、Prisma DBプッシュ
npx prisma db push
```

#### 方法B: SQLを直接実行

Vercelダッシュボードの「Storage」→「Query」で以下のSQLを実行：

```sql
-- Users table
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Devices table
CREATE TABLE "Device" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  temperature DOUBLE PRECISION NOT NULL,
  humidity DOUBLE PRECISION NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  "isOpen" BOOLEAN NOT NULL,
  "userId" INTEGER NOT NULL REFERENCES "User"(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_device_user_id ON "Device"("userId");
CREATE INDEX idx_user_name ON "User"(name);
```

### 4. 追加の環境変数設定

Vercelダッシュボードの「Settings」→「Environment Variables」で以下を設定：

```bash
# JWT設定
JWT_SECRET=your_super_secret_jwt_key_for_production
JWT_EXPIRES_IN=1h

# Supabase設定（使用する場合）
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## パフォーマンス最適化

### 1. コネクションプーリング

Vercel Postgresは自動的にPgBouncerを使用してコネクションプーリングを行います。`POSTGRES_PRISMA_URL`を使用することで、この機能が有効になります。

### 2. エッジランタイム対応

API routesでエッジランタイムを使用する場合：

```typescript
// src/app/api/example/route.ts
export const runtime = 'edge';
```

### 3. 静的生成の活用

可能な限り静的生成を使用してパフォーマンスを向上：

```typescript
// ページレベルでの静的生成
export const dynamic = 'force-static';
```

## トラブルシューティング

### よくある問題

1. **データベース接続エラー**
   ```
   Error: P1001: Can't reach database server
   ```
   → Vercel Postgresが正しく設定されているか確認

2. **ビルドエラー**
   ```
   Error: Prisma schema not found
   ```
   → `prisma/schema.prisma`が正しいパスにあるか確認

3. **環境変数エラー**
   ```
   Error: DATABASE_URL is not defined
   ```
   → Vercel環境変数が正しく設定されているか確認

### デバッグ方法

1. Vercelログの確認：
   ```bash
   vercel logs
   ```

2. 環境変数の確認：
   ```bash
   vercel env ls
   ```

3. ローカルでの環境変数テスト：
   ```bash
   vercel env pull .env.local
   npm run build
   ```

## セキュリティ

### 本番環境での注意点

1. **JWT_SECRET**: 十分に長く複雑な文字列を使用
2. **データベースアクセス**: 必要最小限の権限のみ付与
3. **環境変数**: 機密情報はVercelの環境変数として設定
4. **CORS設定**: 本番ドメインのみ許可

### 推奨設定

```bash
# 強力なJWT秘密鍵（本番用）
JWT_SECRET=very-long-random-string-for-production-use-at-least-32-characters

# CORS設定（必要に応じて）
ALLOWED_ORIGINS=https://your-domain.vercel.app
```

これで、VercelとVercel Postgresを使用した本格的なデプロイが可能になります！