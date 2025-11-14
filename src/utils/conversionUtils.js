import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfjsLib from 'pdfjs-dist';

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
  try {
    // Read the Word file
    const arrayBuffer = await wordFile.arrayBuffer();

    // Convert Word to HTML using mammoth with styling options
    const result = await mammoth.convertToHtml({
      arrayBuffer,
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Title'] => h1.title:fresh",
        "r[style-name='Strong'] => strong"
      ]
    });

    const htmlContent = result.value;

    if (!htmlContent || htmlContent.trim().length === 0) {
      throw new Error('Tidak ada konten yang dapat diekstrak dari file Word');
    }

    // Create a temporary container element
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '793px'; // A4 width in pixels at 96dpi (210mm)
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '14px';
    container.style.lineHeight = '1.6';
    container.style.color = '#000000';
    container.style.boxSizing = 'border-box';

    // Apply styles to content
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.style.margin = '0 0 12px 0';
      p.style.textAlign = 'justify';
    });

    const headings1 = container.querySelectorAll('h1');
    headings1.forEach(h => {
      h.style.fontSize = '24px';
      h.style.fontWeight = 'bold';
      h.style.margin = '20px 0 12px 0';
    });

    const headings2 = container.querySelectorAll('h2');
    headings2.forEach(h => {
      h.style.fontSize = '20px';
      h.style.fontWeight = 'bold';
      h.style.margin = '18px 0 10px 0';
    });

    const headings3 = container.querySelectorAll('h3');
    headings3.forEach(h => {
      h.style.fontSize = '16px';
      h.style.fontWeight = 'bold';
      h.style.margin = '16px 0 8px 0';
    });

    const lists = container.querySelectorAll('ul, ol');
    lists.forEach(list => {
      list.style.margin = '10px 0';
      list.style.paddingLeft = '30px';
    });

    const tables = container.querySelectorAll('table');
    tables.forEach(table => {
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      table.style.margin = '10px 0';

      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.style.border = '1px solid #000';
        cell.style.padding = '5px';
      });
    });

    document.body.appendChild(container);

    // Create PDF using jsPDF and html2canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight
    });

    // Remove container
    document.body.removeChild(container);

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.95),
      'JPEG',
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    // Convert to blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Error converting Word to PDF:', error);
    throw new Error('Gagal mengkonversi Word ke PDF: ' + error.message);
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
