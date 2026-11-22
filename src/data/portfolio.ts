import type { TechIconId } from '../components/TechIcon';

export type LocaleKey = 'id' | 'en';
export type ThemeMode = 'light' | 'dark';

export interface SocialItem {
  id: string;
  label: string;
  handle: string;
  url: string;
}

export interface CapabilityItem {
  id: string;
  index: string;
  name: string;
  detail: string;
}

export interface StackItem {
  icon: TechIconId;
  name: string;
  role: string;
}

export interface StackGroup {
  id: string;
  label: string;
  items: StackItem[];
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectMediaItem {
  src: string;
  alt: string;
  caption: string;
  placeholderCode: string;
  placeholderHint: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  year: string;
  role: string;
  summary: string;
  previewCode?: string;
  previewCaption?: string;
  statusBadge?: string;
  mediaLayout?: 'wide' | 'grid' | 'mobile';
  media?: ProjectMediaItem[];
  specs?: ProjectSpec[];
  highlightsTitle?: string;
  highlights?: string[];
  context?: string;
  approach?: string;
  outcome?: string;
  stack: string[];
  liveUrl: string;
  repoUrl: string;
}

export interface LocaleContent {
  meta: {
    title: string;
    description: string;
  };
  ui: {
    skipToMain: string;
    navLabel: string;
    mobileNavLabel: string;
    menuOpen: string;
    menuClose: string;
    menuTitle: string;
    themeToDark: string;
    themeToLight: string;
    themeDarkLabel: string;
    themeLightLabel: string;
    langToggleLabel: string;
    navItems: { href: string; id: string; index: string; label: string }[];
    backToTop: string;
    footerNavLabel: string;
    footerEditHint: string;
    cursorView: string;
    cursorCopy: string;
    cursorTop: string;
    scrollLabel: string;
    resumeBtn: string;
    resumeAria: string;
  };
  brand: {
    wordmark: string;
    copyright: string;
  };
  hero: {
    status: string;
    headline: string;
    role: string;
    summary: string;
    primaryCta: string;
    secondaryCta: string;
    kineticStrip: string[];
  };
  about: {
    index: string;
    title: string;
    statement: string;
    paragraphs: string[];
    meta: { label: string; value: string }[];
    capabilitiesTitle: string;
    capabilitiesHint: string;
    capabilities: CapabilityItem[];
    stackTitle: string;
    stackTablistLabel: string;
    stackGroups: StackGroup[];
  };
  works: {
    index: string;
    title: string;
    hoverHint: string;
    frameRatio: string;
    frameNote: string;
    loadingTitle: string;
    loadingDesc: string;
    errorTitle: string;
    errorDesc: string;
    errorRetry: string;
    emptyNoDataTitle: string;
    emptyNoDataDesc: string;
    contextLabel: string;
    approachLabel: string;
    outcomeLabel: string;
    architectureLabel: string;
    coreStackLabel: string;
    databaseLabel: string;
    highlightsLabel: string;
    liveCta: string;
    livePending: string;
    repoCta: string;
    repoPending: string;
    lightboxOpenHint: string;
    lightboxClose: string;
    lightboxPrev: string;
    lightboxNext: string;
    items: ProjectItem[];
  };
  contact: {
    index: string;
    title: string;
    lead: string;
    emailLabel: string;
    copyEmailBtn: string;
    copiedEmailBtn: string;
    copiedAnnouncement: string;
    copyFailedAnnouncement: string;
    openMailBtn: string;
    socialNotLinked: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      subjectLabel: string;
      subjectPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitBtn: string;
      submittingBtn: string;
      resetBtn: string;
      errorSummaryPrefix: string;
      errName: string;
      errEmailRequired: string;
      errEmailInvalid: string;
      errSubject: string;
      errMessage: string;
      previewSuccessTitle: string;
      previewSuccessDesc: string;
      openDraftMailBtn: string;
      liveSuccessTitle: string;
      liveSuccessDesc: string;
      networkErrorTitle: string;
      networkErrorDesc: string;
    };
  };
}

// Single source of truth for portfolio content.
// Replace contactEmail, socials, and works.items with your real links and projects.
export const portfolioConfig = {
  // TODO: Set formEndpoint (e.g. Formspree or API route) for live email delivery.
  formEndpoint: '',
  // TODO: Set projectsEndpoint if loading project JSON remotely instead of local data.
  projectsEndpoint: '',
  contactEmail: 'raka4100@gmail.com',
  resumeUrl: '/CV_Raka%20Andhika.pdf',
  socials: [
    { id: 'github', label: 'GitHub', handle: 'Fru33er', url: 'https://github.com/Fru33er' },
    { id: 'linkedin', label: 'LinkedIn', handle: 'Raka Andhika', url: 'https://linkedin.com/in/rakaandhika' },
    { id: 'Behance', label: 'Behance', handle: 'Dankara', url: 'https://www.behance.net/dankara' },
    { id: 'instagram', label: 'Instagram', handle: 'an.raka', url: 'https://instagram.com/an.raka' }
  ] satisfies SocialItem[]
};

