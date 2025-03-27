# 思い出アプリ (My History)

高齢者向けに設計された思い出を記録するためのWebアプリケーションです。

## 機能

- 写真を選択して思い出を記録
- 4つの質問で思い出を簡単に記録
  - 場所（選択式）
  - 人物（選択式）
  - 出来事（選択式）
  - 感想（音声入力）
- 思い出せない場合はスキップ可能
- タイムライン形式で思い出を表示
- 高齢者向けに最適化されたUI/UX

## 技術スタック

- Next.js 14
- TypeScript
- Tailwind CSS
- Web Speech API（音声入力用）

## 開発環境のセットアップ

1. リポジトリをクローン
```bash
git clone [repository-url]
cd my_history2
```

2. 依存関係のインストール
```bash
npm install
```

3. 開発サーバーの起動
```bash
npm run dev
```

4. ブラウザで http://localhost:3004 にアクセス

## ライセンス

MIT

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
