'use client';

import { useState, useRef } from 'react';

export default function FileUploadConverter({ onFileUpload, acceptedFormats, conversionType, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFile = (file) => {
    // Validate file type
    const extension = file.name.split('.').pop().toLowerCase();
    if (!acceptedFormats.includes(extension)) {
      if (onError) {
        onError(`Format file tidak didukung. Harap upload file dengan format: ${acceptedFormats.join(', ')}`);
      }
      return;
    }

    onFileUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getFormatText = () => {
    if (conversionType === 'word-to-pdf') {
      return 'Word (.docx, .doc)';
    } else if (conversionType === 'pdf-to-word') {
      return 'PDF (.pdf)';
    }
    return acceptedFormats.join(', ');
  };

  const getIconSvg = () => {
    if (conversionType === 'word-to-pdf') {
      return (
        <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.map(f => `.${f}`).join(',')}
        onChange={handleFileInput}
        className="hidden"
        aria-label="File upload input"
      />

      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }
        `}
      >
        <div className="flex flex-col items-center">
          {getIconSvg()}

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Upload File {getFormatText()}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Drag & drop file di sini atau klik untuk memilih
          </p>

          <button
            type="button"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Pilih File
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Format yang didukung: {getFormatText()}
          </p>
        </div>
      </div>
    </div>
  );
}