export const portfolioLocales: Record<LocaleKey, LocaleContent> = {
  id: {
    meta: {
      title: 'Raka Andhika | Software Engineer, Web Developer & Graphic Designer',
      description: 'Portofolio Raka Andhika, Software Engineer, Web Developer, dan Graphic Designer berbasis di Bogor, Indonesia. Pengembang backend Satubumi dan sistem Android AR UIKA Navigator.'
    },
    ui: {
      skipToMain: 'Langsung ke konten utama',
      navLabel: 'Navigasi utama',
      mobileNavLabel: 'Navigasi seluler',
      menuOpen: 'Buka menu navigasi',
      menuClose: 'Tutup menu navigasi',
      menuTitle: 'Navigasi',
      themeToDark: 'Ganti ke mode gelap',
      themeToLight: 'Ganti ke mode terang',
      themeDarkLabel: 'Gelap',
      themeLightLabel: 'Terang',
      langToggleLabel: 'Ganti bahasa ke Inggris',
      navItems: [
        { href: '#tentang', id: 'tentang', index: '01', label: 'Tentang' },
        { href: '#karya', id: 'karya', index: '02', label: 'Karya' },
        { href: '#kontak', id: 'kontak', index: '03', label: 'Kontak' }
      ],
      backToTop: 'Balik ke atas',
      footerNavLabel: 'Navigasi footer',
      footerEditHint: 'Bogor, Indonesia',
      cursorView: 'LIHAT',
      cursorCopy: 'SALIN',
      cursorTop: 'ATAS',
      scrollLabel: 'GULIR',
      resumeBtn: 'Résumé',
      resumeAria: 'Buka Résumé Raka Andhika di tab baru (PDF)'
    },
    brand: {
      wordmark: 'Raka Andhika',
      copyright: '© 2026 Raka Andhika. Hak cipta dilindungi.'
    },
    hero: {
      status: 'TERBUKA BUAT PROYEK FREELANCE · BOGOR, INDONESIA',
      headline: 'Raka Andhika',
      role: 'Software Engineer, Web Developer & Graphic Designer',
      summary: 'Developer dan graphic designer umur 23 tahun asal Bogor. Aku ngerjain sisi teknis sekaligus visualnya, jadi web dan produk digital yang kubangun jalan rapi dan enak dilihat.',
      primaryCta: 'Cek hasil karya',
      secondaryCta: 'Ajak ngobrol',
      kineticStrip: [
        '01 SOFTWARE ENGINEERING',
        '02 WEB DEVELOPMENT',
        '03 GRAPHIC DESIGN',
        '04 REACT, NEXT.JS & LARAVEL',
        '05 KOTLIN, FASTAPI & FIGMA'
      ]
    },
    about: {
      index: '01',
      title: 'Tentang aku',
      statement: 'Ngoding jalan, visual juga aman. Dua-duanya aku pegang dalam satu alur kerja.',
      paragraphs: [
        'Hai, aku Raka Andhika, developer dan graphic designer umur 23 tahun yang berbasis di Bogor. Awalnya kenal dunia pemrograman waktu kuliah di Universitas Ibn Khaldun Bogor. Yang tadinya cuma tugas kampus, lama-lama malah jadi kesukaan sendiri tiap kali bikin sesuatu dari baris kode.',
        'Di tengah jalan, aku juga kepincut sama desain grafis. Dari situ aku jadi terbiasa ngerjain sisi teknis sekaligus kreatifnya. Setelah lulus S1 Teknik Informatika dari Universitas Ibn Khaldun Bogor, aku gabungin pengalaman ngoding dan desain visual buat ngebangun produk digital yang fungsional dan punya tampilan jelas.'
      ],
      meta: [
        { label: 'Peran', value: 'Software Engineer, Web Developer & Graphic Designer' },
        { label: 'Domisili', value: 'Bogor, Indonesia' },
        { label: 'Pendidikan', value: 'S1 Teknik Informatika, Universitas Ibn Khaldun Bogor' },
        { label: 'Status', value: 'Terbuka buat proyek freelance' }
      ],
      capabilitiesTitle: 'Yang biasa aku kerjain',
      capabilitiesHint: 'Arahkan kursor buat lihat detailnya',
      capabilities: [
        {
          id: 'cap-1',
          index: '01',
          name: 'Web Development',
          detail: 'Bikin website dan aplikasi web pakai HTML5, CSS3, JavaScript, React, Next.js, PHP/Laravel, sampai Python/FastAPI sesuai kebutuhan proyekmu.'
        },
        {
          id: 'cap-2',
          index: '02',
          name: 'Software & Backend Engineering',
          detail: 'Nyusun struktur aplikasi pakai Kotlin, Python, atau PHP, bangun API, rapihin database SQL dan PostgreSQL, plus setup alur kerja rapi pakai Docker dan Git.'
        },
        {
          id: 'cap-3',
          index: '03',
          name: 'Graphic & Visual Design',
          detail: 'Ngerjain aset grafis di Adobe Creative Suite dan layout antarmuka di Figma supaya tampilan visualnya nyambung sama fungsi produknya.'
        }
      ],
      stackTitle: 'Tech stack andalan',
      stackTablistLabel: 'Kategori tech stack',
      stackGroups: [
        {
          id: 'languages',
          label: 'Bahasa & Web',
          items: [
            { icon: 'python', name: 'Python', role: 'Backend & otomasi logika' },
            { icon: 'javascript', name: 'JavaScript', role: 'Logika & interaksi di web' },
            { icon: 'kotlin', name: 'Kotlin', role: 'Pengembangan aplikasi & JVM' },
            { icon: 'php', name: 'PHP', role: 'Pengembangan web sisi server' },
            { icon: 'htmlcss', name: 'HTML5 & CSS3', role: 'Struktur & styling antarmuka' }
          ]
        },
        {
          id: 'frameworks',
          label: 'Framework & Data',
          items: [
            { icon: 'react', name: 'React', role: 'Library antarmuka interaktif' },
            { icon: 'nextjs', name: 'Next.js', role: 'Framework web full-stack React' },
            { icon: 'laravel', name: 'Laravel', role: 'Framework web PHP' },
            { icon: 'fastapi', name: 'FastAPI', role: 'Framework API Python' },
            { icon: 'sql', name: 'SQL', role: 'Kueri & struktur data relasional' },
            { icon: 'postgresql', name: 'PostgreSQL', role: 'Database relasional utama' }
          ]
        },
        {
          id: 'design-tools',
          label: 'Desain & Alat Kerja',
          items: [
            { icon: 'figma', name: 'Figma', role: 'Desain UI & prototipe' },
            { icon: 'adobe', name: 'Adobe Creative Suite', role: 'Desain grafis & aset visual' },
            { icon: 'docker', name: 'Docker', role: 'Kontainerisasi environment' },
            { icon: 'github', name: 'Git / GitHub', role: 'Kontrol versi & kolaborasi kode' }
          ]
        }
      ]
    },
    works: {
      index: '02',
      title: 'Hasil karya',
      hoverHint: 'Arahkan kursor ke baris karya buat intip detailnya',
      frameRatio: '16:10',
      frameNote: 'Placeholder visual proyek',
      loadingTitle: 'Lagi memuat daftar karya',
      loadingDesc: 'Sedang mengambil data hasil karya dari sumber yang dikonfigurasi.',
      errorTitle: 'Daftar karya gagal dimuat',
      errorDesc: 'Ada kendala waktu membaca data karya. Cek sumber datanya atau coba muat ulang.',
      errorRetry: 'Muat ulang karya',
      emptyNoDataTitle: 'Belum ada karya yang masuk',
      emptyNoDataDesc: 'Tambahkan daftar proyekmu di src/data/portfolio.ts supaya langsung tampil di sini.',
      contextLabel: 'Konteks masalah',
      approachLabel: 'Pendekatan kerja',
      outcomeLabel: 'Hasil nyata',
      architectureLabel: 'Arsitektur',
      coreStackLabel: 'Core stack',
      databaseLabel: 'Database',
      highlightsLabel: 'Sorotan engineering utama',
      liveCta: 'Kunjungi situs',
      livePending: 'Demo langsung belum ditautkan',
      repoCta: 'Lihat repositori',
      repoPending: 'Repositori belum ditautkan',
      lightboxOpenHint: 'Klik untuk perbesar',
      lightboxClose: 'Tutup pratinjau gambar',
      lightboxPrev: 'Gambar sebelumnya',
      lightboxNext: 'Gambar berikutnya',
      items: [
        {
          id: 'work-01',
          index: '01',
          title: 'Satubumi',
          year: '2026',
          role: 'Backend Engineer',
          previewCode: 'SB/01',
          previewCaption: 'satubumi.org',
          mediaLayout: 'wide',
          media: [
            {
              src: '/images/projects/satubumi.webp',
              alt: 'Halaman utama platform Satubumi untuk inisiatif restorasi ekologi dan proyek karbon',
              caption: '01 · Beranda Platform Satubumi',
              placeholderCode: 'FIG. 01',
              placeholderHint: 'satubumi.webp'
            },
            {
              src: '/images/projects/satubumi2.webp',
              alt: 'Antarmuka Rapid-FS Scoring untuk unggah shapefile peta proyek dan analisis kelayakan karbon',
              caption: '02 · Rapid-FS Spatial & Quick Scoring',
              placeholderCode: 'FIG. 02',
              placeholderHint: 'satubumi2.webp'
            },
            {
              src: '/images/projects/satubumi3.webp',
              alt: 'Hasil uji kelayakan karbon Satubumi beserta estimasi kredit karbon, pendapatan, dan konversi mata uang',
              caption: '03 · Laporan Kelayakan & Konversi Mata Uang',
              placeholderCode: 'FIG. 03',
              placeholderHint: 'satubumi3.webp'
            }
          ],
          summary: 'Satubumi adalah ekosistem backend kelas enterprise yang dirancang untuk restorasi ekologi digital, uji kelayakan proyek karbon, dan nature-based solutions (NbS). Dibangun di atas FastAPI dan PostgreSQL, sistem ini menghubungkan telemetri penginderaan jauh dengan API berkonkurensi tinggi melalui dua pilar utama: Carbon Assessment Engine (pipeline kelayakan ICPFS 7 tahap) dan Satubumi Monitor, platform Digital Measurement, Reporting, and Verification (MRV) yang memantau ekosistem hidup dari orbit satelit hingga kelangsungan hidup tiap pohon di lapangan.',
          specs: [
            { label: 'Arsitektur', value: 'Layered Service Pattern (Router / Service / Model)' },
            { label: 'Core stack', value: 'Python 3.11+ · FastAPI · Starlette · Pydantic v2' },
            { label: 'Database', value: 'PostgreSQL · SQLAlchemy 2.0 · Alembic' }
          ],
          highlights: [
            'Rapid-FS Carbon Feasibility Engine (7-Stage ICPFS)',
            'Digital MRV & 7-Layer GIS Streaming',
            'Real-Time Ecological Alert Engine',
            'Stateless JWT Security & Dynamic Masking',
            'Automated MRV Reporting & Currency Gateway'
          ],
          stack: ['Python 3.11+', 'FastAPI', 'Starlette', 'Pydantic v2', 'PostgreSQL', 'SQLAlchemy 2.0', 'Alembic'],
          liveUrl: 'https://satubumi.org',
          repoUrl: ''
        },
        {
          id: 'work-02',
          index: '02',
          title: 'UIKA Navigator System',
          year: '2026',
          role: 'Lead Android & AR Engineer (Skripsi)',
          previewCode: 'UN/02',
          statusBadge: 'Android AR · Skripsi',
          mediaLayout: 'wide',
          media: [
            {
              src: '/images/projects/uika-navigator.webp',
              alt: 'Empat tampilan aplikasi Android UIKA Navigator System: deteksi plang gedung RISE, panah navigasi AR 3D di jalur kampus, orientasi kamera AR, dan pencarian lokasi fakultas',
              caption: '01 · Navigasi AR 3D, Kalibrasi OCR, Orientasi Kamera & Cari Lokasi',
              placeholderCode: 'FIG. 01',
              placeholderHint: 'uika-navigator.webp'
            }
          ],
          summary: 'UIKA Navigator adalah aplikasi navigasi kampus luar ruang berbasis Augmented Reality (AR) untuk Universitas Ibn Khaldun (UIKA) Bogor sebagai proyek Skripsi. Menemukan gedung fakultas, auditorium, pusat administrasi, dan fasilitas kampus di area universitas yang luas sering membingungkan mahasiswa baru maupun tamu. Aplikasi ini memproyeksikan panah 3D melayang, titik waypoint, dan label penanda gedung secara real-time di atas tampilan kamera ponsel, menggabungkan Google ARCore motion tracking, ML Kit OCR untuk memindai plang gedung demi kalibrasi pose otomatis, mesin pencarian rute graf spasial A*, serta penghalusan lintasan Bézier Spline agar petunjuk arah terasa mulus di jalur pejalan kaki.',
          specs: [
            { label: 'Arsitektur', value: 'Clean Architecture · MVVM · Dagger-Hilt DI' },
            { label: 'Core stack', value: 'Kotlin 100% · Android SDK (Min SDK 24) · Jetpack' },
            { label: 'Database', value: 'Firebase Firestore (Cloud) · Room SQLite (Cache)' },
            { label: 'AR & 3D engine', value: 'Google ARCore SDK · SceneView (Filament Engine)' }
          ],
          highlights: [
            'Outdoor Pose Alignment via ML Kit OCR',
            'Outdoor Campus A* Spatial Graph Engine',
            'Bézier Spline Walkway Smoothing',
            'Dual-Flavored Architecture (Admin Mapping & User Wayfinder)',
            'Reactive Clean Architecture & MVVM with Dagger-Hilt'
          ],
          stack: ['Kotlin', 'Android SDK', 'Jetpack', 'Google ARCore', 'SceneView (Filament)', 'Firebase Firestore', 'Room SQLite', 'Dagger-Hilt'],
          liveUrl: '',
          repoUrl: ''
        },
        {
          id: 'work-03',
          index: '03',
          title: 'Sakuin',
          year: '2026',
          role: 'UI/UX Designer (Personal Project)',
          previewCode: 'SK/03',
          statusBadge: 'UI/UX · Personal Project',
          mediaLayout: 'mobile',
          media: [
            {
              src: '/images/projects/sakuin/sakuin-01-beranda.webp',
              alt: 'Layar Beranda Sakuin menampilkan Jatah Jajan Hari Ini, streak mingguan, dan daftar transaksi harian',
              caption: '01 · Beranda',
              placeholderCode: 'FIG. 01',
              placeholderHint: 'sakuin-01-beranda.webp'
            },
            {
              src: '/images/projects/sakuin/sakuin-02-catat.webp',
              alt: 'Layar Catat Cepat Sakuin dengan refleksi tag Butuh, Pengen aja, dan Lapar mata',
              caption: '02 · Catat',
              placeholderCode: 'FIG. 02',
              placeholderHint: 'sakuin-02-catat.webp'
            },
            {
              src: '/images/projects/sakuin/sakuin-03-habit.webp',
              alt: 'Layar Habit Kamu di Sakuin menampilkan streak aktif, tantangan anti-boncos, dan misi harian',
              caption: '03 · Habit',
              placeholderCode: 'FIG. 03',
              placeholderHint: 'sakuin-03-habit.webp'
            },
            {
              src: '/images/projects/sakuin/sakuin-04-pantau.webp',
              alt: 'Layar Pantau Cek Ombak di Sakuin menampilkan grafik pengeluaran mingguan, Radar Bocor Halus, dan Celengan Target',
              caption: '04 · Pantau',
              placeholderCode: 'FIG. 04',
              placeholderHint: 'sakuin-04-pantau.webp'
            }
          ],
          summary: 'Sakuin adalah konsep desain aplikasi mobile pencatatan keuangan berbasis pembentukan habit yang dirancang khusus untuk anak muda Indonesia. Banyak pengguna cepat berhenti memakai aplikasi finance tracker karena terasa kaku, rumit, atau bikin stres, sementara pengeluaran impulsif (bocor halus) terus berjalan tanpa terasa. Alih-alih sekadar buku kas, Sakuin membantu pengguna menyadari pola jajan dan memperbaiki kebiasaan finansial sedikit demi sedikit lewat pengalaman harian yang ringan dan suportif.',
          specs: [
            { label: 'Arah visual', value: 'Cheerful Minimalist (#F6F7F9 & #FFFFFF · Lime, Yellow, Coral, Mint, Sky)' },
            { label: 'Sistem & tipografi', value: 'Plus Jakarta Sans & DM Mono · 390 × 844 px · Reusable Components' },
            { label: 'Gaya copywriting', value: 'Bahasa Indonesia santai, jujur & relatable tanpa emoji ("Aman pol", "Cek Ombak")' },
            { label: 'Fokus UX', value: 'Batas jajan harian, refleksi habit, gamifikasi ringan & evaluasi visual' }
          ],
          highlightsTitle: 'Pendekatan desain & solusi',
          highlights: [
            'Beranda (Batas Jajan Harian): Fokus ke Jatah Jajan Hari Ini tanpa hitung manual, lengkap dengan strip streak mingguan dan pengingat jajan berulang.',
            'Catat (Pencatatan Cepat + Kesadaran Habit): Refleksi singkat lewat tag Butuh, Pengen aja, atau Lapar mata sebelum menyimpan transaksi.',
            'Habit (Gamifikasi Ringan): Streak harian, tantangan anti-boncos (No Checkout Tengah Malam & Rem Ngopi), serta misi harian bertahap.',
            'Pantau (Cek Ombak): Grafik pengeluaran mingguan, Radar Bocor Halus (Butuh vs Impulsif), dan progres Celengan Target dalam satu pandangan.'
          ],
          stack: ['Figma', 'UI/UX Design', 'Design System', 'UX Copywriting', 'Mobile App (390×844)'],
          liveUrl: '',
          repoUrl: ''
        },
        {
          id: 'work-04',
          index: '04',
          title: 'Sona',
          year: '2026',
          role: 'UI/UX Designer (Personal Project)',
          previewCode: 'SN/04',
          statusBadge: 'UI/UX · Personal Project',
          mediaLayout: 'mobile',
          media: [
            {
              src: '/images/projects/sona/sona-01-listen-now.webp',
              alt: 'Layar Home Listen Now di Sona dengan mood pills, grid Quick Picks 2x2, kartu Curated Mix, dan rak Jump Back In',
              caption: '01 · Listen Now',
              placeholderCode: 'FIG. 01',
              placeholderHint: 'sona-01-listen-now.webp'
            },
            {
              src: '/images/projects/sona/sona-02-now-playing.webp',
              alt: 'Layar Now Playing di Sona dengan artwork 1:1 penuh, indikator LOSSLESS, kontrol kaca taktil, dan pill AirPods Pro, Lyrics, Up Next',
              caption: '02 · Now Playing',
              placeholderCode: 'FIG. 02',
              placeholderHint: 'sona-02-now-playing.webp'
            },
            {
              src: '/images/projects/sona/sona-03-search-explore.webp',
              alt: 'Layar Search & Explore di Sona dengan kolom pencarian kaca mengambang, trending chips, dan ubin genre berlapis kaca',
              caption: '03 · Search & Explore',
              placeholderCode: 'FIG. 03',
              placeholderHint: 'sona-03-search-explore.webp'
            },
            {
              src: '/images/projects/sona/sona-04-library.webp',
              alt: 'Layar Library di Sona dengan filter kategori bersih, kartu Liked Songs, dan daftar editorial Recently Added bergaris tipis',
              caption: '04 · Library',
              placeholderCode: 'FIG. 04',
              placeholderHint: 'sona-04-library.webp'
            }
          ],
          summary: 'Sona adalah konsep desain aplikasi pemutar musik iOS minimalis yang menghadirkan alternatif lebih tenang dibandingkan aplikasi streaming modern yang sering penuh grid padat dan banner promosi. Dengan pendekatan minimalisme ala Apple dan materialitas optical glassmorphism, Sona menempatkan sampul album serta kontrol pemutaran sebagai fokus utama di atas kanvas obsidian gelap dengan kedalaman visual yang bersih dan nyaman dijangkau ibu jari.',
          specs: [
            { label: 'Platform & proporsi', value: 'iOS Mobile (393 × 852 px) · Framing sampul 1:1 · Kontrol ramah ibu jari' },
            { label: 'Cakupan kerja', value: 'Visual Direction · Design Tokens · Component Library · Core Screen Flows' },
            { label: 'Arah visual', value: 'Optical Glass (backdrop blur, specular 1px) · Obsidian (#090A0F) · Inter · Coral (#FA3C5A)' },
            { label: 'Sistem komponen', value: 'Token warna & tipografi · iOS Status Bar · Synced Mini Player · Liquid Glass Tab Bar' }
          ],
          highlightsTitle: 'Layar utama & sistem desain',
          highlights: [
            'Listen Now (Home): Pil filter mood, grid Quick Picks 2×2 yang ringkas, kartu hero Curated Mix ber-footer kaca buram, dan rak album Jump Back In.',
            'Now Playing: Tampilan pemutaran imersif dengan ambient color bloom, artwork 1:1 penuh, scrubber minimalis + indikator LOSSLESS, dan utilitas AirPods Pro, Lyrics, Up Next.',
            'Search & Explore: Kolom pencarian kaca mengambang dengan input suara, chip pencarian tren, kartu artis Recently Searched, dan ubin genre berlapis kaca.',
            'Library: Filter kategori bersih, kartu kaca Liked Songs tersemat, serta daftar editorial Recently Added bersekat garis tipis tanpa pengulangan kotak kartu.'
          ],
          stack: ['Figma', 'iOS UI/UX', 'Design Tokens', 'Component Library', 'Glassmorphism'],
          liveUrl: '',
          repoUrl: ''
        }
        // Tambahkan karya berikutnya di sini (work-05, dst.) dengan struktur yang sama.
      ]
    },
    contact: {
      index: '03',
      title: 'Kontak',
      lead: 'Lagi cari partner freelance buat web development, software engineering, atau desain grafis? Kirim aja brief singkatmu lewat form ini atau langsung email.',
      emailLabel: 'Email langsung',
      copyEmailBtn: 'Salin email',
      copiedEmailBtn: 'Email udah disalin',
      copiedAnnouncement: 'Alamat email berhasil disalin ke papan klip.',
      copyFailedAnnouncement: 'Gagal menyalin otomatis. Salin alamat email secara manual ya.',
      openMailBtn: 'Kirim lewat email',
      socialNotLinked: 'Belum ditautkan',
      form: {
        nameLabel: 'Nama',
        namePlaceholder: 'Nama kamu',
        emailLabel: 'Email',
        emailPlaceholder: 'email@example.com',
        subjectLabel: 'Subjek',
        subjectPlaceholder: 'Mau bahas proyek apa?',
        messageLabel: 'Pesan',
        messagePlaceholder: 'Ceritain singkat kebutuhan proyek atau pesanmu di sini...',
        submitBtn: 'Kirim pesan',
        submittingBtn: 'Lagi ngirim...',
        resetBtn: 'Kirim pesan lagi',
        errorSummaryPrefix: 'Cek lagi kolom berikut sebelum kirim:',
        errName: 'Isi namamu dulu ya.',
        errEmailRequired: 'Isi alamat email dulu ya.',
        errEmailInvalid: 'Format emailnya belum pas (contoh: email@example.com).',
        errSubject: 'Isi subjek singkatnya dulu.',
        errMessage: 'Tulis pesan minimal 10 karakter biar konteksnya jelas.',
        previewSuccessTitle: 'Pesan tervalidasi (mode pratinjau)',
        previewSuccessDesc: 'Endpoint form belum dihubungkan di src/data/portfolio.ts. Kamu bisa langsung lanjut kirim lewat aplikasi email dengan isi pesan yang sama.',
        openDraftMailBtn: 'Lanjut di aplikasi email',
        liveSuccessTitle: 'Pesan berhasil terkirim',
        liveSuccessDesc: 'Terima kasih, pesanmu udah masuk.',
        networkErrorTitle: 'Pengiriman gagal',
        networkErrorDesc: 'Koneksi ke endpoint form lagi bermasalah. Coba kirim ulang atau pakai tautan email langsung.'
      }
    }
  },

  en: {
    meta: {
      title: 'Raka Andhika | Software Engineer, Web Developer & Graphic Designer',
      description: 'Portfolio of Raka Andhika, a Software Engineer, Web Developer, and Graphic Designer based in Bogor, Indonesia. Builder of Satubumi backend architecture and UIKA Navigator AR system.'
    },
    ui: {
      skipToMain: 'Skip to main content',
      navLabel: 'Primary navigation',
      mobileNavLabel: 'Mobile navigation',
      menuOpen: 'Open navigation menu',
      menuClose: 'Close navigation menu',
      menuTitle: 'Navigation',
      themeToDark: 'Switch to dark mode',
      themeToLight: 'Switch to light mode',
      themeDarkLabel: 'Dark',
      themeLightLabel: 'Light',
      langToggleLabel: 'Switch language to Indonesian',
      navItems: [
        { href: '#tentang', id: 'tentang', index: '01', label: 'About' },
        { href: '#karya', id: 'karya', index: '02', label: 'Work' },
        { href: '#kontak', id: 'kontak', index: '03', label: 'Contact' }
      ],
      backToTop: 'Back to top',
      footerNavLabel: 'Footer navigation',
      footerEditHint: 'Bogor, Indonesia',
      cursorView: 'VIEW',
      cursorCopy: 'COPY',
      cursorTop: 'TOP',
      scrollLabel: 'SCROLL',
      resumeBtn: 'Résumé',
      resumeAria: 'Open Raka Andhika Résumé in a new tab (PDF)'
    },
    brand: {
      wordmark: 'Raka Andhika',
      copyright: '© 2026 Raka Andhika. All rights reserved.'
    },
    hero: {
      status: 'OPEN FOR FREELANCE PROJECTS · BOGOR, INDONESIA',
      headline: 'Raka Andhika',
      role: 'Software Engineer, Web Developer & Graphic Designer',
      summary: "I'm a 23-year-old developer and graphic designer based in Bogor, Indonesia. I handle both the code and the visuals so web products work cleanly and look sharp.",
      primaryCta: 'Check out my work',
      secondaryCta: 'Say hi',
      kineticStrip: [
        '01 SOFTWARE ENGINEERING',
        '02 WEB DEVELOPMENT',
        '03 GRAPHIC DESIGN',
        '04 REACT, NEXT.JS & LARAVEL',
        '05 KOTLIN, FASTAPI & FIGMA'
      ]
    },
    about: {
      index: '01',
      title: 'About me',
      statement: 'Clean code on one side, sharp visual design on the other, built in one workflow.',
      paragraphs: [
        "Hey, I'm Raka Andhika, a 23-year-old developer and graphic designer from Bogor, Indonesia. I picked up programming during my studies at Universitas Ibn Khaldun Bogor. What started as coursework turned into a real habit of building things with code.",
        "Along the way, I got into graphic design too, which gave me a footing on both the technical and creative sides of digital work. After earning my Bachelor's degree in Informatics Engineering from Universitas Ibn Khaldun Bogor, I bring coding and visual craft together to ship digital experiences that work well and look the part."
      ],
      meta: [
        { label: 'Role', value: 'Software Engineer, Web Developer & Graphic Designer' },
        { label: 'Location', value: 'Bogor, Indonesia' },
        { label: 'Education', value: "B.Sc. in Informatics Engineering, Universitas Ibn Khaldun Bogor" },
        { label: 'Status', value: 'Open for freelance projects' }
      ],
      capabilitiesTitle: 'What I work on',
      capabilitiesHint: 'Hover a row to see the details',
      capabilities: [
        {
          id: 'cap-1',
          index: '01',
          name: 'Web Development',
          detail: 'Building websites and web apps with HTML5, CSS3, JavaScript, React, Next.js, PHP/Laravel, and Python/FastAPI tailored to what the project needs.'
        },
        {
          id: 'cap-2',
          index: '02',
          name: 'Software & Backend Engineering',
          detail: 'Structuring software in Kotlin, Python, or PHP, building APIs, managing SQL and PostgreSQL databases, and keeping environments tidy with Docker and Git.'
        },
        {
          id: 'cap-3',
          index: '03',
          name: 'Graphic & Visual Design',
          detail: 'Crafting graphic assets in Adobe Creative Suite and clean interface layouts in Figma so the visual direction backs up the product.'
        }
      ],
      stackTitle: 'Tools & stack',
      stackTablistLabel: 'Tech stack categories',
      stackGroups: [
        {
          id: 'languages',
          label: 'Languages & Web',
          items: [
            { icon: 'python', name: 'Python', role: 'Backend & application logic' },
            { icon: 'javascript', name: 'JavaScript', role: 'Web logic & interactivity' },
            { icon: 'kotlin', name: 'Kotlin', role: 'Application & JVM development' },
            { icon: 'php', name: 'PHP', role: 'Server-side web development' },
            { icon: 'htmlcss', name: 'HTML5 & CSS3', role: 'Semantic markup & styling' }
          ]
        },
        {
          id: 'frameworks',
          label: 'Frameworks & Data',
          items: [
            { icon: 'react', name: 'React', role: 'Interactive UI library' },
            { icon: 'nextjs', name: 'Next.js', role: 'Full-stack React web framework' },
            { icon: 'laravel', name: 'Laravel', role: 'PHP web framework' },
            { icon: 'fastapi', name: 'FastAPI', role: 'Python API framework' },
            { icon: 'sql', name: 'SQL', role: 'Relational querying & schema design' },
            { icon: 'postgresql', name: 'PostgreSQL', role: 'Primary relational database' }
          ]
        },
        {
          id: 'design-tools',
          label: 'Design & Workflow',
          items: [
            { icon: 'figma', name: 'Figma', role: 'UI design & prototyping' },
            { icon: 'adobe', name: 'Adobe Creative Suite', role: 'Graphic design & visual assets' },
            { icon: 'docker', name: 'Docker', role: 'Containerized environments' },
            { icon: 'github', name: 'Git / GitHub', role: 'Version control & collaboration' }
          ]
        }
      ]
    },
    works: {
      index: '02',
      title: 'Selected works',
      hoverHint: 'Hover any row to preview the details',
      frameRatio: '16:10',
      frameNote: 'Project visual placeholder',
      loadingTitle: 'Loading selected works',
      loadingDesc: 'Fetching project entries from the configured data source.',
      errorTitle: 'Could not load works',
      errorDesc: 'Something went wrong while reading the project data. Check the source or try reloading.',
      errorRetry: 'Reload works',
      emptyNoDataTitle: 'No works added yet',
      emptyNoDataDesc: 'Add project entries in src/data/portfolio.ts to display them in this section.',
      contextLabel: 'Problem context',
      approachLabel: 'Approach',
      outcomeLabel: 'Outcome',
      architectureLabel: 'Architecture',
      coreStackLabel: 'Core stack',
      databaseLabel: 'Database',
      highlightsLabel: 'Key engineering highlights',
      liveCta: 'Visit live site',
      livePending: 'Live demo not linked yet',
      repoCta: 'View repository',
      repoPending: 'Repository not linked yet',
      lightboxOpenHint: 'Click to expand',
      lightboxClose: 'Close image preview',
      lightboxPrev: 'Previous image',
      lightboxNext: 'Next image',
      items: [
        {
          id: 'work-01',
          index: '01',
          title: 'Satubumi',
          year: '2026',
          role: 'Backend Engineer',
          previewCode: 'SB/01',
          previewCaption: 'satubumi.org',
          mediaLayout: 'wide',
          media: [
            {
              src: '/images/projects/satubumi.webp',
              alt: 'Satubumi sustainability initiative landing page',
              caption: '01 · Satubumi Platform Overview',
              placeholderCode: 'FIG. 01',
              placeholderHint: 'satubumi.webp'
            },
            {
              src: '/images/projects/satubumi2.webp',
              alt: 'Rapid-FS Scoring interface for spatial shapefile upload and carbon feasibility analysis',
              caption: '02 · Rapid-FS Spatial & Quick Scoring',
              placeholderCode: 'FIG. 02',
              placeholderHint: 'satubumi2.webp'
            },
            {
              src: '/images/projects/satubumi3.webp',
              alt: 'Carbon feasibility scoring breakdown, estimated carbon credits, revenue metrics, and currency conversion',
              caption: '03 · Feasibility Score & Currency Gateway',
              placeholderCode: 'FIG. 03',
              placeholderHint: 'satubumi3.webp'
            }
          ],
          summary: 'Satubumi is an enterprise-grade backend ecosystem engineered to power digital ecological restoration, carbon project feasibility, and nature-based solutions (NbS). Built on a modern FastAPI and PostgreSQL stack, it bridges complex remote-sensing telemetry with clean, high-concurrency APIs. The system runs two mission-critical pillars: the Carbon Assessment Engine (featuring the 7-stage ICPFS feasibility pipeline) and Satubumi Monitor, a full-fledged Digital Measurement, Reporting, and Verification (MRV) platform tracking living ecosystems from satellite orbits down to individual tree survival on the ground.',
          specs: [
            { label: 'Architecture', value: 'Layered Service Pattern (Router / Service / Model)' },
            { label: 'Core stack', value: 'Python 3.11+ · FastAPI · Starlette · Pydantic v2' },
            { label: 'Database', value: 'PostgreSQL · SQLAlchemy 2.0 · Alembic' }
          ],
          highlights: [
            'Rapid-FS Carbon Feasibility Engine (7-Stage ICPFS)',
            'Digital MRV & 7-Layer GIS Streaming',
            'Real-Time Ecological Alert Engine',
            'Stateless JWT Security & Dynamic Masking',
            'Automated MRV Reporting & Currency Gateway'
          ],
          stack: ['Python 3.11+', 'FastAPI', 'Starlette', 'Pydantic v2', 'PostgreSQL', 'SQLAlchemy 2.0', 'Alembic'],
          liveUrl: 'https://satubumi.org',
          repoUrl: ''
        },
        {
          id: 'work-02',
          index: '02',
          title: 'UIKA Navigator System',
          year: '2026',
          role: "Lead Android & AR Engineer (Bachelor's Thesis)",
          previewCode: 'UN/02',
          statusBadge: 'Android AR · Thesis',
          mediaLayout: 'wide',
          media: [
            {
              src: '/images/projects/uika-navigator.webp',
              alt: 'Four screens of the UIKA Navigator Android AR app showing OCR plaque recognition, 3D outdoor AR walkway arrows, camera orientation calibration, and campus faculty search',
              caption: '01 · 3D AR Wayfinding, OCR Alignment, Camera Calibration & Campus Search',
              placeholderCode: 'FIG. 01',
              placeholderHint: 'uika-navigator.webp'
            }
          ],
          summary: "UIKA Navigator is an outdoor Augmented Reality (AR) campus wayfinding application engineered for Universitas Ibn Khaldun (UIKA) Bogor as an Undergraduate Thesis (Skripsi). Finding specific faculty buildings, auditoriums, administration centers, and campus facilities across sprawling university grounds can be daunting for freshmen, guests, and visiting academics. UIKA Navigator bridges the physical campus environment with intuitive spatial computing by projecting real-time 3D floating arrows, waypoints, and building landmark labels directly on top of the smartphone's camera stream. The system combines Google ARCore motion tracking, ML Kit Optical Text Recognition (OCR) to automatically scan outdoor building plaques for instant pose calibration, an A* spatial graph pathfinding engine, and Bézier Spline trajectory smoothing to guide pedestrians along campus walkways with fluid, video-game-like directional cues.",
          specs: [
            { label: 'Architecture', value: 'Clean Architecture · MVVM · Dagger-Hilt DI' },
            { label: 'Core stack', value: 'Kotlin 100% · Android SDK (Min SDK 24) · Jetpack' },
            { label: 'Database', value: 'Firebase Firestore (Cloud) · Room SQLite (Cache)' },
            { label: 'AR & 3D engine', value: 'Google ARCore SDK · SceneView (Filament Engine)' }
          ],
          highlights: [
            'Outdoor Pose Alignment via ML Kit OCR',
            'Outdoor Campus A* Spatial Graph Engine',
            'Bézier Spline Walkway Smoothing',
            'Dual-Flavored Architecture (Admin Mapping & User Wayfinder)',
            'Reactive Clean Architecture & MVVM with Dagger-Hilt'
          ],
          stack: ['Kotlin', 'Android SDK', 'Jetpack', 'Google ARCore', 'SceneView (Filament)', 'Firebase Firestore', 'Room SQLite', 'Dagger-Hilt'],
          liveUrl: '',
          repoUrl: ''
        },
        {
          id: 'work-03',
          index: '03',
          title: 'Sakuin',
          year: '2026',
          role: 'UI/UX Designer (Personal Project)',
          previewCode: 'SK/03',
          statusBadge: 'UI/UX · Personal Project',
          mediaLayout: 'mobile',
          media: [
            {
              src: '/images/projects/sakuin/sakuin-01-beranda.webp',
              alt: 'Sakuin Home screen showing daily spending allowance, weekly streak strip, and daily transaction list',
              caption: '01 · Home (Beranda)',
              placeholderCode: 'FIG. 01',
              placeholderHint: 'sakuin-01-beranda.webp'
            },
            {
              src: '/images/projects/sakuin/sakuin-02-catat.webp',
              alt: 'Sakuin Quick Entry screen with mindful spending reflection tags (Need, Want, Impulse)',
              caption: '02 · Quick Log (Catat)',
              placeholderCode: 'FIG. 02',
              placeholderHint: 'sakuin-02-catat.webp'
            },
            {
              src: '/images/projects/sakuin/sakuin-03-habit.webp',
              alt: 'Sakuin Habit screen displaying active logging streaks, anti-overspend challenges, and daily missions',
              caption: '03 · Habit',
              placeholderCode: 'FIG. 03',
              placeholderHint: 'sakuin-03-habit.webp'
            },
            {
              src: '/images/projects/sakuin/sakuin-04-pantau.webp',
              alt: 'Sakuin Monitor screen displaying weekly spending chart, Need vs Impulse radar, and savings targets',
              caption: '04 · Monitor (Pantau)',
              placeholderCode: 'FIG. 04',
              placeholderHint: 'sakuin-04-pantau.webp'
            }
          ],
          summary: 'Sakuin is a habit-driven personal finance mobile app design concept built specifically for young Indonesians. Many young users quit finance trackers because they feel tedious, complex, or stressful, while quiet impulse spending ("bocor halus") keeps slipping through. Rather than acting like a rigid ledger, Sakuin helps users recognize daily spending patterns and steadily improve financial habits through a light, supportive daily tracking flow.',
          specs: [
            { label: 'Visual direction', value: 'Cheerful Minimalist (#F6F7F9 & #FFFFFF · Lime, Yellow, Coral, Mint, Sky)' },
            { label: 'System & typography', value: 'Plus Jakarta Sans & DM Mono · 390 × 844 px · Reusable Components' },
            { label: 'UX copywriting', value: 'Casual, honest youth Indonesian voice with zero emoji ("Aman pol", "Cek Ombak")' },
            { label: 'UX focus', value: 'Daily spending allowance, habit reflection, light gamification & visual review' }
          ],
          highlightsTitle: 'Design approach & solutions',
          highlights: [
            'Home (Daily Allowance): Focuses on today\'s safe spending budget with a weekly streak strip and light repeat-spending nudges.',
            'Quick Log (Mindful Reflection): Adds light reflection via Need, Want, or Impulse tags ("Butuh", "Pengen aja", "Lapar mata") before saving.',
            'Habit (Light Gamification): Daily logging streaks, anti-overspend challenges ("No Checkout Tengah Malam", "Rem Ngopi"), and daily missions.',
            'Monitor (Visual Review): Weekly spending bar chart, impulse radar (Need vs Impulse), and savings goal progress in one concise view.'
          ],
          stack: ['Figma', 'UI/UX Design', 'Design System', 'UX Copywriting', 'Mobile App (390×844)'],
          liveUrl: '',
          repoUrl: ''
        },
        {
          id: 'work-04',
          index: '04',
          title: 'Sona',
          year: '2026',
          role: 'UI/UX Designer (Personal Project)',
          previewCode: 'SN/04',
          statusBadge: 'UI/UX · Personal Project',
          mediaLayout: 'mobile',
          media: [
            {
              src: '/images/projects/sona/sona-01-listen-now.webp',
              alt: 'Sona Listen Now home screen with mood filter pills, 2x2 Quick Picks grid, Curated Mix hero card, and Jump Back In shelf',
              caption: '01 · Listen Now',
              placeholderCode: 'FIG. 01',
              placeholderHint: 'sona-01-listen-now.webp'
            },
            {
              src: '/images/projects/sona/sona-02-now-playing.webp',
              alt: 'Sona Now Playing screen with full-width 1:1 album artwork, LOSSLESS audio badge, glass transport controls, and AirPods Pro, Lyrics, Up Next utility pill',
              caption: '02 · Now Playing',
              placeholderCode: 'FIG. 02',
              placeholderHint: 'sona-02-now-playing.webp'
            },
            {
              src: '/images/projects/sona/sona-03-search-explore.webp',
              alt: 'Sona Search & Explore screen with floating glass search bar, trending chips, recently searched artist card, and tinted glass genre tiles',
              caption: '03 · Search & Explore',
              placeholderCode: 'FIG. 03',
              placeholderHint: 'sona-03-search-explore.webp'
            },
            {
              src: '/images/projects/sona/sona-04-library.webp',
              alt: 'Sona Library screen with clean category filters, pinned Liked Songs glass card, and hairline-separated Recently Added editorial list',
              caption: '04 · Library',
              placeholderCode: 'FIG. 04',
              placeholderHint: 'sona-04-library.webp'
            }
          ],
          summary: 'Sona is a minimalist iOS music player app concept exploring a quieter alternative to dense grids, heavy cards, and noisy promotional banners in modern streaming apps. Built through Apple-inspired minimalism and optical glassmorphism, it brings album artwork and listening controls to the forefront with layered translucent depth, uniform proportions, and bottom-anchored controls optimized for thumb reach.',
          specs: [
            { label: 'Platform & proportions', value: 'iOS Mobile (393 × 852 px) · 1:1 artwork framing · Thumb-reach controls' },
            { label: 'Scope', value: 'Visual Direction · Design Tokens · Component Library · Core Screen Flows' },
            { label: 'Design direction', value: 'Optical Glass (backdrop blur, 1px specular borders) · Obsidian (#090A0F) · Inter · Coral (#FA3C5A)' },
            { label: 'Component system', value: 'Tokenized color & type · iOS Status Bar · Synced Mini Player · Liquid Glass Tab Bar' }
          ],
          highlightsTitle: 'Key screens & design system',
          highlights: [
            'Listen Now (Home): Mood filter pills, a compact 2×2 Quick Picks grid, an editorial Curated Mix hero card with a frosted glass footer, and a Jump Back In shelf.',
            'Now Playing: Ambient color bloom playback view, full-width 1:1 artwork, minimal scrubber with LOSSLESS indicator, tactile glass controls, and an AirPods Pro / Lyrics / Up Next pill.',
            'Search & Explore: Floating glass search field with voice input, trending query chips, a Recently Searched artist card, and tinted glass genre tiles.',
            'Library: Clean category filters, a pinned Liked Songs glass card, and a hairline-separated Recently Added editorial list avoiding repetitive card boxing.'
          ],
          stack: ['Figma', 'iOS UI/UX', 'Design Tokens', 'Component Library', 'Glassmorphism'],
          liveUrl: '',
          repoUrl: ''
        }
        // Add future works here (work-05, etc.) using the same structure.
      ]
    },
    contact: {
      index: '03',
      title: 'Contact',
      lead: 'Need a freelance hand for web development, software engineering, or graphic design? Drop a quick brief here or reach out by email.',
      emailLabel: 'Direct email',
      copyEmailBtn: 'Copy email',
      copiedEmailBtn: 'Email copied',
      copiedAnnouncement: 'Email address copied to clipboard.',
      copyFailedAnnouncement: 'Automatic copy unavailable. Please copy the email address manually.',
      openMailBtn: 'Open email app',
      socialNotLinked: 'Not linked yet',
      form: {
        nameLabel: 'Name',
        namePlaceholder: 'Your Name',
        emailLabel: 'Email',
        emailPlaceholder: 'email@example.com',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'What are we building?',
        messageLabel: 'Message',
        messagePlaceholder: 'Tell me a bit about your project or message here...',
        submitBtn: 'Send message',
        submittingBtn: 'Sending message...',
        resetBtn: 'Send another message',
        errorSummaryPrefix: 'Please fix the following fields before sending:',
        errName: 'Enter your name first.',
        errEmailRequired: 'Enter your email address.',
        errEmailInvalid: 'Enter a valid email address (e.g. email@example.com).',
        errSubject: 'Enter a short subject.',
        errMessage: 'Write at least 10 characters so the context is clear.',
        previewSuccessTitle: 'Message validated (preview mode)',
        previewSuccessDesc: 'No form endpoint is connected yet in src/data/portfolio.ts. You can continue immediately in your email app with the same draft.',
        openDraftMailBtn: 'Continue in email app',
        liveSuccessTitle: 'Message sent',
        liveSuccessDesc: 'Thanks, your message is in.',
        networkErrorTitle: 'Could not send message',
        networkErrorDesc: 'The form endpoint could not be reached. Retry or use the direct email link.'
      }
    }
  }
};
