'use client';

import { useState, useRef } from 'react';

export default function FileUpload({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Validasi tipe file
    if (file.type !== 'application/pdf') {
      setError('File harus berformat PDF');
      return false;
    }

    // Validasi ukuran file (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('Ukuran file maksimal 10MB');
      return false;
    }

    setError('');
    return true;
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      onFileUpload(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-12
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
          }
        `}
        role="button"
        tabIndex={0}
        aria-label="Upload file PDF dengan drag and drop atau klik untuk memilih"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          className="hidden"
          aria-label="Input file PDF"
        />

        <div className="text-center">
          {/* Upload Icon */}
          <svg
            className={`mx-auto h-16 w-16 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isDragging ? 'Lepas file di sini' : 'Upload File PDF'}
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Drag & drop file PDF Anda di sini, atau klik untuk memilih file
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>Format: PDF | Maksimal: 10MB</span>
          </div>
        </div>

        {/* Loading indicator bisa ditambahkan di sini */}
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
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

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Privasi & Keamanan</p>
            <p className="text-blue-700">
              File Anda diproses sepenuhnya di browser. Tidak ada data yang dikirim ke server,
              sehingga dokumen Anda tetap aman dan privat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
