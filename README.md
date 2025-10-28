# E-Sign PDF - Web Application

A modern web application for adding digital signatures to PDF files with various flexible signing methods. All processing is done 100% in the browser to protect your document privacy and security.

## Screenshots

### Upload & Display PDF
![Upload PDF](example/Screenshot%202025-10-27%20at%2006.21.39.png)

### Create & Position Signature
![Add Signature](example/Screenshot%202025-10-27%20at%2006.22.30.png)

## Features

### Core Features
- **User Authentication** - Secure login system to protect your workspace
- **Dark Mode** - Full dark mode support with automatic theme detection
- Upload PDF files with drag & drop or file picker
- Multi-page PDF navigation with complete page controls
- Zoom in/out PDF (50% - 300%)
- Download signed PDF
- Support multiple signatures per document
- Support multiple signatures per page

### Signature Creation Methods
1. **Manual Drawing** - Draw signatures with mouse/touch using canvas
2. **Text-based Signature** - Type name with various elegant signature font options
3. **Image Upload** - Upload signature images (PNG, JPG, JPEG)
4. **QR Code** - Generate QR Code for digital verification with customizable options

### Advanced Signature Features
- Drag & drop signatures to any position on PDF
- Resize signatures with react-rnd (resizable & draggable)
- Delete individual signatures
- Real-time preview before adding to document
- Signatures assigned per page (multi-page support)

### QR Code Features
- Customizable QR Code content (URL, text, email, phone, etc.)
- Adjustable size (100px - 300px)
- Error correction levels (L, M, Q, H)
- Custom colors for foreground and background
- Quick templates for common use cases
- Live preview with scan test

### UI/UX Features
- **Dark Mode Toggle** - Switch between light and dark themes
- **Persistent Theme** - Theme preference saved in localStorage
- **System Theme Detection** - Automatically detects system color scheme preference
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **User Profile Menu** - Quick access to profile, settings, and logout

## Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **React Context API** - State management for theme and authentication

### PDF Processing
- **react-pdf** (pdfjs-dist 3.11.174) - PDF rendering dan display
- **pdf-lib** - PDF manipulation dan signature embedding

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Signature & Interaction
- **react-signature-canvas** - Canvas-based signature drawing
- **react-rnd** - Resizable dan draggable components
- **react-draggable** - Drag & drop functionality
- **qrcode.react** - QR Code generation
- **react-barcode** - Barcode generation support

### Utilities
- **file-saver** - File download handling
- **uuid** - Unique ID generation for signatures
- **zustand** - Lightweight state management (if needed)

## Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **npm** or **yarn** or **pnpm**

### Installation

```bash
# Clone repository
git clone https://github.com/shoelfikar/e-sign-pdf
cd e-sign-pdf

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will run at `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Output will be in the `.next/` folder

### Start Production Server

```bash
npm run start
# or
yarn start
# or
pnpm start
```

### Preview Production Build

```bash
npm run preview
# or
npm run start
```

## Project Structure

```
e-sign-pdf/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page (main application)
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # React components
│   │   ├── FileUpload/           # File upload component
│   │   ├── PDFViewer/            # PDF display & navigation
│   │   ├── SignatureCreator/     # Signature creation modal
│   │   │   ├── DrawSignature.jsx    # Canvas drawing
│   │   │   ├── TextSignature.jsx    # Font-based signature
│   │   │   ├── ImageSignature.jsx   # Image upload
│   │   │   ├── QRCodeSignature.jsx  # QR Code generator
│   │   │   └── BarcodeSignature.jsx # Barcode support
│   │   └── DraggableSignature/   # Draggable signature overlay
│   └── utils/             # Utility functions
│       └── pdfUtils.js    # PDF generation & manipulation
├── public/                # Static assets
├── node_modules/          # Dependencies
├── package.json           # Project configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── jsconfig.json          # JavaScript configuration
```

## Development Roadmap

### ✅ Phase 1 - MVP (Completed)
- [x] Upload PDF dengan drag & drop
- [x] Display PDF (single page)
- [x] Drawing signature dengan canvas
- [x] Drag signature to position
- [x] Download PDF with signature

