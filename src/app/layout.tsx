import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./SiteHeader";
import { ThemeProvider } from "./ThemeContext";

export const metadata: Metadata = {
    title: "Quin's Universe",
    description: "A Beginner's Guide to Quin's Universe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            {/* FIX: This global reset stops padding from pushing elements off the screen */}
            <style>{`
          *, *::before, *::after {
            box-sizing: border-box;
          }
          body {
            overflow-x: hidden; /* Prevents horizontal scrolling at the window level */
          }
        `}</style>
        </head>
        <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ThemeProvider>
            <SiteHeader />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
            </main>
        </ThemeProvider>
        </body>
        </html>
    );
}