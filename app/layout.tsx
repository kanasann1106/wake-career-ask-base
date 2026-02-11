import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ask Base - 社内質問受付アプリ",
  description: "社内向け質問受付アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