### ✅ Phase 2 - Enhanced Features (Completed)
- [x] Multi-page PDF navigation with complete controls
- [x] Text-based signature with multiple fonts
- [x] Image upload signature (PNG, JPG, JPEG)
- [x] Resize & drag signature with react-rnd
- [x] Multiple signatures per document & per page
- [x] Zoom in/out PDF (50% - 300%)
- [x] QR Code signature generator
- [x] Real-time preview for all signature types

### ✅ Phase 3 - Authentication & Theme (Completed)
- [x] User authentication system with login page
- [x] Protected routes for secure access
- [x] Dark mode implementation with theme toggle
- [x] Persistent theme preferences
- [x] System theme detection
- [x] User profile menu with logout functionality


## Usage Guide

### 1. Login
1. Navigate to the login page at `/login`
2. Enter your email and password (minimum 6 characters)
3. For demo purposes, you can use any email and password
4. Click "Sign in" to access the application

**Demo Credentials:**
- Email: demo@example.com
- Password: demo123

### 2. Upload PDF
1. After logging in, you'll be redirected to the main application
2. Open the application in your browser
2. Click the upload area or **drag & drop** a PDF file into the upload area
3. The PDF file will automatically render in the viewer
4. Wait for the loading to complete

**Tips:**
- Recommended maximum file size: 10MB
- Supported format: PDF (.pdf)
- Files are processed 100% in the browser, not uploaded to any server

### 3. Toggle Dark Mode
- Click the moon/sun icon in the header to toggle between light and dark modes
- Your preference will be saved automatically
- The app respects your system's color scheme preference by default

### 4. Navigate PDF (Multi-page)
Use the available navigation controls:
- **First/Last Page**: Jump directly to the first/last page
- **Previous/Next**: Navigate page by page
- **Page Counter**: Displays current page of total pages
- **Zoom Controls**: Zoom in/out (50% - 300%), or reset to 100%

### 5. Create Signature
1. Click the **"Create Signature"** button
2. Choose one of 4 methods:

#### A. Draw
- Draw your signature using mouse or touch
- Click **"Clear"** to erase and redraw
- Choose line color and thickness
- Real-time preview on canvas

#### B. Text
- Type your name in the input field
- Choose from various available signature fonts
- Select font size
- Choose text color
- Preview appears automatically

#### C. Upload (Image)
- Click **"Upload Image"** or drag & drop
- Select an image file (PNG, JPG, JPEG)
- Image will be automatically cropped and optimized
- Preview is displayed immediately

#### D. QR Code
- Enter QR Code content (URL, text, email, phone, etc.)
- Or use available quick templates
- Set QR Code size (100px - 300px)
- Choose error correction level (L, M, Q, H)
- Customize foreground and background colors
- Toggle white margin around QR Code
- QR Code preview can be scanned immediately

3. Click **"Use Signature"** to add it to the document
4. The signature will appear on the currently active PDF page

### 6. Position & Resize Signature
After adding a signature:
- **Drag**: Click and drag the signature to the desired position
- **Resize**: Drag corner handles to change size
- **Delete**: Click the delete icon (🗑️) in the signature corner
- **Multi-signature**: Repeat the process to add more signatures

**Tips:**
- Signatures are assigned to specific pages
- You can add multiple signatures on one page
- You can add different signatures on each page
- Position and size are saved per signature

### 7. Download PDF
1. Ensure all signatures are positioned correctly
2. Click the **"Download PDF"** button
3. The application will:
   - Process all signatures
   - Embed signatures into the PDF
   - Generate a new file named `[original-name]-signed.pdf`
4. The file will automatically download to your Downloads folder
5. Open the file to verify the results

**Note:**
- At least 1 signature must be added before download
- Processing may take time for large PDFs
- Signatures will be permanent in the downloaded PDF

## Browser Support

