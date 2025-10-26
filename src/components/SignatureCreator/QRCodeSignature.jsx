'use client';

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRCodeSignature({ onSignatureCreate, onClose }) {
  const [text, setText] = useState('');
  const [size, setSize] = useState(200);
  const [level, setLevel] = useState('M');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('transparent');
  const canvasRef = useRef(null);

  const errorLevels = [
    { value: 'L', label: 'Low (7%)', description: 'Cocok untuk QR code sederhana' },
    { value: 'M', label: 'Medium (15%)', description: 'Recommended untuk umum' },
    { value: 'Q', label: 'Quartile (25%)', description: 'Lebih tahan terhadap kerusakan' },
    { value: 'H', label: 'High (30%)', description: 'Maksimal error correction' },
  ];

  const generateQRCodeImage = () => {
    if (!text.trim()) return null;

    // Get the canvas element from QRCodeCanvas
    const canvas = document.querySelector('#qrcode-preview canvas');
    if (!canvas) return null;

    return canvas.toDataURL('image/png');
  };

  const handleSave = () => {
    const qrcodeData = generateQRCodeImage();
    if (qrcodeData) {
      onSignatureCreate({
        type: 'qrcode',
        data: qrcodeData,
        text: text,
        size: size,
        level: level,
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
              Masukkan informasi untuk membuat QR Code. Bisa berupa URL, teks, nomor identitas, atau data lainnya.
              QR Code dapat dipindai menggunakan smartphone.
            </p>
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Konten QR Code
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Contoh: https://example.com atau teks lainnya"
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-2">
          Maksimal 500 karakter • {text.length} karakter
        </p>
      </div>

      {/* Quick Templates */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Template Cepat
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setText('https://example.com')}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-left"
          >
            🌐 Website URL
          </button>
          <button
            onClick={() => setText('mailto:email@example.com')}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-left"
          >
            📧 Email
          </button>
          <button
            onClick={() => setText('tel:+1234567890')}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-left"
          >
            📞 Phone
          </button>
          <button
            onClick={() => setText('Signed by: [Your Name]')}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-left"
          >
            ✍️ Signature Info
          </button>
        </div>
      </div>

      {/* QR Code Settings */}
      <div className="grid grid-cols-2 gap-4">
        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ukuran QR Code
          </label>
          <input
            type="range"
            min="100"
            max="300"
            step="10"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{size}x{size}px</span>
        </div>

        {/* Error Correction Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Error Correction
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm"
          >
            {errorLevels.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>
                {lvl.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {errorLevels.find(l => l.value === level)?.description}
          </p>
        </div>
      </div>

      {/* Color Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Warna QR Code
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-mono"
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Warna Background
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-mono"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </div>

      {/* Include Margin Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="includeMargin"
          checked={includeMargin}
          onChange={(e) => setIncludeMargin(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="includeMargin" className="text-sm font-medium text-gray-700">
          Tambahkan margin putih di sekitar QR Code
        </label>
      </div>

      {/* Preview */}
      {text && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview QR Code
          </label>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 flex items-center justify-center">
            <div id="qrcode-preview">
              <QRCodeCanvas
                value={text}
                size={size}
                level={level}
                includeMargin={includeMargin}
                fgColor={fgColor}
                bgColor={bgColor}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Scan QR Code ini dengan smartphone untuk test
          </p>
        </div>
      )}

      {/* Info Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Tips untuk QR Code yang Baik</p>
            <ul className="text-yellow-700 space-y-1 list-disc list-inside text-xs">
              <li>Gunakan kontras tinggi (hitam-putih) untuk scan optimal</li>
              <li>Error correction "M" atau "Q" recommended untuk dokumen</li>
              <li>Ukuran minimal 150x150px untuk readability</li>
              <li>Test scan QR Code sebelum print dokumen</li>
            </ul>
          </div>
        </div>
      </div>

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
            disabled={!text.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {!text.trim() ? 'Masukkan Konten QR Code' : 'Gunakan QR Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
