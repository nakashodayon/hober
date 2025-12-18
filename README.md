# Hober

ブラウザ上で選択したテキストをTTS読み上げ・翻訳できるブラウザ拡張機能

## 機能

- **TTS読み上げ**: Eleven Labs API (eleven_v3 model) を使用した高品質な音声読み上げ
- **翻訳**: Gemini 3 Flash Preview を使用したAI翻訳
- **認証**: Google OAuth またはメール/パスワードによるログイン
- **サブスクリプション**: Stripe による月額/年額課金

## 技術スタック

- **拡張機能**: WXT + React + TypeScript
- **UI**: Coss UI (Tailwind CSS)
- **バックエンド**: Convex
- **認証**: Google OAuth (chrome.identity API) + メール/パスワード
- **決済**: Stripe
- **TTS**: Eleven Labs API
- **翻訳**: Google Gemini API

## セットアップ

### 1. 依存パッケージのインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーして、Convex の URL を設定:

```bash
cp .env.example .env
# VITE_CONVEX_URL を設定
```

### 3. Convex のセットアップ

```bash
npx convex dev --once --configure=new
```

### 4. Convex 環境変数の設定

```bash
npx convex env set SITE_URL "https://your-convex-url.convex.site"
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
npx convex env set GOOGLE_CLIENT_ID "your-google-client-id"
npx convex env set GOOGLE_CLIENT_SECRET "your-google-client-secret"
npx convex env set ELEVENLABS_API_KEY "your-elevenlabs-api-key"
npx convex env set GEMINI_API_KEY "your-gemini-api-key"
npx convex env set STRIPE_SECRET_KEY "sk_test_xxx"
npx convex env set STRIPE_WEBHOOK_SECRET "whsec_xxx"
npx convex env set STRIPE_MONTHLY_PRICE_ID "price_xxx"
npx convex env set STRIPE_YEARLY_PRICE_ID "price_xxx"
```

### 5. Stripe の設定

1. Stripe ダッシュボードで Product を作成
2. 月額 ¥900、年額 ¥8,000 の Price を作成
3. Webhook を設定 (`/stripe/webhook` エンドポイント)

### 6. 開発サーバーの起動

```bash
# WXT 開発サーバー
pnpm dev

# Convex 開発サーバー (別ターミナル)
npx convex dev
```

### 7. ビルド

```bash
pnpm build
```

ビルド成果物は `.output/chrome-mv3/` に出力されます。

## 使い方

### Chrome での使い方

1. Chrome で `chrome://extensions` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」から `.output/chrome-mv3/` を選択
4. 拡張機能アイコンをクリックしてログイン
5. サブスクリプションを購入
6. 任意のウェブページでテキストを選択
7. 表示されるカードで読み上げ or 翻訳

### Firefox での使い方

Firefox 用にビルドするには:

```bash
pnpm build:firefox
```

1. Firefox で `about:debugging` を開く
2. 「このFirefox」をクリック
3. 「一時的なアドオンを読み込む」をクリック
4. `.output/firefox-mv2/manifest.json` を選択
5. 拡張機能アイコンをクリックして**メールアドレス/パスワードでログイン**
6. サブスクリプションを購入
7. 任意のウェブページでテキストを選択
8. 表示されるカードで読み上げ or 翻訳

### Edge での使い方

Edge は Chrome と同じ Chromium ベースなので、Chrome 用のビルドがそのまま使えます:

1. Edge で `edge://extensions` を開く
2. 「開発者モード」を有効化
3. 「展開して読み込み」から `.output/chrome-mv3/` を選択
4. 拡張機能アイコンをクリックしてログイン
5. サブスクリプションを購入
6. 任意のウェブページでテキストを選択
7. 表示されるカードで読み上げ or 翻訳

### Safari での使い方

Safari 用には Xcode を使って変換が必要です:

```bash
# まず Chrome 用にビルド
pnpm build

# Safari Web Extension に変換 (macOS のみ)
xcrun safari-web-extension-converter .output/chrome-mv3/ --project-location ./safari-extension
```

1. Xcode でプロジェクトを開く
2. ビルドして実行
3. Safari の設定 > 拡張機能 で有効化
4. **メールアドレス/パスワードでログイン** (Safari では Google OAuth 非対応)
5. サブスクリプションを購入して使用

## 認証について

### Google OAuth (Chrome / Edge のみ)

`chrome.identity` API を使用しているため、**Google OAuth は Chrome と Edge でのみ利用可能**です。

### メール/パスワード認証 (全ブラウザ)

Firefox、Safari など `chrome.identity` API が使えないブラウザでは、**メール/パスワード認証**を使用してください。

1. ポップアップで「アカウント作成」をクリック
2. メールアドレスとパスワード (8文字以上) を入力
3. 「アカウント作成」ボタンをクリック
4. 次回以降は「ログイン」でサインイン

## ディレクトリ構造

```
hober/
├── entrypoints/
│   ├── popup/           # Popup UI
│   ├── content/         # Content Script (テキスト選択UI)
│   └── background.ts    # Background Service Worker
├── components/ui/       # UI コンポーネント
├── lib/                 # ユーティリティ
├── convex/              # Convex バックエンド
│   ├── schema.ts        # DBスキーマ
│   ├── auth.ts          # 認証設定
│   ├── http.ts          # HTTP Router
│   ├── tts.ts           # Eleven Labs API
│   ├── translate.ts     # Gemini API
│   ├── stripe.ts        # Stripe 決済
│   ├── users.ts         # ユーザー管理
│   └── subscriptions.ts # サブスクリプション管理
└── public/              # 静的アセット
```

## ライセンス

MIT
