'use client';

import { useState, useEffect, useRef } from 'react';
import { renderAsync } from 'docx-preview';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export default function DocumentPreview({ file, fileType }) {
  const [previewContent, setPreviewContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const wordPreviewRef = useRef(null);

  useEffect(() => {
    if (file) {
      loadPreview();
    }
  }, [file, currentPage]);

  const loadPreview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (fileType === 'word') {
        await loadWordPreview();
      } else if (fileType === 'pdf') {
        await loadPDFPreview();
      }
    } catch (err) {
      console.error('Error loading preview:', err);
      setError('Gagal memuat preview dokumen');
    } finally {
      setIsLoading(false);
    }
  };

  const loadWordPreview = async () => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      // Clear previous content
      if (wordPreviewRef.current) {
        wordPreviewRef.current.innerHTML = '';
      }

      // Use docx-preview for accurate Word rendering with all formatting preserved
      await renderAsync(arrayBuffer, wordPreviewRef.current, null, {
        className: 'docx-preview-content',
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false, // Preserve exact fonts
        breakPages: true, // Proper page breaks
        ignoreLastRenderedPageBreak: false,
        experimental: false,
        trimXmlDeclaration: true,
        useBase64URL: true, // For embedded images
        renderChanges: false,
        renderHeaders: true, // Render headers
        renderFooters: true, // Render footers
        renderFootnotes: true, // Render footnotes
        renderEndnotes: true, // Render endnotes
        renderComments: false, // Don't show comments in preview
        debug: false
      });

      setPreviewContent({ type: 'docx', rendered: true });
    } catch (err) {
      console.error('Error rendering Word document:', err);
      throw err;
    }
  };

  const loadPDFPreview = async () => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    setTotalPages(pdf.numPages);

    const page = await pdf.getPage(currentPage);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    const imageUrl = canvas.toDataURL();
    setPreviewContent({ type: 'image', content: imageUrl });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h4 className="font-semibold text-gray-900 dark:text-white">Preview Dokumen</h4>
        </div>

        {/* PDF Page Navigation */}
        {fileType === 'pdf' && totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[600px] overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-400">Memuat preview...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Word Preview Container - Always in DOM but styled conditionally */}
        {fileType === 'word' && (
          <>
            <style>
              {`
                /* Wrapper container - same as ConversionResult PDF preview */
                .docx-wrapper-container {
                  border: 1px solid #d1d5db;
                  border-radius: 0.5rem;
                  overflow: auto;
                  background: #f3f4f6;
                  padding: 1rem;
                  display: flex;
                  justify-content: center;
                }

                @media (prefers-color-scheme: dark) {
                  .docx-wrapper-container {
                    background: #1a1a1a;
                    border-color: #4b5563;
                  }
                }

                /* Content wrapper - center document like PDF preview */
                .docx-preview-content .docx-wrapper {
                  margin: 0 auto;
                  max-width: 100%;
                  display: flex;
                  justify-content: center;
                }

                /* Individual page - scale to fit container */
                .docx-preview-content section.docx {
                  background: white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  margin: 0 auto 20px auto;
                  max-width: 500px;
                  width: auto !important;
                }

                /* Preserve table formatting but constrain */
                .docx-preview-content table {
                  border-collapse: collapse;
                  max-width: 100%;
                }

                /* Ensure images are properly displayed */
                .docx-preview-content img {
                  max-width: 100%;
                  height: auto;
                }
              `}
            </style>
            <div
              className={(!isLoading && !error && previewContent?.type === 'docx') ? 'docx-wrapper-container' : ''}
              style={{
                display: (!isLoading && !error && previewContent?.type === 'docx') ? 'block' : 'none'
              }}
            >
              <div ref={wordPreviewRef} />
            </div>
          </>
        )}

        {/* PDF Preview */}
        {!isLoading && !error && previewContent?.type === 'image' && (
          <div className="flex justify-center">
            <img
              src={previewContent.content}
              alt={`Page ${currentPage}`}
              className="max-w-full h-auto shadow-lg rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
