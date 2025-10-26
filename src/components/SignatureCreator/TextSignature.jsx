'use client';

import { useState, useRef, useEffect } from 'react';

export default function TextSignature({ onSignatureCreate, onClose }) {
  const [text, setText] = useState('');
  const [selectedFont, setSelectedFont] = useState('signature-1');
  const canvasRef = useRef(null);

  const fonts = [
    { id: 'signature-1', name: 'Dancing Script', style: 'font-dancing' },
    { id: 'signature-2', name: 'Great Vibes', style: 'font-vibes' },
    { id: 'signature-3', name: 'Allura', style: 'font-allura' },
    { id: 'signature-4', name: 'Pacifico', style: 'font-pacifico' },
  ];

  const generateSignature = () => {
    if (!text.trim()) return null;

    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 600;
    canvas.height = 200;

    // Clear canvas (keeps transparent background)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Don't fill background - keep transparent

    // Set font style based on selection
    const fontSize = 72;
    const fontFamily = fonts.find(f => f.id === selectedFont)?.name || 'Dancing Script';
    ctx.font = `${fontSize}px "${fontFamily}", cursive`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  };

  const handleSave = () => {
    const signatureData = generateSignature();
    if (signatureData) {
      onSignatureCreate({
        type: 'text',
        data: signatureData,
        text: text,
        font: selectedFont,
      });
      onClose();
    }
  };

  // Update preview when text or font changes
  useEffect(() => {
    generateSignature();
  }, [text, selectedFont]);

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
              Ketik nama Anda, lalu pilih gaya font yang diinginkan. Tanda tangan akan otomatis dibuat dengan font signature yang indah.
            </p>
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ketik Nama Anda
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Contoh: John Doe"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          maxLength={50}
        />
        <p className="text-xs text-gray-500 mt-2">
          Maksimal 50 karakter
        </p>
      </div>

      {/* Font Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Pilih Gaya Font
        </label>
        <div className="grid grid-cols-1 gap-3">
          {fonts.map((font) => (
            <button
              key={font.id}
              onClick={() => setSelectedFont(font.id)}
              className={`
                p-4 text-left rounded-lg border-2 transition-all
                ${selectedFont === font.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className={`text-3xl ${font.style}`}>
                  {text || 'Your Name'}
                </span>
                {selectedFont === font.id && (
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{font.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Hidden Canvas for Generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview */}
      {text && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview Tanda Tangan
          </label>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 flex items-center justify-center min-h-[150px]">
            <span className={`text-5xl ${fonts.find(f => f.id === selectedFont)?.style}`}>
              {text}
            </span>
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
            disabled={!text.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {!text.trim() ? 'Ketik Nama Anda Dulu' : 'Gunakan Tanda Tangan'}
          </button>
        </div>
      </div>
    </div>
  );
}
