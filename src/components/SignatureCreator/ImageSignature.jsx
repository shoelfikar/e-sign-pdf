'use client';

import { useState, useRef } from 'react';

export default function ImageSignature({ onSignatureCreate, onClose }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Validasi tipe file
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('File harus berformat PNG atau JPG');
      return false;
    }

    // Validasi ukuran file (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError('Ukuran file maksimal 2MB');
      return false;
    }

    setError('');
    return true;
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
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

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      onSignatureCreate({
        type: 'image',
        data: previewUrl,
      });
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Cara Menggunakan</p>
            <p className="text-blue-700">
              Upload gambar tanda tangan Anda yang sudah ada. Pastikan background gambar transparan atau putih untuk hasil terbaik.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      {!previewUrl ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-12 cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="text-center">
            <svg
              className={`mx-auto h-12 w-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {isDragging ? 'Lepas file di sini' : 'Upload Gambar Tanda Tangan'}
            </h3>

            <p className="text-sm text-gray-600 mb-3">
              Drag & drop gambar di sini, atau klik untuk memilih file
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Format: PNG, JPG | Maksimal: 2MB</span>
            </div>
          </div>
        </div>
      ) : (
        /* Preview */
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview Tanda Tangan
          </label>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
            <img
              src={previewUrl}
              alt="Preview Tanda Tangan"
              className="max-h-48 max-w-full object-contain"
            />
          </div>
        </div>
      )}

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

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Tips</p>
            <ul className="text-yellow-700 space-y-1 list-disc list-inside">
              <li>Gunakan gambar dengan background putih atau transparan</li>
              <li>Pastikan tanda tangan terlihat jelas dan tidak buram</li>
              <li>Crop gambar agar hanya menampilkan tanda tangan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="sticky bottom-0 bg-white pt-4 pb-2 -mx-6 px-6 border-t border-gray-100 mt-6">
        <div className="flex flex-wrap gap-3">
          {previewUrl && (
            <button
              onClick={handleClear}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!previewUrl}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {!previewUrl ? 'Upload Gambar Dulu' : 'Gunakan Tanda Tangan'}
          </button>
        </div>
      </div>
    </div>
  );
}
