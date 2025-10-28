import './globals.css';
import ClientLayout from '@/src/components/ClientLayout/ClientLayout';

export const metadata = {
  title: 'E-Sign PDF - Tanda Tangan Digital untuk Dokumen PDF',
  description: 'Aplikasi web untuk menambahkan tanda tangan digital pada file PDF secara online. Gratis, aman, dan mudah digunakan. Upload PDF, buat tanda tangan, dan download hasilnya.',
  keywords: ['e-sign', 'tanda tangan digital', 'pdf signature', 'sign pdf online', 'tanda tangan pdf', 'digital signature'],
  authors: [{ name: 'E-Sign PDF' }],
  openGraph: {
    title: 'E-Sign PDF - Tanda Tangan Digital untuk Dokumen PDF',
    description: 'Aplikasi web untuk menambahkan tanda tangan digital pada file PDF secara online',
    type: 'website',
    locale: 'id_ID',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
