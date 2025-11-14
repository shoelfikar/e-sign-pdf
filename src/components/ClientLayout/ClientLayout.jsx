'use client';

import { ThemeProvider } from '@/src/context/ThemeContext';
import { AuthProvider } from '@/src/context/AuthContext';
import DarkModeToggle from '@/src/components/DarkModeToggle/DarkModeToggle';
import UserMenu from '@/src/components/UserMenu/UserMenu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  return (
    <ThemeProvider>
      <AuthProvider>
        <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">E-Sign PDF</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tanda Tangan Digital untuk Dokumen PDF</p>
              </div>
              <div className="flex items-center gap-4">
                <DarkModeToggle />
                <UserMenu />
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <ul className="flex gap-6">
                <li>
                  <Link
                    href="/"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      pathname === '/'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    E-Sign PDF
                  </Link>
                </li>
                <li>
                  <Link
                    href="/convert"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      pathname === '/convert'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Konversi Word/PDF
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} E-Sign PDF. Semua dokumen diproses di browser Anda untuk privasi maksimal.
            </p>
          </div>
        </footer>
      </AuthProvider>
    </ThemeProvider>
  );
}
