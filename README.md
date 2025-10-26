# E-Sign PDF - Web Application

Aplikasi web modern untuk menambahkan tanda tangan digital pada file PDF dengan berbagai metode signing yang fleksibel. Semua proses dilakukan 100% di browser untuk menjaga privasi dan keamanan dokumen Anda.

## Screenshots

### Upload & Display PDF
![Upload PDF](example/Screenshot%202025-10-27%20at%2006.21.39.png)

### Create & Position Signature
![Add Signature](example/Screenshot%202025-10-27%20at%2006.22.30.png)

## Features

### Core Features
- Upload file PDF dengan drag & drop atau file picker
- Multi-page PDF navigation dengan kontrol halaman lengkap
- Zoom in/out PDF (50% - 300%)
- Download PDF yang sudah ditandatangani
- Support multiple signatures per dokumen
- Support multiple signatures per halaman

### Metode Pembuatan Tanda Tangan
1. **Drawing Manual** - Gambar tanda tangan dengan mouse/touch menggunakan canvas
2. **Text-based Signature** - Ketik nama dengan berbagai pilihan font signature yang elegant
3. **Image Upload** - Upload gambar tanda tangan (PNG, JPG, JPEG)
4. **QR Code** - Generate QR Code untuk verifikasi digital dengan customizable options

### Advanced Signature Features
- Drag & drop tanda tangan ke posisi mana saja di PDF
- Resize tanda tangan dengan react-rnd (resizable & draggable)
- Delete signature individual
- Preview real-time sebelum menambahkan ke dokumen
- Tanda tangan ter-assign per halaman (multi-page support)

### QR Code Features
- Customizable QR Code content (URL, text, email, phone, dll)
- Adjustable size (100px - 300px)
- Error correction levels (L, M, Q, H)
- Custom colors untuk foreground dan background
- Template cepat untuk use case umum
- Live preview dengan scan test

## Tech Stack

### Frontend Framework
- **Next.js 14** - React framework dengan App Router
- **React 18** - UI library

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
- **uuid** - Unique ID generation untuk signatures
- **zustand** - Lightweight state management (if needed)

## Quick Start

### Prerequisites
- **Node.js** 18 atau lebih tinggi
- **npm** atau **yarn** atau **pnpm**

### Installation

```bash
# Clone repository
git clone https://github.com/shoelfikar/e-sign-pdf
cd e-sign-pdf

# Install dependencies
npm install
# atau
yarn install
# atau
pnpm install

# Start development server
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Build for Production

```bash
npm run build
# atau
yarn build
# atau
pnpm build
```

Output akan ada di folder `.next/`

### Start Production Server

```bash
npm run start
# atau
yarn start
# atau
pnpm start
```

### Preview Production Build

```bash
npm run preview
# atau
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

Lihat [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) untuk detail lengkap struktur komponen.

## Documentation

Dokumentasi lengkap tersedia untuk membantu Anda memahami arsitektur dan struktur project:

- **[PROJECT_BLUEPRINT.md](PROJECT_BLUEPRINT.md)** - Arsitektur lengkap, design decisions, dan teknologi yang digunakan
- **[FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)** - Detail struktur folder dan component hierarchy
- **[DEPENDENCIES.md](DEPENDENCIES.md)** - Dokumentasi lengkap semua dependencies dan kegunaannya

## Development Roadmap

### ✅ Phase 1 - MVP (Completed)
- [x] Upload PDF dengan drag & drop
- [x] Display PDF (single page)
- [x] Drawing signature dengan canvas
- [x] Drag signature to position
- [x] Download PDF with signature

### ✅ Phase 2 - Enhanced Features (Completed)
- [x] Multi-page PDF navigation dengan kontrol lengkap
- [x] Text-based signature dengan multiple fonts
- [x] Image upload signature (PNG, JPG, JPEG)
- [x] Resize & drag signature dengan react-rnd
- [x] Multiple signatures per document & per page
- [x] Zoom in/out PDF (50% - 300%)
- [x] QR Code signature generator
- [x] Real-time preview untuk semua signature types

