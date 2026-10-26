import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SentinelGuard — Smart Residence Security & LPR Parking Control',
  description: 'Mission-critical automated visitor passes, optical license plate recognition, and real-time smart parking allocation.',
  manifest: '/SentinelGuard/manifest.json', // basePath from next.config.ts; metadata URLs aren't prefixed automatically
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SentinelGuard',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0F172A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-900 text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
