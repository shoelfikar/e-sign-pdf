'use client';

import { useState } from 'react';
import { Rnd } from 'react-rnd';

export default function DraggableSignature({ signature, onPositionChange, onDelete, signatureId }) {
  const [size, setSize] = useState({
    width: signature.width || 200,
    height: signature.height || 100,
  });
  const [position, setPosition] = useState(signature.position || { x: 50, y: 50 });

  const handleDragStop = (_e, d) => {
    const newPosition = { x: d.x, y: d.y };
    setPosition(newPosition);
    if (onPositionChange) {
      onPositionChange(signatureId, newPosition, size);
    }
  };

  const handleResizeStop = (_e, _direction, ref, _delta, newPosition) => {
    const newSize = {
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
    };
    setSize(newSize);
    setPosition(newPosition);
    if (onPositionChange) {
      onPositionChange(signatureId, newPosition, newSize);
    }
  };

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      minWidth={50}
      minHeight={25}
      maxWidth={400}
      maxHeight={200}
      lockAspectRatio={true}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      className="group"
    >
      <div className="relative w-full h-full">
        {/* Signature Image */}
        <img
          src={signature.data}
          alt="Signature"
          className="w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />

        {/* Dashed Border - Visible on hover */}
        <div className="absolute inset-0 border-2 border-blue-500 border-dashed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        {/* Control Buttons - Show on hover */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex items-center gap-2 p-2 whitespace-nowrap">
            <span className="text-xs text-gray-600 font-medium">
              {Math.round(size.width)}x{Math.round(size.height)}px
            </span>

            {/* Delete Button */}
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={() => onDelete && onDelete(signatureId)}
              className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
              title="Hapus tanda tangan"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drag instruction */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap">
            🖱️ Drag untuk pindah • 📐 Resize dari border
          </div>
        </div>

        {/* Resize Handles Indicators (corner dots) */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none translate-x-1/2 translate-y-1/2"></div>
      </div>
    </Rnd>
  );
}