### 🚧 Phase 3 - Advanced Features (In Progress)
- [ ] Undo/Redo functionality untuk signature management
- [ ] Save draft ke local storage
- [ ] Export settings & preferences
- [ ] Signature templates (save & reuse)
- [ ] Batch signing untuk multiple PDFs
- [ ] Digital certificate integration

### 📋 Phase 4 - Professional Features (Planned)
- [ ] User authentication & profiles
- [ ] Cloud storage integration
- [ ] Signature verification & audit trail
- [ ] Team collaboration features
- [ ] API untuk integrasi dengan system lain
- [ ] Mobile app (React Native)

### 🎨 Phase 5 - UX Improvements (Planned)
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements (WCAG 2.1)
- [ ] Internationalization (i18n) - Multi-language
- [ ] Progressive Web App (PWA)
- [ ] Offline mode support

## Usage Guide

### 1. Upload PDF
1. Buka aplikasi di browser
2. Klik area upload atau **drag & drop** file PDF ke area upload
3. File PDF akan otomatis di-render di viewer
4. Tunggu hingga loading selesai

**Tips:**
- Ukuran file maksimal yang direkomendasikan: 10MB
- Format yang didukung: PDF (.pdf)
- File diproses 100% di browser, tidak diupload ke server

### 2. Navigate PDF (Multi-page)
Gunakan kontrol navigasi yang tersedia:
- **First/Last Page**: Langsung ke halaman pertama/terakhir
- **Previous/Next**: Navigasi halaman per halaman
- **Page Counter**: Menampilkan halaman saat ini dari total halaman
- **Zoom Controls**: Zoom in/out (50% - 300%), atau reset ke 100%

### 3. Create Signature
1. Klik tombol **"Buat Tanda Tangan"**
2. Pilih salah satu dari 4 metode:

#### A. Gambar (Draw)
- Gambar tanda tangan menggunakan mouse atau touch
- Klik **"Clear"** untuk menghapus dan gambar ulang
- Pilih warna dan ketebalan garis
- Preview real-time di canvas

#### B. Ketik (Text)
- Ketik nama Anda di input field
- Pilih dari berbagai font signature yang tersedia
- Pilih ukuran font
- Pilih warna teks
- Preview otomatis muncul

#### C. Upload (Image)
- Klik **"Upload Image"** atau drag & drop
- Pilih file gambar (PNG, JPG, JPEG)
- Gambar akan otomatis di-crop dan di-optimize
- Preview langsung ditampilkan

#### D. QR Code
- Masukkan konten QR Code (URL, text, email, phone, dll)
- Atau gunakan template cepat yang tersedia
- Atur ukuran QR Code (100px - 300px)
- Pilih error correction level (L, M, Q, H)
- Customize warna foreground dan background
- Toggle margin putih di sekitar QR Code
- Preview QR Code langsung bisa di-scan

3. Klik **"Gunakan Tanda Tangan"** untuk menambahkan ke dokumen
4. Signature akan muncul di halaman PDF yang sedang aktif

### 4. Position & Resize Signature
Setelah signature ditambahkan:
- **Drag**: Klik dan drag signature ke posisi yang diinginkan
- **Resize**: Drag corner handles untuk mengubah ukuran
- **Delete**: Klik icon delete (🗑️) di pojok signature
- **Multi-signature**: Ulangi proses untuk menambah signature lain

**Tips:**
- Signature ter-assign ke halaman tertentu
- Bisa menambahkan multiple signatures di satu halaman
- Bisa menambahkan signature berbeda di setiap halaman
- Position dan size disimpan per signature

### 5. Download PDF
1. Pastikan semua signature sudah diposisikan dengan benar
2. Klik tombol **"Download PDF"**
3. Aplikasi akan:
   - Memproses semua signatures
   - Embed signatures ke dalam PDF
   - Generate file baru dengan nama `[original-name]-signed.pdf`
4. File otomatis terdownload ke folder Downloads
5. Buka file untuk verifikasi hasil

**Note:**
- Minimum 1 signature harus ditambahkan sebelum download
- Processing mungkin memakan waktu untuk PDF besar
- Signature akan permanent di PDF hasil download

## Browser Support

Aplikasi ini mendukung semua browser modern dengan fitur Canvas API dan File API:

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
- LocalStorage (optional, untuk future features)

## Performance

