import './globals.css';

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
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">E-Sign PDF</h1>
            <p className="text-sm text-gray-600">Tanda Tangan Digital untuk Dokumen PDF</p>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} E-Sign PDF. Semua dokumen diproses di browser Anda untuk privasi maksimal.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