This application supports all modern browsers with Canvas API and File API features:

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 90+ | ✅ Fully supported | Recommended browser |
| Firefox | 88+ | ✅ Fully supported | Full feature support |
| Safari | 14+ | ✅ Fully supported | macOS & iOS |
| Edge | 90+ | ✅ Fully supported | Chromium-based |
| Opera | 76+ | ✅ Fully supported | Chromium-based |
| Mobile Safari | iOS 14+ | ✅ Supported | Touch gestures work |
| Chrome Mobile | Android 90+ | ✅ Supported | Touch gestures work |

**Minimum Requirements:**
- JavaScript enabled
- Canvas API support
- File API support
- LocalStorage (optional, for future features)

## Performance

### Optimization Features
- **Client-side processing**: All operations are performed in the browser
- **No server upload**: Privacy-friendly, no network latency
- **PDF.js Web Workers**: PDF rendering using Web Workers for performance
- **Lazy loading**: Only render the page currently being displayed
- **Efficient memory**: Object URLs with proper cleanup
- **Optimized images**: Auto-optimization for uploaded signatures

### Performance Tips
- **File Size**: Use PDFs < 10MB for optimal performance
- **Page Count**: PDFs with many pages will take longer to load on first render
- **Zoom Level**: Lower zoom levels (50%-100%) render faster
- **Multiple Signatures**: No limit, but many signatures can affect processing time during download

## Security & Privacy

### Privacy Features
- ✅ **100% Client-side Processing**: PDFs are never uploaded to a server
- ✅ **No Data Storage**: No data is stored on servers or cloud
- ✅ **No Tracking**: No analytics or tracking cookies
- ✅ **Secure HTTPS**: Application uses HTTPS (if deployed with SSL)
- ✅ **No External Calls**: All assets loaded from local (except PDF.js worker from CDN)

### Security Measures
- **File Validation**: Only accepts files with `.pdf` extension
- **MIME Type Check**: Validates MIME type to ensure file is a PDF
- **Size Limits**: Recommended max 10MB per file (configurable)
- **XSS Protection**: React auto-escaping to prevent XSS attacks
- **No Code Injection**: User input is sanitized before use

### Best Practices
1. **Do not use for high-security documents** that require digital certificates
2. **Review the resulting PDF** before sharing with others
3. **Use HTTPS** when deploying for in-transit encryption
4. **Clear browser cache** after using the application for sensitive documents

## Troubleshooting

### PDF not showing / Error loading PDF
**Possible causes:**
- Uploaded file is not a valid PDF or is corrupt
- PDF uses encryption or is password protected
- PDF uses a format not supported by PDF.js

**Solutions:**
1. Ensure the file is a valid PDF (try opening in Adobe Reader)
2. If PDF is password-protected, unlock it first
3. Convert PDF to standard format if using custom encoding
4. Check browser console (F12) for detailed error messages

### Signature cannot be dragged
**Possible causes:**
- Browser does not support drag functionality
- Signature has not fully loaded
- Conflict with zoom or scroll

**Solutions:**
1. Ensure signature has appeared completely on PDF
2. Reset zoom to 100%
3. Refresh the page and try again
4. Use a fully supported browser (Chrome/Firefox)

### Signature does not appear in downloaded PDF
**Possible causes:**
- Signature position is outside PDF page bounds
- Error during PDF generation
- Browser blocking download

**Solutions:**
1. Ensure signature is within the PDF area (not overflowing)
2. Check browser console for error messages
3. Allow downloads in browser settings
4. Try another browser

### Download error / PDF corrupt
**Possible causes:**
- PDF is too large
- Insufficient memory
- Browser limitations

**Solutions:**
1. Use a smaller PDF (< 10MB)
2. Close other tabs/applications to free up memory
3. Try on desktop browser (not mobile)
4. Clear browser cache and try again

### Large PDF rendering slow
**Possible causes:**
- PDF has many pages or high resolution
- Low-end device or browser performance

**Solutions:**
1. Use lower zoom level (50-75%)
2. Close other applications to free up resources
3. Use pagination - navigate per page, don't scroll all
4. Consider compressing PDF before upload
5. Use desktop browser for better performance

