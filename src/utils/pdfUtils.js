import { PDFDocument } from 'pdf-lib';

/**
 * Embed signatures into PDF and generate download
 * @param {File} pdfFile - Original PDF file
 * @param {Array} signatures - Array of signature objects with position, size, and data
 * @returns {Promise<Uint8Array>} - Modified PDF bytes
 */
export async function embedSignaturesToPDF(pdfFile, signatures) {
  try {
    // Read the original PDF
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Process each signature
    for (const signature of signatures) {
      const page = pdfDoc.getPage(signature.page - 1); // Pages are 0-indexed
      const { width: pageWidth, height: pageHeight } = page.getSize();

      // Load signature image
      const imageBytes = await fetch(signature.data).then((res) =>
        res.arrayBuffer()
      );

      // Embed image (try PNG first, fallback to JPG)
      let image;
      try {
        image = await pdfDoc.embedPng(imageBytes);
      } catch (e) {
        try {
          image = await pdfDoc.embedJpg(imageBytes);
        } catch (e2) {
          console.error('Failed to embed signature image:', e2);
          continue;
        }
      }

      // Calculate position
      // Note: PDF coordinates start from bottom-left, not top-left
      const x = signature.position.x;
      const y = pageHeight - signature.position.y - signature.height;

      // Draw the signature on the page
      page.drawImage(image, {
        x: x,
        y: y,
        width: signature.width,
        height: signature.height,
      });
    }

    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Error embedding signatures to PDF:', error);
    throw error;
  }
}

/**
 * Download PDF file
 * @param {Uint8Array} pdfBytes - PDF bytes
 * @param {string} filename - Desired filename
 */
export function downloadPDF(pdfBytes, filename = 'signed-document.pdf') {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download signed PDF
 * @param {File} pdfFile - Original PDF file
 * @param {Array} signatures - Array of signatures
 * @param {string} filename - Desired filename
 */
export async function generateSignedPDF(pdfFile, signatures, filename) {
  try {
    const pdfBytes = await embedSignaturesToPDF(pdfFile, signatures);
    downloadPDF(pdfBytes, filename);
    return true;
  } catch (error) {
    console.error('Error generating signed PDF:', error);
    return false;
  }
}
