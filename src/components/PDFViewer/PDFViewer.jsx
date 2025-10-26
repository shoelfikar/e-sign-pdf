'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import DraggableSignature from '@/src/components/DraggableSignature/DraggableSignature';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Konfigurasi worker untuk PDF.js
// Menggunakan unpkg dengan versi eksplisit
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export default function PDFViewer({ file, signatures = [], onSignatureUpdate, onSignatureDelete, onPageChange }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [fileUrl, setFileUrl] = useState(null);

  // Convert File object to URL
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      // Cleanup URL saat komponen unmount
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Gagal memuat dokumen PDF. Pastikan file valid.');
    setLoading(false);
  };

  const goToPreviousPage = () => {
    const newPage = Math.max(currentPage - 1, 1);
    setCurrentPage(newPage);
    if (onPageChange) onPageChange(newPage);
  };

  const goToNextPage = () => {
    const newPage = Math.min(currentPage + 1, numPages);
    setCurrentPage(newPage);
    if (onPageChange) onPageChange(newPage);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    if (onPageChange) onPageChange(1);
  };

  const goToLastPage = () => {
    setCurrentPage(numPages);
    if (onPageChange) onPageChange(numPages);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  if (!file) {
    return (
      <div className="text-center text-gray-500 py-12">
        Tidak ada file PDF yang dipilih
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* PDF Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Halaman pertama"
            title="Halaman pertama"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Halaman sebelumnya"
            title="Halaman sebelumnya"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium">
            {loading ? '...' : `${currentPage} / ${numPages}`}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === numPages || loading}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Halaman selanjutnya"
            title="Halaman selanjutnya"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={goToLastPage}
            disabled={currentPage === numPages || loading}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Halaman terakhir"
            title="Halaman terakhir"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5 || loading}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>

          <button
            onClick={resetZoom}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
            title="Reset zoom"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            onClick={zoomIn}
            disabled={scale >= 3.0 || loading}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* PDF Document Display */}
      <div className="flex justify-center bg-gray-100 p-6 rounded-lg border border-gray-200 overflow-auto">
        <div className="bg-white shadow-lg relative">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat dokumen PDF...</p>
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center p-12">
                <div className="text-center text-red-600">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Gagal memuat PDF</p>
                </div>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              }
            />
          </Document>

          {/* Signature Overlay Layer */}
          {signatures.length > 0 && !loading && (
            <div
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                zIndex: 10,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: `${100 / scale}%`,
                height: `${100 / scale}%`
              }}
            >
              <div className="relative w-full h-full">
                {signatures
                  .filter((sig) => sig.page === currentPage)
                  .map((sig) => (
                    <div key={sig.id} className="absolute inset-0 pointer-events-auto">
                      <DraggableSignature
                        signature={sig}
                        signatureId={sig.id}
                        onPositionChange={onSignatureUpdate}
                        onDelete={onSignatureDelete}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      {numPages && (
        <div className="text-center text-sm text-gray-600">
          <p>
            Menampilkan halaman {currentPage} dari {numPages} halaman
          </p>
        </div>
      )}
    </div>
  );
}
