'use client';

import { useState } from 'react';
import FileUploadConverter from '@/src/components/FileUploadConverter/FileUploadConverter';
import ConversionPreview from '@/src/components/ConversionPreview/ConversionPreview';
import ConversionResult from '@/src/components/ConversionResult/ConversionResult';
import ProtectedRoute from '@/src/components/ProtectedRoute/ProtectedRoute';
import Toast from '@/src/components/Toast/Toast';
import {
  convertWordToPDF,
  convertPDFToWord,
  downloadBlob,
} from '@/src/utils/conversionUtils';

export default function ConvertPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionType, setConversionType] = useState('word-to-pdf'); // 'word-to-pdf' or 'pdf-to-word'
  const [isConverting, setIsConverting] = useState(false);
  const [toast, setToast] = useState(null);
  const [conversionResult, setConversionResult] = useState(null); // { blob, filename }

  const handleFileUpload = (file) => {
    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setConversionResult(null);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      showToast('Silakan pilih file terlebih dahulu', 'warning');
      return;
    }

    setIsConverting(true);

    try {
      let blob;
      let outputFilename;
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');

      if (conversionType === 'word-to-pdf') {
        blob = await convertWordToPDF(selectedFile);
        outputFilename = `${baseName}.pdf`;
      } else {
        blob = await convertPDFToWord(selectedFile);
        outputFilename = `${baseName}.docx`;
      }

      // Store the result instead of auto-download
      setConversionResult({
        blob,
        filename: outputFilename
      });

      // Show success message
      showToast('Konversi berhasil! Silakan preview dan download file Anda.', 'success');

      // Clear the selected file
      setSelectedFile(null);
    } catch (error) {
      console.error('Conversion error:', error);
      showToast(error.message || 'Terjadi kesalahan saat konversi. Silakan coba lagi.', 'error');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadResult = () => {
    if (conversionResult) {
      downloadBlob(conversionResult.blob, conversionResult.filename);
      showToast('File berhasil didownload!', 'success');
    }
  };

  const getAcceptedFormats = () => {
    if (conversionType === 'word-to-pdf') {
      return ['docx', 'doc'];
    } else {
      return ['pdf'];
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Konversi Dokumen Word & PDF
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Konversi file Word ke PDF atau PDF ke Word dengan mudah dan aman.
            Semua proses dilakukan di browser Anda.
          </p>
        </section>

        {/* Conversion Type Selector */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-800">
            <button
              onClick={() => {
                setConversionType('word-to-pdf');
                setSelectedFile(null);
                setConversionResult(null);
              }}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all
                ${
                  conversionType === 'word-to-pdf'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Word ke PDF
              </div>
            </button>
            <button
              onClick={() => {
                setConversionType('pdf-to-word');
                setSelectedFile(null);
                setConversionResult(null);
              }}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all
                ${
                  conversionType === 'pdf-to-word'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF ke Word
              </div>
            </button>
          </div>
        </div>

        {/* Upload, Preview, or Result Section */}
        {conversionResult ? (
          <section aria-label="Conversion Result">
            <ConversionResult
              resultBlob={conversionResult.blob}
              resultFileName={conversionResult.filename}
              conversionType={conversionType}
              onDownload={handleDownloadResult}
              onReset={handleReset}
            />
          </section>
        ) : !selectedFile ? (
          <section aria-label="Upload Document">
            <FileUploadConverter
              onFileUpload={handleFileUpload}
              acceptedFormats={getAcceptedFormats()}
              conversionType={conversionType}
              onError={(message) => showToast(message, 'error')}
            />
          </section>
        ) : (
          <section aria-label="Convert Document">
            <ConversionPreview
              file={selectedFile}
              fileName={selectedFile.name}
              fileSize={selectedFile.size}
              conversionType={conversionType}
              onConvert={handleConvert}
              onClear={handleClearFile}
              isConverting={isConverting}
            />
          </section>
        )}

        {/* Features Section */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Fitur Konversi
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Cepat & Mudah</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Konversi dokumen Anda dalam hitungan detik dengan antarmuka yang sederhana dan intuitif.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">100% Aman</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Semua konversi dilakukan di browser Anda. File tidak pernah diupload ke server manapun.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Gratis Selamanya</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Gunakan fitur konversi kami tanpa batasan. Tidak ada biaya tersembunyi atau langganan.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12" aria-label="FAQ">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Pertanyaan Umum
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4 transition-colors">
            <details className="group border-b border-gray-100 dark:border-gray-700 pb-4">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center gap-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Apakah konversi mempertahankan format dokumen?</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 ml-8 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Ya! Konversi Word ke PDF akan mempertahankan format seperti <strong>bold</strong>, <em>italic</em>,
                underline, heading, bullet list, tabel, dan warna teks. Konversi menggunakan teknologi yang
                menjaga struktur dan styling dokumen asli sebisa mungkin.
              </p>
            </details>

            <details className="group border-b border-gray-100 dark:border-gray-700 pb-4">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center gap-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Berapa ukuran maksimal file?</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 ml-8 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Untuk performa optimal, disarankan file maksimal 10MB. File yang lebih besar mungkin
                memerlukan waktu proses lebih lama tergantung spesifikasi perangkat Anda.
              </p>
            </details>

            <details className="group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center gap-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span>Apakah gambar dalam dokumen akan dikonversi?</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 ml-8 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Ya, gambar dalam dokumen Word akan dikonversi ke PDF. Namun, saat konversi dari PDF ke Word,
                gambar akan diextract dan disisipkan kembali ke dokumen Word.
              </p>
            </details>
          </div>
        </section>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </ProtectedRoute>
  );
}
