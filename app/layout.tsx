import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instant Matching — Toptal",
  description: "AI-powered hiring workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        {/* Settings gear — fixed top-right, always visible */}
        <Link
          href="/settings"
          aria-label="Settings"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 100,
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(6px)",
            border: "1px solid #EBECED",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9EA8B3",
            textDecoration: "none",
            transition: "color 0.15s ease, background 0.15s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M13.3 9.6a1 1 0 0 0 .2 1.1l.04.04a1.2 1.2 0 0 1-1.7 1.7l-.04-.04a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.92V13a1.2 1.2 0 0 1-2.4 0v-.06A1 1 0 0 0 7 12a1 1 0 0 0-1.1.2l-.04.04a1.2 1.2 0 0 1-1.7-1.7l.04-.04A1 1 0 0 0 4.4 9.4a1 1 0 0 0-.92-.6H3a1.2 1.2 0 0 1 0-2.4h.06A1 1 0 0 0 4 5.7a1 1 0 0 0-.2-1.1l-.04-.04a1.2 1.2 0 0 1 1.7-1.7l.04.04A1 1 0 0 0 6.6 3.1a1 1 0 0 0 .6-.92V2a1.2 1.2 0 0 1 2.4 0v.06a1 1 0 0 0 .6.92 1 1 0 0 0 1.1-.2l.04-.04a1.2 1.2 0 0 1 1.7 1.7l-.04.04A1 1 0 0 0 12.6 5.7a1 1 0 0 0 .92.6H13a1.2 1.2 0 0 1 0 2.4h-.06a1 1 0 0 0-.64.9Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </body>
    </html>
  );
}
