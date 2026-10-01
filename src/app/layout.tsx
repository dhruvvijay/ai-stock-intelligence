import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockAI - AI-Powered Stock Intelligence Platform",
  description: "Intelligent stock research and recommendation platform powered by AI. Analyze stocks, track portfolios, learn technical analysis, and receive AI-powered insights.",
  keywords: ["stock market", "AI", "trading", "portfolio", "NSE", "BSE", "mutual funds", "SIP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg-primary font-sans text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
