'use client';

import { useState, useRef } from 'react';
import Barcode from 'react-barcode';

export default function BarcodeSignature({ onSignatureCreate, onClose }) {
  const [text, setText] = useState('');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(50);
  const [displayValue, setDisplayValue] = useState(true);
  const canvasRef = useRef(null);

  const formats = [
    { value: 'CODE128', label: 'CODE128 (Alphanumeric)' },
    { value: 'CODE39', label: 'CODE39' },
    { value: 'EAN13', label: 'EAN-13 (13 digits)' },
    { value: 'EAN8', label: 'EAN-8 (8 digits)' },
    { value: 'UPC', label: 'UPC (12 digits)' },
    { value: 'ITF14', label: 'ITF-14 (14 digits)' },
  ];

  const generateBarcodeImage = () => {
    if (!text.trim()) return null;

    // Get the SVG element from react-barcode
    const svg = document.querySelector('#barcode-preview svg');
    if (!svg) return null;

    // Convert SVG to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = url;
    });
  };

  const handleSave = async () => {
    const barcodeData = await generateBarcodeImage();
    if (barcodeData) {
      onSignatureCreate({
        type: 'barcode',
        data: barcodeData,
        text: text,
        format: format,
      });
      onClose();
    }
  };

  const isValidInput = () => {
    if (!text.trim()) return false;

    // Validate based on format
    switch (format) {
      case 'EAN13':
        return /^\d{13}$/.test(text);
      case 'EAN8':
        return /^\d{8}$/.test(text);
      case 'UPC':
        return /^\d{12}$/.test(text);
      case 'ITF14':
        return /^\d{14}$/.test(text);
      case 'CODE39':
        return /^[0-9A-Z\-. $/+%]*$/.test(text);
      case 'CODE128':
        return text.length > 0;
      default:
        return text.length > 0;
    }
  };

  const getFormatHint = () => {
    switch (format) {
      case 'EAN13':
        return 'Masukkan 13 digit angka';
      case 'EAN8':
        return 'Masukkan 8 digit angka';
      case 'UPC':
        return 'Masukkan 12 digit angka';
      case 'ITF14':
        return 'Masukkan 14 digit angka';
      case 'CODE39':
        return 'Huruf kapital, angka, dan karakter khusus (-.$/+%)';
      case 'CODE128':
        return 'Semua karakter ASCII';
      default:
        return '';
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
              Masukkan teks atau nomor untuk membuat barcode. Pilih format barcode yang sesuai dengan kebutuhan Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Format Barcode
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        >
          {formats.map((fmt) => (
            <option key={fmt.value} value={fmt.value}>
              {fmt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teks / Nomor Barcode
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={getFormatHint()}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono"
          maxLength={format === 'CODE128' ? 100 : 14}
        />
        <p className="text-xs text-gray-500 mt-2">
          {getFormatHint()}
        </p>
      </div>

      {/* Barcode Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lebar Garis
          </label>
          <input
            type="range"
            min="1"
            max="4"
            step="0.5"
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{width}px</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tinggi Barcode
          </label>
          <input
            type="range"
            min="30"
            max="100"
            step="10"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{height}px</span>
        </div>
      </div>

      {/* Display Value Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="displayValue"
          checked={displayValue}
          onChange={(e) => setDisplayValue(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="displayValue" className="text-sm font-medium text-gray-700">
          Tampilkan teks di bawah barcode
        </label>
      </div>

      {/* Preview */}
      {text && isValidInput() && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview Barcode
          </label>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 flex items-center justify-center min-h-[150px]">
            <div id="barcode-preview">
              <Barcode
                value={text}
                format={format}
                width={width}
                height={height}
                displayValue={displayValue}
                background="#ffffff"
                lineColor="#000000"
              />
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {text && !isValidInput() && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 font-medium">
              Format input tidak sesuai dengan format barcode yang dipilih
            </p>
          </div>
        </div>
      )}

      {/* Actions - Fixed at bottom */}
      <div className="sticky bottom-0 bg-white pt-4 pb-2 -mx-6 px-6 border-t border-gray-100 mt-6">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!isValidInput()}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {!isValidInput() ? 'Masukkan Data Valid' : 'Gunakan Barcode'}
          </button>
        </div>
      </div>
    </div>
  );
}
