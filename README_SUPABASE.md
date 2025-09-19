# Supabase Setup Guide

このプロジェクトではSupabaseを使用してバックエンド機能を提供します。

## セットアップ手順

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. データベースパスワードを設定

### 2. 環境変数の設定

Supabaseプロジェクトダッシュボードの「Settings」→「API」から以下の値を取得し、`.env`ファイルに設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. データベーススキーマの作成

Supabaseダッシュボードの「SQL Editor」で以下のSQLを実行してテーブルを作成してください：

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

-- Create indexes for better performance
CREATE INDEX idx_device_user_id ON "Device"("userId");
CREATE INDEX idx_user_name ON "User"(name);

-- Enable Row Level Security (RLS)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Device" ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only read their own data
CREATE POLICY "Users can read own data" ON "User" FOR SELECT USING (auth.uid()::text = id::text);

-- Users can only access their own devices
CREATE POLICY "Users can read own devices" ON "Device" FOR SELECT USING (auth.uid()::text = "userId"::text);
CREATE POLICY "Users can insert own devices" ON "Device" FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);
CREATE POLICY "Users can update own devices" ON "Device" FOR UPDATE USING (auth.uid()::text = "userId"::text);
CREATE POLICY "Users can delete own devices" ON "Device" FOR DELETE USING (auth.uid()::text = "userId"::text);
```

### 4. Prismaスキーマの更新

PrismaをSupabaseと連携させるために、`DATABASE_URL`をSupabaseのPostgreSQLデータベースURLに更新してください：

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 5. 認証設定

Supabaseダッシュボードの「Authentication」→「Settings」で以下を設定：

- **Site URL**: `http://localhost:3000` (開発環境)
- **Redirect URLs**: `http://localhost:3000/**`

## 使用方法

### 基本的な認証フロー

```typescript
import { supabase } from '@/lib/supabase';

// サインアップ
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// ログイン
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// ログアウト
const { error } = await supabase.auth.signOut();
```

### データベース操作

```typescript
import { supabase } from '@/lib/supabase';

// データの取得
const { data, error } = await supabase
  .from('Device')
  .select('*')
  .eq('userId', userId);

// データの挿入
const { data, error } = await supabase
  .from('Device')
  .insert({
    name: 'Device Name',
    temperature: 25.0,
    humidity: 60.0,
    latitude: 35.6762,
    longitude: 139.6503,
    isOpen: false,
    userId: userId
  });
```

## 特徴

- **リアルタイムデータベース**: データの変更をリアルタイムで監視
- **行レベルセキュリティ**: ユーザーは自分のデータのみアクセス可能
- **認証システム**: メール/パスワードによる認証
- **自動バックアップ**: Supabaseが自動的にデータをバックアップ
- **スケーラブル**: トラフィックに応じて自動スケーリング

## トラブルシューティング

### よくある問題

1. **接続エラー**: 環境変数が正しく設定されているか確認
2. **認証エラー**: Site URLとRedirect URLsが正しく設定されているか確認
3. **権限エラー**: RLSポリシーが適切に設定されているか確認

### デバッグ

開発時は以下のコードでSupabaseクライアントの状態を確認できます：

```typescript
import { supabase } from '@/lib/supabase';

// 現在のセッション情報を取得
const { data: { session } } = await supabase.auth.getSession();
console.log('Current session:', session);

// 現在のユーザー情報を取得
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```