### Optimization Features
- **Client-side processing**: Semua operasi dilakukan di browser
- **No server upload**: Privacy-friendly, no network latency
- **PDF.js Web Workers**: Rendering PDF menggunakan Web Workers untuk performance
- **Lazy loading**: Hanya render halaman yang sedang ditampilkan
- **Efficient memory**: Object URLs dengan proper cleanup
- **Optimized images**: Auto-optimization untuk uploaded signatures

### Performance Tips
- **File Size**: Gunakan PDF < 10MB untuk performa optimal
- **Page Count**: PDF dengan banyak halaman akan load lebih lama pada first render
- **Zoom Level**: Lower zoom levels (50%-100%) render lebih cepat
- **Multiple Signatures**: Tidak ada limit, tapi banyak signatures bisa mempengaruhi processing time saat download

## Security & Privacy

### Privacy Features
- ✅ **100% Client-side Processing**: PDF tidak pernah diupload ke server
- ✅ **No Data Storage**: Tidak ada data disimpan di server atau cloud
- ✅ **No Tracking**: Tidak ada analytics atau tracking cookies
- ✅ **Secure HTTPS**: Aplikasi menggunakan HTTPS (jika deployed dengan SSL)
- ✅ **No External Calls**: Semua assets loaded dari local (kecuali PDF.js worker dari CDN)

### Security Measures
- **File Validation**: Hanya accept file dengan extension `.pdf`
- **MIME Type Check**: Validasi MIME type untuk memastikan file adalah PDF
- **Size Limits**: Recommended max 10MB per file (bisa dikonfigurasi)
- **XSS Protection**: React auto-escaping untuk prevent XSS attacks
- **No Code Injection**: User input di-sanitize sebelum digunakan

### Best Practices
1. **Jangan gunakan untuk dokumen dengan level keamanan tinggi** yang memerlukan digital certificate
2. **Review PDF hasil** sebelum sharing ke pihak lain
3. **Gunakan HTTPS** saat deploy untuk enkripsi in-transit
4. **Clear browser cache** setelah menggunakan aplikasi untuk sensitive documents

## Troubleshooting

### PDF tidak muncul / Error loading PDF
**Possible causes:**
- File yang diupload bukan PDF valid atau corrupt
- PDF menggunakan enkripsi atau password protected
- PDF menggunakan format yang tidak supported oleh PDF.js

**Solutions:**
1. Pastikan file adalah PDF valid (coba buka di Adobe Reader)
2. Jika PDF password-protected, unlock terlebih dahulu
3. Convert PDF ke format standard jika menggunakan custom encoding
4. Cek browser console (F12) untuk error messages detail

### Signature tidak bisa di-drag
**Possible causes:**
- Browser tidak support drag functionality
- Signature belum fully loaded
- Conflict dengan zoom atau scroll

**Solutions:**
1. Pastikan signature sudah muncul sempurna di PDF
2. Reset zoom ke 100%
3. Refresh halaman dan coba lagi
4. Gunakan browser yang fully supported (Chrome/Firefox)

### Signature tidak muncul di PDF hasil download
**Possible causes:**
- Signature position diluar bounds PDF page
- Error saat PDF generation
- Browser blocking download

**Solutions:**
1. Pastikan signature berada di dalam area PDF (tidak overflow)
2. Cek browser console untuk error messages
3. Allow downloads di browser settings
4. Coba browser lain

### Download error / PDF corrupt
**Possible causes:**
- PDF terlalu besar
- Memory insufficient
- Browser limitations

**Solutions:**
1. Gunakan PDF dengan ukuran lebih kecil (< 10MB)
2. Tutup tabs/aplikasi lain untuk free up memory
3. Coba di desktop browser (bukan mobile)
4. Clear browser cache dan coba lagi

### Large PDF rendering slow
**Possible causes:**
- PDF memiliki banyak halaman atau high resolution
- Low-end device atau browser performance

**Solutions:**
1. Gunakan zoom level lebih rendah (50-75%)
2. Tutup aplikasi lain untuk free up resources
3. Gunakan pagination - navigate per halaman, bukan scroll all
4. Consider compress PDF sebelum upload
5. Gunakan desktop browser untuk performa lebih baik

