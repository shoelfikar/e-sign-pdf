import { renderAsync } from 'docx-preview';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Convert Word document to PDF with formatting preserved
 * @param {File} wordFile - The Word file to convert
 * @returns {Promise<Blob>} - PDF blob
 */
export async function convertWordToPDF(wordFile) {
  let container = null;
  let style = null;

  try {
    // Read the Word file
    const arrayBuffer = await wordFile.arrayBuffer();

    // Create a temporary container for rendering - let docx-preview determine size
    container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.backgroundColor = '#ffffff';

    // Add CSS for proper Word document rendering - DO NOT override document size/margins
    style = document.createElement('style');
    style.textContent = `
      .docx-conversion-container section.docx {
        background: white;
        margin-bottom: 20px;
      }
      .docx-conversion-container table {
        border-collapse: collapse;
      }
      .docx-conversion-container img {
        max-width: 100%;
        height: auto;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(container);

    // Use docx-preview to render Word document with exact formatting
    await renderAsync(arrayBuffer, container, null, {
      className: 'docx-conversion-container',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false, // Preserve exact fonts
      breakPages: true, // Proper page breaks
      ignoreLastRenderedPageBreak: false,
      experimental: false,
      trimXmlDeclaration: true,
      useBase64URL: true, // For embedded images
      renderChanges: false,
      renderHeaders: true, // Render headers
      renderFooters: true, // Render footers
      renderFootnotes: true, // Render footnotes
      renderEndnotes: true, // Render endnotes
      renderComments: false, // Don't show comments in PDF
      debug: false
    });

    // Wait for fonts and images to load completely
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create PDF using jsPDF and html2canvas with high quality settings
    const canvas = await html2canvas(container, {
      scale: 3, // Higher scale for better quality (increased from 2)
      useCORS: true, // Enable CORS for images
      allowTaint: true, // Allow cross-origin images
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
      letterRendering: true, // Better text rendering
      imageTimeout: 15000, // Wait longer for images to load
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.querySelector('div');
        if (clonedContainer) {
          clonedContainer.style.display = 'block';
          clonedContainer.style.position = 'relative';
          clonedContainer.style.left = '0';
        }
      }
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Convert canvas to image data (using PNG for better quality)
    const imgData = canvas.toDataURL('image/png');

    // Add first page
    pdf.addImage(
      imgData,
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );
      heightLeft -= pageHeight;
    }

    // Convert to blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Error converting Word to PDF:', error);
    throw new Error('Gagal mengkonversi Word ke PDF: ' + error.message);
  } finally {
    // Clean up DOM elements
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }
    if (style && style.parentNode) {
      document.head.removeChild(style);
    }
  }
}

/**
 * Convert PDF to Word document
 * @param {File} pdfFile - The PDF file to convert
 * @returns {Promise<Blob>} - Word document blob
 */
export async function convertPDFToWord(pdfFile) {
  try {
    // Read the PDF file
    const arrayBuffer = await pdfFile.arrayBuffer();

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const paragraphs = [];

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Add page separator for pages after the first
      if (pageNum > 1) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '',
                break: 2,
              }),
            ],
          })
        );
      }

      // Group text items by vertical position (lines)
      const lines = {};
      textContent.items.forEach((item) => {
        if (item.str && item.str.trim()) {
          const y = Math.round(item.transform[5]);
          if (!lines[y]) {
            lines[y] = [];
          }
          lines[y].push(item.str);
        }
      });

      // Convert lines to paragraphs
      const sortedYPositions = Object.keys(lines).sort((a, b) => b - a); // Sort from top to bottom

      sortedYPositions.forEach((y) => {
        const text = lines[y].join(' ').trim();
        if (text) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  font: 'Calibri',
                  size: 22, // 11pt (size is in half-points)
                }),
              ],
              spacing: {
                after: 120,
                line: 276, // 1.15 line spacing
              },
            })
          );
        }
      });
    }

    // If no paragraphs were extracted, add a message
    if (paragraphs.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'No text content could be extracted from the PDF.',
              font: 'Calibri',
              size: 22,
            }),
          ],
        })
      );
    }

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,    // 0.5 inch
                right: 720,  // 0.5 inch
                bottom: 720, // 0.5 inch
                left: 720,   // 0.5 inch
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    // Generate Word document blob
    const blob = await Packer.toBlob(doc);
    return blob;
  } catch (error) {
    console.error('Error converting PDF to Word:', error);
    throw new Error('Gagal mengkonversi PDF ke Word: ' + error.message);
  }
}

/**
 * Download a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get file extension
 * @param {string} filename
 * @returns {string}
 */
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

/**
 * Validate file type for conversion
 * @param {File} file
 * @param {string} expectedType - 'word' or 'pdf'
 * @returns {boolean}
 */
export function validateFileType(file, expectedType) {
  const ext = getFileExtension(file.name);

  if (expectedType === 'word') {
    return ext === 'docx' || ext === 'doc';
  } else if (expectedType === 'pdf') {
    return ext === 'pdf';
  }

  return false;
}

/**
 * Get page size from Word document
 * @param {File} wordFile - The Word file to analyze
 * @returns {Promise<Object>} - Page size information
 */
export async function getDocxPageSize(wordFile) {
  try {
    const arrayBuffer = await wordFile.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Read document.xml which contains page settings
    const documentXml = await zip.file('word/document.xml').async('string');

    // Parse XML to get page size
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(documentXml, 'text/xml');

    // Find w:pgSz element (page size)
    const pgSz = xmlDoc.getElementsByTagName('w:pgSz')[0];

    if (pgSz) {
      // Get width and height in twips (1/1440 inch)
      const widthTwips = parseInt(pgSz.getAttribute('w:w') || '12240'); // Default A4 width
      const heightTwips = parseInt(pgSz.getAttribute('w:h') || '15840'); // Default A4 height

      // Convert twips to different units
      const TWIPS_PER_INCH = 1440;
      const MM_PER_INCH = 25.4;
      const PIXELS_PER_INCH = 96; // Standard screen DPI

      const widthInches = widthTwips / TWIPS_PER_INCH;
      const heightInches = heightTwips / TWIPS_PER_INCH;

      const widthMm = widthInches * MM_PER_INCH;
      const heightMm = heightInches * MM_PER_INCH;

      const widthPx = widthInches * PIXELS_PER_INCH;
      const heightPx = heightInches * PIXELS_PER_INCH;

      // Detect common paper sizes
      let paperSize = 'Custom';
      if (Math.abs(widthMm - 210) < 5 && Math.abs(heightMm - 297) < 5) {
        paperSize = 'A4 Portrait';
      } else if (Math.abs(widthMm - 297) < 5 && Math.abs(heightMm - 210) < 5) {
        paperSize = 'A4 Landscape';
      } else if (Math.abs(widthMm - 215.9) < 5 && Math.abs(heightMm - 279.4) < 5) {
        paperSize = 'Letter Portrait';
      } else if (Math.abs(widthMm - 279.4) < 5 && Math.abs(heightMm - 215.9) < 5) {
        paperSize = 'Letter Landscape';
      }

      return {
        twips: { width: widthTwips, height: heightTwips },
        inches: { width: widthInches, height: heightInches },
        mm: { width: widthMm, height: heightMm },
        pixels: { width: Math.round(widthPx), height: Math.round(heightPx) },
        paperSize: paperSize
      };
    }

    // Default A4 size if not found
    return {
      twips: { width: 12240, height: 15840 },
      inches: { width: 8.5, height: 11.69 },
      mm: { width: 210, height: 297 },
      pixels: { width: 794, height: 1123 },
      paperSize: 'A4 Portrait (Default)'
    };
  } catch (error) {
    console.error('Error getting page size:', error);
    // Return default A4 size on error
    return {
      twips: { width: 12240, height: 15840 },
      inches: { width: 8.5, height: 11.69 },
      mm: { width: 210, height: 297 },
      pixels: { width: 794, height: 1123 },
      paperSize: 'A4 Portrait (Default)'
    };
  }
}
