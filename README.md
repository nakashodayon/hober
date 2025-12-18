# Hober

ブラウザ上で選択したテキストを TTS 読み上げ・翻訳できるブラウザ拡張機能

## 機能

- **TTS 読み上げ**: Eleven Labs API を使用した高品質な音声読み上げ
- **翻訳**: Google Gemini API を使用した AI 翻訳
- **認証**: Google OAuth またはメール/パスワードによるログイン

## 技術スタック

- **拡張機能**: WXT + React + TypeScript
- **UI**: Base UI + Tailwind CSS
- **バックエンド**: Convex
- **認証**: Google OAuth (chrome.identity API) + メール/パスワード
- **TTS**: Eleven Labs API
- **翻訳**: Google Gemini API

## セットアップ

### 必要条件

- Node.js 18+
- pnpm

### 1. リポジトリのクローン

```bash
git clone https://github.com/nakashodayon/hober.git
cd hober
```

### 2. 依存パッケージのインストール

```bash
pnpm install
```

### 3. 環境変数の設定

`.env.example` を `.env` にコピー:

```bash
cp .env.example .env
```

`.env` ファイルを編集して `VITE_CONVEX_URL` を設定します（次のステップで取得）。

### 4. Convex のセットアップ

新しい Convex プロジェクトを作成:

```bash
npx convex dev --once --configure=new
```

実行後に表示される URL を `.env` の `VITE_CONVEX_URL` に設定してください。

### 5. Convex 環境変数の設定

Convex ダッシュボードまたはコマンドラインで以下の環境変数を設定:

```bash
# Eleven Labs API キー (https://elevenlabs.io/api)
npx convex env set ELEVENLABS_API_KEY "your-elevenlabs-api-key"

# Google Gemini API キー (https://aistudio.google.com/apikey)
npx convex env set GEMINI_API_KEY "your-gemini-api-key"
```

### 6. 開発サーバーの起動

ターミナル 1: Convex 開発サーバー

```bash
npx convex dev
```

ターミナル 2: WXT 開発サーバー

```bash
pnpm dev
```

### 7. Chrome に拡張機能を読み込む

1. Chrome で `chrome://extensions` を開く
2. 「デベロッパーモード」を有効化（右上のトグル）
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `.output/chrome-mv3-dev` フォルダを選択

## ビルド

### Chrome 用

```bash
pnpm build
```

成果物: `.output/chrome-mv3/`

### Firefox 用

```bash
pnpm build:firefox
```

成果物: `.output/firefox-mv2/`

## 使い方

1. 拡張機能アイコンをクリックしてログイン（Google または メール/パスワード）
2. 任意のウェブページでテキストを選択
3. 表示されるカードで読み上げ or 翻訳

## ブラウザ別の注意事項

### Chrome / Edge

- Google OAuth が利用可能
- メール/パスワード認証も利用可能

### Firefox

```bash
pnpm build:firefox
```

1. `about:debugging` を開く
2. 「このFirefox」→「一時的なアドオンを読み込む」
3. `.output/firefox-mv2/manifest.json` を選択
4. **メール/パスワード認証のみ対応**（`chrome.identity` API 非対応のため）

### Safari

```bash
# Chrome 用にビルド
pnpm build

# Safari Web Extension に変換 (macOS + Xcode 必要)
xcrun safari-web-extension-converter .output/chrome-mv3/ --project-location ./safari-extension
```

- **メール/パスワード認証のみ対応**

## ディレクトリ構造

```
hober/
├── entrypoints/
│   ├── background.ts        # Background Service Worker
│   ├── content/             # Content Script (テキスト選択 UI)
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── icons/
│   └── popup/               # Popup UI
│       ├── App.tsx
│       └── components/
├── components/ui/           # UI コンポーネント (Base UI)
├── lib/                     # ユーティリティ
│   ├── convex.ts            # Convex クライアント
│   ├── messaging.ts         # 拡張機能メッセージング
│   ├── storage.ts           # ストレージ管理
│   └── utils.ts             # ヘルパー関数
├── convex/                  # Convex バックエンド
│   ├── schema.ts            # DB スキーマ
│   ├── auth.ts              # 認証 (Google OAuth + Email/Password)
│   ├── tts.ts               # Eleven Labs API
│   ├── translate.ts         # Gemini API
│   └── users.ts             # ユーザー管理
├── public/                  # 静的アセット (アイコン等)
├── wxt.config.ts            # WXT 設定
└── package.json
```

## API キーの取得方法

### Eleven Labs

1. https://elevenlabs.io にアクセス
2. アカウント作成・ログイン
3. Profile → API Keys から API キーを取得

### Google Gemini

1. https://aistudio.google.com/apikey にアクセス
2. Google アカウントでログイン
3. 「Create API Key」をクリック

## ライセンス

MIT
