import { Inter, Noto_Nastaliq_Urdu, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-nastaliq',
});
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-arabic',
});

export const metadata = {
  title: 'Dargah of Hazrat Shah Deewano Sultan',
  description: 'Official website of Dargah of Hazrat Shah Deewano Sultan - A Sacred Place of Spiritual Enlightenment',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${notoNastaliq.variable} ${notoSansArabic.variable} font-sans`}>{children}</body>
    </html>
  );
}