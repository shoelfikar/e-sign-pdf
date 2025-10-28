'use client';

import { useState } from 'react';
import FileUpload from '@/src/components/FileUpload/FileUpload';
import PDFViewer from '@/src/components/PDFViewer/PDFViewer';
import SignatureCreator from '@/src/components/SignatureCreator/SignatureCreator';
import ProtectedRoute from '@/src/components/ProtectedRoute/ProtectedRoute';
import { generateSignedPDF } from '@/src/utils/pdfUtils';

export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatures, setSignatures] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileUpload = (file) => {
    setPdfFile(file);
  };

  const handleClearPDF = () => {
    setPdfFile(null);
    setSignatures([]);
  };

  const handleOpenSignatureModal = () => {
    setShowSignatureModal(true);
  };

  const handleCloseSignatureModal = () => {
    setShowSignatureModal(false);
  };

  const handleSignatureCreate = (signature) => {
    // Add signature to array with unique ID, default position, and current page
    const newSignature = {
      id: Date.now().toString(),
      ...signature,
      page: currentPage, // Use current page from PDFViewer
      position: { x: 50, y: 50 },
      width: 200,
      height: 100,
    };
    setSignatures([...signatures, newSignature]);
    console.log('Signature created:', newSignature);
  };

  const handleSignatureUpdate = (id, position, size) => {
    setSignatures((prev) =>
      prev.map((sig) =>
        sig.id === id ? { ...sig, position, width: size.width, height: size.height } : sig
      )
    );
  };

  const handleSignatureDelete = (id) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id));
  };

  const handleDownloadPDF = async () => {
    if (!pdfFile || signatures.length === 0) {
      alert('Silakan tambahkan minimal satu tanda tangan sebelum download');
      return;
    }

    setIsDownloading(true);
    try {
      const originalFilename = pdfFile.name.replace('.pdf', '');
      const filename = `${originalFilename}-signed.pdf`;

      const success = await generateSignedPDF(pdfFile, signatures, filename);

      if (success) {
        // Optional: Show success message
        console.log('PDF downloaded successfully');
      } else {
        alert('Gagal membuat PDF. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
      {/* SEO-friendly structured content */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Upload & Tandatangani Dokumen PDF Anda
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Upload file PDF, tambahkan tanda tangan digital, dan download hasilnya.
          Semua proses dilakukan di browser Anda untuk menjaga privasi dokumen.
        </p>
      </section>

      {/* Upload or Display Section */}
      {!pdfFile ? (
        <section aria-label="Upload PDF">
          <FileUpload onFileUpload={handleFileUpload} />

          {/* SEO-friendly content about features */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-colors">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Upload PDF</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Upload dokumen PDF Anda dengan mudah melalui drag & drop atau klik untuk memilih file.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-colors">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Tanda Tangan Digital</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Buat tanda tangan dengan menggambar, ketik teks, atau upload gambar tanda tangan Anda.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-colors">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Aman & Private</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Semua proses dilakukan di browser Anda. Dokumen tidak pernah diupload ke server.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section aria-label="View and Sign PDF">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Preview Dokumen PDF
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={handleOpenSignatureModal}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center gap-2"
                  aria-label="Buat tanda tangan"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Buat Tanda Tangan
                </button>
                <button
                  onClick={handleClearPDF}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                  aria-label="Upload dokumen baru"
                >
                  Upload Dokumen Baru
                </button>
              </div>
            </div>

            {/* Display signatures info */}
            {signatures.length > 0 && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        {signatures.length} Tanda Tangan Ditambahkan
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Geser tanda tangan di PDF untuk memposisikannya
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleOpenSignatureModal}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      + Tambah Lagi
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2 shadow-lg"
                    >
                      {isDownloading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <PDFViewer
              file={pdfFile}
              signatures={signatures}
              onSignatureUpdate={handleSignatureUpdate}
              onSignatureDelete={handleSignatureDelete}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      )}

      {/* Signature Creator Modal */}
      {showSignatureModal && (
        <SignatureCreator
          onSignatureCreate={handleSignatureCreate}
          onClose={handleCloseSignatureModal}
        />
      )}

      {/* SEO-friendly FAQ section */}
      <section className="mt-12" aria-label="Frequently Asked Questions">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Pertanyaan Umum
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4 transition-colors">
          <details className="group border-b border-gray-100 dark:border-gray-700 pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center gap-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Apakah dokumen saya aman?</span>
              </div>
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 ml-8 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Ya, semua proses dilakukan sepenuhnya di browser Anda. Dokumen PDF tidak pernah
              diupload ke server kami, sehingga privasi dan keamanan dokumen Anda terjaga.
            </p>
          </details>
          <details className="group border-b border-gray-100 dark:border-gray-700 pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center gap-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Format file apa yang didukung?</span>
              </div>
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 ml-8 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Saat ini kami mendukung file PDF (.pdf). Pastikan file Anda dalam format PDF
              untuk dapat ditandatangani menggunakan aplikasi ini.
            </p>
          </details>
          <details className="group">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center gap-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span>Berapa ukuran maksimal file yang bisa diupload?</span>
              </div>
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 ml-8 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Ukuran maksimal file yang direkomendasikan adalah 10MB untuk performa terbaik.
              File yang lebih besar mungkin memerlukan waktu loading lebih lama.
            </p>
          </details>
        </div>
      </section>
      </div>
    </ProtectedRoute>
  );
}
