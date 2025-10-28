'use client';

import { ThemeProvider } from '@/src/context/ThemeContext';
import { AuthProvider } from '@/src/context/AuthContext';
import DarkModeToggle from '@/src/components/DarkModeToggle/DarkModeToggle';
import UserMenu from '@/src/components/UserMenu/UserMenu';

export default function ClientLayout({ children }) {
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
