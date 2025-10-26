'use client';

import { useState } from 'react';
import DrawSignature from './DrawSignature';
import TextSignature from './TextSignature';
import ImageSignature from './ImageSignature';
import QRCodeSignature from './QRCodeSignature';

export default function SignatureCreator({ onSignatureCreate, onClose }) {
  const [activeTab, setActiveTab] = useState('draw'); // 'draw', 'text', 'image', 'qrcode'

  const tabs = [
    { id: 'draw', label: 'Gambar', icon: '✍️' },
    { id: 'text', label: 'Ketik', icon: '📝' },
    { id: 'image', label: 'Upload', icon: '📁' },
    { id: 'qrcode', label: 'QR Code', icon: '⚏' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Buat Tanda Tangan</h2>
            <p className="text-sm text-gray-600 mt-1">
              Pilih metode untuk membuat tanda tangan Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-6 py-4 text-center font-medium transition-colors
                ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'draw' && (
            <DrawSignature onSignatureCreate={onSignatureCreate} onClose={onClose} />
          )}
          {activeTab === 'text' && (
            <TextSignature onSignatureCreate={onSignatureCreate} onClose={onClose} />
          )}
          {activeTab === 'image' && (
            <ImageSignature onSignatureCreate={onSignatureCreate} onClose={onClose} />
          )}
          {activeTab === 'qrcode' && (
            <QRCodeSignature onSignatureCreate={onSignatureCreate} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