### QR Code tidak bisa di-scan
**Possible causes:**
- QR Code terlalu kecil
- Kontras warna tidak cukup
- Error correction level terlalu rendah

**Solutions:**
1. Perbesar ukuran QR Code (minimal 150x150px)
2. Gunakan warna kontras tinggi (hitam-putih)
3. Pilih error correction level "M" atau "Q"
4. Tambahkan margin putih di sekitar QR Code
5. Test scan sebelum finalize PDF

### App tidak load / Blank page
**Possible causes:**
- JavaScript disabled
- Browser tidak supported
- Network issues (PDF.js worker gagal load)

**Solutions:**
1. Enable JavaScript di browser settings
2. Gunakan browser modern (Chrome 90+, Firefox 88+, Safari 14+)
3. Check internet connection (untuk load PDF.js worker dari CDN)
4. Clear browser cache dan reload
5. Try incognito/private mode untuk rule out extension conflicts

### Touch/Mobile issues
**Possible causes:**
- Mobile browser limitations
- Touch events tidak properly handled
- Screen size terlalu kecil

**Solutions:**
1. Gunakan landscape mode untuk screen lebih luas
2. Zoom in untuk precision saat drag signature
3. Consider gunakan desktop browser untuk better experience
4. Use stylus untuk more precise control

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
Tidak ada environment variables yang required untuk basic deployment. Semua konfigurasi ada di code.

## Contributing

Kontribusi sangat welcome! Silakan ikuti guidelines berikut:

### How to Contribute
1. **Fork** the project
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style dan conventions
- Write clear, descriptive commit messages
- Add comments untuk code yang complex
- Test thoroughly sebelum submit PR
- Update documentation jika menambah features
- Ensure no console errors atau warnings

### Areas for Contribution
- 🐛 Bug fixes
- ✨ New features dari roadmap
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🌍 Translations/Internationalization
- ⚡ Performance optimizations

## License

MIT License - lihat [LICENSE](LICENSE) file untuk detail lengkap.

Copyright (c) 2025 E-Sign PDF Contributors

## Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/e-sign-pdf/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/e-sign-pdf/discussions)
- **Email**: your.email@example.com

Project Link: [https://github.com/yourusername/e-sign-pdf](https://github.com/yourusername/e-sign-pdf)

## Acknowledgments

Terima kasih kepada open-source projects yang membuat aplikasi ini possible:

- **[PDF.js](https://mozilla.github.io/pdf.js/)** - Powerful PDF rendering engine by Mozilla
- **[pdf-lib](https://pdf-lib.js.org/)** - Create and modify PDF documents in any JavaScript environment
- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[React](https://react.dev/)** - JavaScript library for building user interfaces
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[react-signature-canvas](https://github.com/agilgur5/react-signature-canvas)** - Signature pad component
- **[react-rnd](https://github.com/bokuweb/react-rnd)** - Resizable and draggable component
- **[qrcode.react](https://github.com/zpao/qrcode.react)** - QR Code component for React

## FAQ

### Apakah aplikasi ini gratis?
Ya, aplikasi ini sepenuhnya gratis dan open-source dengan MIT License.

### Apakah data saya aman?
Sangat aman. Semua proses dilakukan 100% di browser Anda. Tidak ada data yang diupload ke server.

### Apakah bisa digunakan secara offline?
Saat ini memerlukan internet untuk load PDF.js worker. Future version akan support PWA dengan offline mode.

### Apakah tanda tangan sah secara hukum?
Aplikasi ini membuat visual signature, bukan digital certificate. Legalitas tergantung regulasi di negara Anda. Untuk dokumen legal penting, konsultasikan dengan ahli hukum.

### Apakah bisa batch signing banyak PDF sekaligus?
Fitur ini masih dalam roadmap (Phase 3). Saat ini hanya support satu PDF per session.

### Apakah ada limit ukuran file?
Tidak ada hard limit, tapi direkomendasikan < 10MB untuk performa optimal.

### Bagaimana cara melaporkan bug?
Silakan buat issue di [GitHub Issues](https://github.com/yourusername/e-sign-pdf/issues) dengan detail lengkap.

---

**Made with ❤️ using Next.js, React & Tailwind CSS**

⭐ Star project ini jika berguna untuk Anda!