### QR Code cannot be scanned
**Possible causes:**
- QR Code is too small
- Color contrast is insufficient
- Error correction level is too low

**Solutions:**
1. Increase QR Code size (minimum 150x150px)
2. Use high contrast colors (black-white)
3. Choose error correction level "M" or "Q"
4. Add white margin around QR Code
5. Test scan before finalizing PDF

### App not loading / Blank page
**Possible causes:**
- JavaScript disabled
- Browser not supported
- Network issues (PDF.js worker failed to load)

**Solutions:**
1. Enable JavaScript in browser settings
2. Use a modern browser (Chrome 90+, Firefox 88+, Safari 14+)
3. Check internet connection (to load PDF.js worker from CDN)
4. Clear browser cache and reload
5. Try incognito/private mode to rule out extension conflicts

### Touch/Mobile issues
**Possible causes:**
- Mobile browser limitations
- Touch events not properly handled
- Screen size is too small

**Solutions:**
1. Use landscape mode for a wider screen
2. Zoom in for precision when dragging signature
3. Consider using desktop browser for better experience
4. Use stylus for more precise control

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

### Docker
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t e-sign-pdf .
docker run -p 3000:3000 e-sign-pdf
```

### Environment Variables
No environment variables are required for basic deployment. All configuration is in the code.

## Contributing

Contributions are very welcome! Please follow these guidelines:

### How to Contribute
1. **Fork** the project
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex code
- Test thoroughly before submitting PR
- Update documentation if adding features
- Ensure no console errors or warnings

### Areas for Contribution
- 🐛 Bug fixes
- ✨ New features from roadmap
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🌍 Translations/Internationalization
- ⚡ Performance optimizations

## License

MIT License - see [LICENSE](LICENSE) file for full details.

Copyright (c) 2025 E-Sign PDF Contributors

## Contact & Support

- **Issues**: [GitHub Issues](https://github.com/shoelfikar/e-sign-pdf/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shoelfikar/e-sign-pdf/discussions)
- **Email**: sulfikardi25@gmail.com

Project Link: [https://github.com/shoelfikar/e-sign-pdf](https://github.com/shoelfikar/e-sign-pdf)

## Acknowledgments

Thanks to the open-source projects that made this application possible:

- **[PDF.js](https://mozilla.github.io/pdf.js/)** - Powerful PDF rendering engine by Mozilla
- **[pdf-lib](https://pdf-lib.js.org/)** - Create and modify PDF documents in any JavaScript environment
- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[React](https://react.dev/)** - JavaScript library for building user interfaces
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[react-signature-canvas](https://github.com/agilgur5/react-signature-canvas)** - Signature pad component
- **[react-rnd](https://github.com/bokuweb/react-rnd)** - Resizable and draggable component
- **[qrcode.react](https://github.com/zpao/qrcode.react)** - QR Code component for React

## FAQ

### Is this application free?
Yes, this application is completely free and open-source with MIT License.

### Do I need to create an account?
For the demo version, you can use any email and password (minimum 6 characters) to login. In a production environment, you would integrate with a proper authentication backend.

### Is my data safe?
Very safe. All processing is done 100% in your browser. No data is uploaded to any server. Login credentials are stored locally only for the demo.

### Can it be used offline?
Currently requires internet to load PDF.js worker and for initial login. Future version will support PWA with offline mode.

### How do I enable dark mode?
Click the moon/sun icon in the top-right corner of the header. Your preference will be saved automatically.

### Are the signatures legally valid?
This application creates visual signatures, not digital certificates. Legality depends on regulations in your country. For important legal documents, consult with a legal expert.

### Can I batch sign multiple PDFs at once?
This feature is still in the roadmap (Phase 3). Currently only supports one PDF per session.

### Is there a file size limit?
No hard limit, but < 10MB is recommended for optimal performance.

### How do I report a bug?
Please create an issue on [GitHub Issues](https://github.com/shoelfikar/e-sign-pdf/issues) with complete details.

---

**Made with ❤️ using Next.js, React & Tailwind CSS**

⭐ Star this project if you find it useful!
