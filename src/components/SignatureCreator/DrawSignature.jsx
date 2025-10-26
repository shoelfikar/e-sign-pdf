'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function DrawSignature({ onSignatureCreate, onClose }) {
  const sigCanvas = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [penColor, setPenColor] = useState('#000000');

  const handleClear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (sigCanvas.current && !isEmpty) {
      // Get the canvas and trim it to remove empty space
      const canvas = sigCanvas.current.getCanvas();
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Find the bounds of the signature
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 0) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // Add padding
      const padding = 20;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);

      // Create new canvas with trimmed content
      const trimmedCanvas = document.createElement('canvas');
      const trimmedWidth = maxX - minX;
      const trimmedHeight = maxY - minY;
      trimmedCanvas.width = trimmedWidth;
      trimmedCanvas.height = trimmedHeight;

      const trimmedCtx = trimmedCanvas.getContext('2d');
      // Don't fill with white - keep transparent background
      trimmedCtx.drawImage(
        canvas,
        minX, minY, trimmedWidth, trimmedHeight,
        0, 0, trimmedWidth, trimmedHeight
      );

      const signatureData = trimmedCanvas.toDataURL('image/png');
      onSignatureCreate({
        type: 'draw',
        data: signatureData,
      });
      onClose();
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  const colors = [
    { value: '#000000', label: 'Hitam' },
    { value: '#0000FF', label: 'Biru' },
    { value: '#000080', label: 'Biru Tua' },
  ];

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
              Gunakan mouse atau touchpad untuk menggambar tanda tangan Anda di area canvas di bawah.
              Anda bisa memilih warna dan menghapus jika perlu.
            </p>
          </div>
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Warna Tanda Tangan
        </label>
        <div className="flex gap-3">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setPenColor(color.value)}
              className={`
                px-4 py-2 rounded-md border-2 transition-all
                ${penColor === color.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-sm font-medium">{color.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Area Tanda Tangan
        </label>
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: 'w-full h-64 cursor-crosshair',
            }}
            backgroundColor="white"
            penColor={penColor}
            onBegin={handleBegin}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Gambar tanda tangan Anda di area putih di atas
        </p>
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="sticky bottom-0 bg-white pt-4 pb-2 -mx-6 px-6 border-t border-gray-100 mt-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleClear}
            disabled={isEmpty}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isEmpty}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isEmpty ? 'Gambar Tanda Tangan Dulu' : 'Gunakan Tanda Tangan'}
          </button>
        </div>
      </div>
    </div>
  );
}
