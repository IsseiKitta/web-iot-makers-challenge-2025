# API実装ドキュメント

このドキュメントでは、swagger.yamlに基づいて実装されたAPIエンドポイントについて説明します。

## 実装されたエンドポイント

### 認証API

#### POST /api/auth/signup
- **説明**: 新規ユーザー登録
- **認証**: 不要
- **実装**: `src/app/api/auth/signup/route.ts`

#### POST /api/auth/login
- **説明**: ユーザーログイン
- **認証**: 不要
- **実装**: `src/app/api/auth/login/route.ts`

### デバイスAPI

#### GET /api/devices
- **説明**: ユーザーのデバイス一覧取得
- **認証**: Bearer Token必須
- **実装**: `src/app/api/devices/route.ts`
- **パラメータ**:
  - `userId` (query): ユーザーID (UUID形式)

#### POST /api/devices/register
- **説明**: 新規デバイス登録
- **認証**: Bearer Token必須
- **実装**: `src/app/api/devices/register/route.ts`

#### POST /api/devices/toggle
- **説明**: デバイス（パラソル）の開閉制御
- **認証**: Bearer Token必須
- **実装**: `src/app/api/devices/toggle/route.ts`

## 環境設定

### 必要な環境変数

`.env.example`ファイルを参考に、以下の環境変数を設定してください：

\`\`\`env
# データベース接続設定
DATABASE_URL=postgresql://username:password@host:port/database_name

# JWT設定
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1h
\`\`\`

### セキュリティ設定

1. **JWT_SECRET**: 本番環境では十分に複雑で長いランダムな文字列を使用
2. **DATABASE_URL**: 適切なデータベース接続文字列を設定
3. **パスワード**: bcryptでハッシュ化して保存

## TODO（実装が必要な部分）

以下の部分はコメントで記載されており、実際のIoTデバイスとの連携時に実装が必要です：

### デバイス登録時の初期値取得
\`\`\`typescript
// TODO: 実際のIoTデバイスからの初期値を設定する必要があります
temperature: 25.0, // TODO: デバイスから取得
humidity: 50.0,    // TODO: デバイスから取得
latitude: 35.6762, // TODO: デバイスから取得 (現在は東京駅の座標)
longitude: 139.6503, // TODO: デバイスから取得
isOpen: false,     // TODO: デバイスから取得
\`\`\`

### デバイス制御処理
\`\`\`typescript
// TODO: ここで実際のIoTデバイスに開閉指示を送信する処理を追加
// 例: await sendCommandToDevice(deviceId, open ? 'OPEN' : 'CLOSE');
\`\`\`

## 型定義

共通の型定義は `src/types/api.ts` に定義されています：

- `AuthRequest` / `AuthResponse`: 認証関連
- `Device`: デバイス情報
- `DeviceRegisterRequest`: デバイス登録リクエスト
- `DeviceToggleRequest` / `DeviceToggleResponse`: デバイス制御

## エラーハンドリング

各APIエンドポイントでは以下のHTTPステータスコードを返します：

- **200**: 成功
- **201**: 作成成功
- **400**: リクエストが不正
- **401**: 認証エラー
- **403**: 権限エラー
- **404**: リソースが見つからない
- **409**: 重複エラー
- **500**: サーバーエラー