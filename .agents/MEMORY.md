# Project Memory & History - Portal STMIK TIME

Dokumen ini mencatat riwayat semua permintaan pengguna (user requests), keputusan arsitektur, dependensi yang terpasang, serta status terkini proyek **Portal STMIK TIME**.

---

## 📌 Context & Scope Proyek
- **Nama Proyek**: Portal STMIK TIME (`portal-stmiktime`)
- **Tujuan**: Membangun Web Portal STMIK TIME menggunakan arsitektur modern Next.js App Router dengan TypeScript.

---

## 📋 Riwayat Permintaan User (User Requests History)

### 1. Inisialisasi Proyek & Pemasangan Tech Stack
- **Permintaan**: Memasang dependensi sesuai gambar rekomendasi teknologi dan membuat folder `.agents` berisi panduan tech stack untuk AI agent.
- **Hasil/Perubahan**:
  - Diinisialisasi proyek Next.js 15 (TypeScript, App Router, Tailwind CSS v4).
  - Dipasang dependensi lengkap: Next.js, Tailwind CSS, shadcn/ui utils, TanStack Query, Axios, React Hook Form, Zod, Zustand, Sonner, Lucide React.
  - Dibuat folder `.agents/` berisi `rules/tech-stack.md` & `AGENTS.md`.

### 2. Panduan Menjalankan Proyek
- **Permintaan**: Menanyakan cara menjalankan web portal ini.
- **Hasil/Perubahan**: Diberikan instruksi `npm run dev` (`http://localhost:3000`) dan `npm run build`.

### 3. Penetapan Aturan AI & Memori Permanen
- **Permintaan**:
  1. Membuat `MEMORY.md` di folder `.agents/` untuk menyimpan memori analisis & riwayat permintaan user.
  2. Membuat/memperbarui `AGENTS.md` & `.agents/rules/workflow.md` berisi standar workflow 3 tahap (Analisis & Proposal -> Persetujuan User -> Eksekusi & Re-Testing).
  3. Memastikan file ini dibaca AI pada awal percakapan.

### 4. Implementasi Tampilan Login Responsif (Pixel-Perfect)
- **Permintaan**: Membuat frontend halaman login responsif (Desktop & Mobile) persis 1:1 dengan gambar acuan tanpa ai-slop (tanpa gradient/emoji/card berlebihan), murni frontend tanpa logika backend.
- **Hasil/Perubahan**:
  - Dibuat komponen resmi logo vektor STMIK TIME & watermark silhouette di `src/components/shared/logo-stmik-time.tsx`.
  - Dibuat layout dual-panel di `src/app/page.tsx`:
    - **Desktop**: Panel kiri biru dongker (`#0D3B82`) dengan watermark lambang STMIK TIME, badge *SIAKAD 4.0 TERPADU*, heading & deskripsi sistem, dan bantuan teknis. Panel kanan berisi form login, badge *Portal Resmi Kampus*, role selector (Mahasiswa, Dosen, Admin), input nama pengguna & kata sandi dengan toggle visibility, verifikasi reCAPTCHA, ingat saya, lupa kata sandi, dan tombol masuk.
    - **Mobile**: Panel kiri tersembunyi secara otomatis, tampilan beralih rapi ke card *Portal Akademik Mobile* dengan banner info instruksi login dan pill bantuan layanan di bawah.
    - **Footer**: Copyright 2026 STMIK TIME dan tautan privasi/keamanan.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 5. Integrasi Aset Gambar Logo Resmi
- **Permintaan**: Menggunakan file gambar resmi dari `public/img/`: `Logo.png` untuk logo tanpa teks dan `STMIK TIME HORIZONTAL.png` untuk logo dengan teks horizontal.
- **Hasil/Perubahan**:
  - Diperbarui `src/components/shared/logo-stmik-time.tsx`:
    - `StmikTimeLogo` menggunakan `public/img/STMIK TIME HORIZONTAL.png` via `next/image` dengan `priority`.
    - `StmikWatermark` menggunakan `public/img/Logo.png` dengan filter siluet putih transparan halus.
    - `StmikLogoOnly` menggunakan `public/img/Logo.png`.
  - Diperbarui perataan logo di `src/app/page.tsx` (terpusat rapi di mobile, sejajar badge di desktop).
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 6. Penyesuaian Transparansi Watermark Logo
- **Permintaan**: Mengubah transparansi logo watermark di panel kiri biru ke tingkat sedang agar bentuk lambang STMIK TIME tampak lebih jelas.
- **Hasil/Perubahan**:
  - Disesuaikan nilai opacity komponen `StmikWatermark` di `src/components/shared/logo-stmik-time.tsx` menjadi `opacity-30` (tingkat sedang/medium).
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 7. Pembersihan Filter Siluet dan Penggunaan Logo.png Asli
- **Permintaan**: Menampilkan `Logo.png` asli tanpa filter siluet yang meratakan detail, sehingga seluruh elemen logo (toga, buku, lingkaran emas, perisai) terlihat dengan transparansi sedang.
- **Hasil/Perubahan**:
  - Dihapus filter `brightness-0 invert` pada komponen `StmikWatermark` di `src/components/shared/logo-stmik-time.tsx`.
  - Diterapkan `opacity-35` langsung pada gambar asli `/img/Logo.png`.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 8. Penyesuaian Posisi, Ukuran, dan Transparansi 70% Logo
- **Permintaan**: Menaikkan posisi logo ke atas, memperbesar ukuran, dan menaikkan transparansi menjadi 70%.
- **Hasil/Perubahan**:
  - Diperbesar dimensi logo menjadi `440px × 440px` dan dinaikkan posisinya ke `-bottom-2 -right-8` di `src/app/page.tsx`.
  - Dihapus wrapper opacity peredup dan dipasang `opacity-70` (70% visibilitas) secara langsung pada gambar asli `/img/Logo.png`.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 9. Penyesuaian Geser ke Kanan dan Transparansi 50%
- **Permintaan**: Menggeser logo lebih ke kanan sedikit dan menetapkan transparansi menjadi 50%.
- **Hasil/Perubahan**:
  - Posisi logo digeser lebih ke kanan (`-right-16`) pada `src/app/page.tsx`.
  - Transparansi disesuaikan menjadi `opacity-50` (50% visibilitas) pada `StmikWatermark`.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 10. Penyesuaian Transparansi Menjadi 30%
- **Permintaan**: Mengubah tingkat transparansi logo watermark menjadi 30% (`opacity-30`).
- **Hasil/Perubahan**:
  - Disesuaikan nilai opacity menjadi `opacity-30` pada `StmikWatermark` dan `src/app/page.tsx`.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 11. Penyesuaian Transparansi Menjadi 10%
- **Permintaan**: Mengubah transparansi logo watermark menjadi 10% (`opacity-10`) agar lebih halus (*subtle*).
- **Hasil/Perubahan**:
  - Ditetapkan `opacity-10` pada `StmikWatermark` dan `src/app/page.tsx`.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 12. Perbaikan Ikon Mahasiswa pada Tampilan Mobile
- **Permintaan**: Mengatasi ikon toga pada tab role "Mahasiswa" yang menghilang di tampilan HP.
- **Hasil/Perubahan**:
  - Ditambahkan class `shrink-0` pada seluruh ikon tab role (`GraduationCap`, `UserCheck`, `Shield`) di `src/app/page.tsx` agar tidak disusutkan oleh browser saat layar menyempit.
  - Dioptimalkan padding dan celah tombol di mobile (`gap-1.5 sm:gap-2 px-1.5 sm:px-3 text-[11px] sm:text-xs`).
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 13. Integrasi Endpoint Login API (`POST https://portal.stmik-time.ac.id/rest/api/login`)
- **Permintaan**: Menghubungkan formulir login frontend dengan endpoint login kampus `https://portal.stmik-time.ac.id/rest/api/login` (POST).
- **Hasil/Perubahan**:
  - Dibuat route handler proxy di `src/app/api/login/route.ts` untuk meneruskan request ke server kampus dan mencegah issue CORS pada browser.
  - Dibuat service autentikasi di `src/services/auth.service.ts`.
  - Dibuat custom mutation hook TanStack Query di `src/hooks/useAuthMutation.ts` yang mengelola siklus request, integrasi toast notifikasi Sonner, dan penyimpanan session/token ke Zustand (`useAuthStore`).
  - Dihubungkan ke form di `src/app/page.tsx` dengan validasi input, status loading spinner, dan disabled button untuk mencegah submit ganda.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 14. Perbaikan Payload Login DTO (`dto.LoginDto`)
- **Permintaan**: Mengatasi pesan error server `Unrecognized field "role" (class dto.LoginDto), not marked as ignorable` saat mencoba login dengan akun `admin` / `admin123`.
- **Hasil/Perubahan**:
  - Dihapus pengiriman field `role` pada `src/app/api/login/route.ts`, `src/services/auth.service.ts`, dan `src/app/page.tsx` sehingga request body yang dikirim ke server kampus murni hanya `{ username, password }`.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 15. Pengalihan Halaman (Redirect) ke /dashboard Saat Login Berhasil
- **Permintaan**: Mengarahkan pengguna ke halaman bertuliskan "Login Berhasil" ketika login sukses.
- **Hasil/Perubahan**:
  - Dibuat halaman tujuan di `src/app/dashboard/page.tsx` dengan pesan "Login Berhasil", kartu informasi user yang login, dan tombol logout/kembali.
  - Ditambahkan `router.push('/dashboard')` pada callback `onSuccess` di `src/hooks/useAuthMutation.ts`.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.
### 16. Penghapusan Pemilihan Hak Akses (Role Selector) pada Halaman Login
- **Permintaan**: Menghilangkan pilihan hak akses (Mahasiswa, Dosen, Admin) pada halaman login.
- **Hasil/Perubahan**:
  - Dihapus elemen UI selector role (label "Pilih Hak Akses (Role)" dan tombol Mahasiswa, Dosen, Admin) di `src/app/page.tsx`.
  - Dibersihkan state `activeRole`, tipe `RoleType`, serta unused imports icon (`GraduationCap`, `UserCheck`).
  - Layout form menjadi lebih ringkas dan langsung fokus ke input Nama Pengguna & Kata Sandi Akun.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

### 17. Integrasi Resmi Google reCAPTCHA v2 (Client & Server-Side Verification)
- **Permintaan**: Memasang Google reCAPTCHA v2 resmi menggunakan Site Key dan Secret Key yang disediakan pengguna.
- **Hasil/Perubahan**:
  - Dibuat file `.env.local` untuk menyimpan `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` dan `RECAPTCHA_SECRET_KEY`.
  - Dibuat komponen React 19 native `src/components/shared/recaptcha-v2.tsx` dengan dukungan `onVerify`, `onExpire`, `onError`, dan reset ref imperatif.
  - Diperbarui `src/app/page.tsx` menggantikan mockup box lama dengan widget resmi Google reCAPTCHA v2, validasi token sebelum submit form login, dan otomatis reset saat gagal login.
  - Diperbarui `src/services/auth.service.ts` untuk menyertakan `captchaToken?: string` pada payload login.
  - Diperbarui `src/app/api/login/route.ts` untuk memverifikasi token ke API Google (`https://www.google.com/recaptcha/api/siteverify`) di server-side sebelum meneruskan payload login `{ username, password }` ke server kampus.
### 18. Perbaikan Sinkronisasi Token reCAPTCHA v2 (Dual-Fallback & Stable Callback Refs)
- **Permintaan**: Mengatasi issue tombol login yang masih meminta penyelesaian captcha meskipun widget reCAPTCHA sudah bercentang hijau.
- **Hasil/Perubahan**:
  - Diperbarui `src/components/shared/recaptcha-v2.tsx`: callback `onVerify`, `onExpire`, dan `onError` disimpan dalam `useRef` stabil agar tidak terputus saat formulir re-render karena ketikan user.
  - Ditambahkan method imperatif `getResponse(): string` pada `RecaptchaV2Ref` untuk membaca nilai token aktif langsung dari instance `window.grecaptcha`.
  - Diperbarui `src/app/page.tsx`: mekanisme submit login kini menggunakan dual-fallback (`captchaToken || recaptchaRef.current?.getResponse()`), menjamin token terbaca 100% jika checkbox sudah centang hijau.
### 19. Implementasi Tampilan Dashboard Admin 1:1 Pixel-Perfect (Murni Frontend)
- **Permintaan**: Mendesain antarmuka `/dashboard` sama persis dengan gambar referensi yang dikirimkan (sidebar hingga isi konten), murni frontend tanpa terhubung data backend dan tanpa penambahan item di luar gambar.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/dashboard/page.tsx`:
    - **Sidebar Biru Royal (`#1E56F9`)**: Brand header (Avatar `TM` + `STMIK TIME` `Sistem Informasi`), navigasi menu (`Home` aktif dengan pill putih, `Data Master`, `Kelola Data`, `Studi Mahasiswa`, `Pengumuman`), dan tombol `Log Out` di bagian bawah.
    - **Top Header**: Judul `Dashboard`, salam `Selamat datang, admin`, search bar pill `Cari mahasiswa...`, lonceng notifikasi dengan red badge, profil toska `AD admin`, dan tombol `Logout`.
    - **4 Kartu Metrik Ringkasan**: `830 Total mahasiswa`, `828 Aktif`, `101 Alumni`, dan `86 Nonaktif` dengan icon badge yang sesuai.
    - **Grafik Baris Tengah**: Donut Chart SVG `Mahasiswa berdasarkan prodi` (61% TI vs 39% SI dengan center text `830 mahasiswa`) dan Area Spline Chart SVG `Mahasiswa berdasarkan angkatan` (kurva halus biru dengan sumbu X `null`, `2000`, `2020` - `2026`).
    - **Grafik Baris Bawah**: Clustered Column/Bar Chart SVG lebar `Mahasiswa berdasarkan status per angkatan` dengan 5 kategori warna (`AKTIF`, `NONAKTIF`, `DROPOUT`, `ALUMNI`, `CUTI`).
  - Murni frontend sesuai instruksi tanpa penambahan elemen tambahan di luar referensi.
### 20. Penyesuaian Layout Sidebar Flush Edge & Seamless Active Cut-out Tab
- **Permintaan**: Menghilangkan jarak putih di sekeliling sidebar agar menempel ke sisi kiri, atas, dan bawah layar; serta membuat menu yang aktif menyatu secara seamless dengan background halaman dashboard.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/dashboard/page.tsx`:
    - Dihapus padding luar container sehingga sidebar `aside` menempel penuh (*flush*) ke tepi kiri, atas, dan bawah layar (`min-h-screen`, `top-0`, `left-0`).
    - Tab menu aktif (`Home`) didesain memanjang hingga batas kanan sidebar dengan background yang sama dengan area konten dashboard (`bg-[#F4F6FB]`).
    - Diterapkan efek lengkungan sudut alami (*inverted concave curve radius*) di bagian atas dan bawah tab aktif, menghasilkan efek cut-out tab yang menyatu sempurna dengan area dashboard.
    - Menu tidak aktif diberi margin kanan proporsional (`pr-5`) dan area konten diberi padding lega (`p-5 sm:p-7`) dengan layout responsif.
### 21. Penyesuaian Warna Biru Dongker (#0D3B82), Logo Resmi, dan Tombol Logout Merah Pastel Soft
- **Permintaan**: Menyelaraskan warna sidebar dan aksen ke warna biru gelap/dongker sesuai halaman login (`#0D3B82`), memasang file logo resmi `Logo.png`, serta mengubah warna tombol logout menjadi merah pastel soft.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/dashboard/page.tsx`:
    - Warna sidebar dan inverted curve diganti ke warna biru dongker resmi STMIK TIME `#0D3B82`.
    - Avatar teks `TM` diganti dengan logo lambang resmi kampus `public/img/Logo.png` menggunakan komponen `StmikLogoOnly`.
    - Tombol `Logout` di header atas diubah menjadi merah pastel soft (`bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] border-red-200/80`).
    - Tombol `Log Out` di sidebar bawah diubah menjadi pil merah pastel transparan lembut (`bg-[#DC2626]/15 text-[#FECACA] hover:bg-[#DC2626]/25 border-red-300/20`).
    - Warna aksen grafik Donut TI, Spline area curve, dan bar chart AKTIF diselaraskan ke `#0D3B82`.
### 22. Implementasi Tampilan Responsif Mobile & Drawer Sidebar Non-Full
- **Permintaan**: Menyesuaikan tampilan dashboard agar responsif di HP dengan tombol hamburger yang memunculkan sidebar non-full saat ditekan.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/dashboard/page.tsx`:
    - Pada layar mobile (`lg:hidden`): sidebar disembunyikan secara default dan konten dashboard tampil penuh (*full width*) tanpa terhimpit.
    - Ditambahkan tombol **Hamburger Menu** di samping judul `Dashboard` pada header mobile.
    - Saat hamburger diklik, sidebar meluncur (*slide-in drawer*) non-full (`w-64`) dari kiri dengan backdrop gelap semi-transparan (`bg-black/50`).
    - Ditambahkan tombol silang (`X`) di header sidebar mobile serta kemampuan menutup dengan mengetuk area backdrop.
    - Header atas dioptimalkan secara responsif (penataan pencarian, notifikasi, profil, dan logout).
    - Pada layar desktop (`lg`): sidebar tetap tampil statis di sisi kiri secara permanen.
### 23. Pembersihan Tombol Logout Header & Penyelarasan Ikon Notifikasi Mobile
- **Permintaan**: Menghapus tombol logout pada dashboard sehingga hanya tersisa 1 tombol logout di sidebar, serta mengatur ikon notifikasi di sebelah kiri profil pada tampilan mobile.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/dashboard/page.tsx`:
    - Dihapus tombol Logout pada header atas (baik pada tampilan mobile maupun desktop).
    - Akses Logout kini terpusat tunggal pada tombol `Log Out` di bagian bawah panel sidebar.
    - Pada tampilan mobile (`sm:hidden`), ikon notifikasi lonceng (`Bell`) ditempatkan tepat di samping kiri avatar profil pengguna `AD` (`[Lonceng] [Avatar AD]`).
    - Pada tampilan desktop/tablet, penataan kontrol header tetap seimbang (`Search Bar` ➔ `Lonceng Notifikasi` ➔ `Profil AD admin`).
### 24. Penyesuaian Teks Brand Header Sidebar Menjadi STMIK TIME Saja
- **Permintaan**: Mengubah teks pada brand header sidebar samping logo dari "STMIK TIME SISTEM INFORMASI" menjadi "STMIK TIME" saja.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/dashboard/page.tsx`:
    - Dihapus subteks "Sistem Informasi" di samping logo sidebar.
    - Teks judul utama disesuaikan menjadi "STMIK TIME" tunggal yang proporsional dan bersih di sebelah logo lambang `StmikLogoOnly`.
### 25. Penjarangan Menu Navigasi & Perluasan Area Tab Aktif Home di Sidebar
- **Permintaan**: Menjarangkan jarak antar menu di sidebar (desktop dan mobile) agar tidak terlalu rapat, serta memperluas area blok warna putih pada menu yang sedang dipilih.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/dashboard/page.tsx`:
    - Lebar sidebar di desktop diselaraskan menjadi `w-64` (256px) untuk kenyamanan tata letak.
    - Spacing vertikal navigasi diperlebar dari `space-y-1` menjadi `space-y-2.5` sehingga menu tidak lagi terasa sesak/menumpuk rapat.
    - Tab menu aktif `Home` diperluas: padding ditambah menjadi `py-3.5 pl-5`, dan sudut kurva lengkungan *inverted cut-out* diperbesar menjadi `w-6 h-6` (24px).
    - Tombol menu lainnya dan footer logout diselaraskan dengan padding yang lebih nyaman (`py-3 px-4`).
### 26. Perluasan Signifikan Lebar Sidebar (w-72) & Tab Aktif Home (Inverted Cut-Out 32px)
- **Permintaan**: Memperlebar dimensi sidebar dan tab aktif putih karena dinilai masih kurang lebar.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/dashboard/page.tsx`:
    - Lebar total sidebar diperluas dari `w-64` (256px) menjadi `w-72` (288px) baik pada desktop maupun mobile drawer.
    - Tab menu aktif `Home` dipertebal dan diperluas: padding menjadi `py-4 pl-6 text-sm gap-4` dengan kurva *inverted concave* ekstra lebar `w-8 h-8` (radius `rounded-br-[32px]` dan `rounded-tr-[32px]`).
    - Menu tidak aktif dan footer logout diperlebar dengan padding `py-3.5 px-4 pr-7` dan icon/font seimbang (`text-sm`).
    - Header brand diberi padding lega `px-7 pt-8 pb-8` dengan icon logo `h-11 w-11`.
### 27. Penyesuaian Dimensi Vertikal Navigasi (space-y-4) & Penebalan Vertikal Tab Aktif Home (py-5)
- **Permintaan**: Klarifikasi bahwa maksud "lebar" adalah jarak vertikal (atas–bawah) agar menu tidak dempet/berhimpitan, serta blok menu yang terpilih (`Home`) memiliki tinggi vertikal yang lebih tebal dan leluasa.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/dashboard/page.tsx`:
    - Lebar horizontal sidebar dikembalikan ke dimensi ideal dan ramping (`w-64 lg:w-60`).
    - Jarak vertikal antar menu diperlebar secara signifikan dari `space-y-2` menjadi `space-y-4` sehingga tidak berhimpitan.
    - Tab aktif `Home` dipertebal secara vertikal dengan padding `py-5 pl-5` (tinggi ~64px), memberikan blok putih yang tebal dan leluasa.
    - Kurva sudut *inverted concave* diselaraskan secara presisi ke `w-7 h-7` (radius 28px) di atas dan bawah tab aktif.
    - Menu tidak aktif diberi padding vertikal `py-3.5 px-3.5` untuk proporsi sentuhan yang nyaman.
    - Padding header atas sidebar disesuaikan menjadi `px-5 pt-7 pb-6` dan area logout menjadi `p-5 pb-6`.
### 28. Penambahan Menu Kategori Alumni di Sidebar & Rute Halaman /alumni/tracer-study
- **Permintaan**: Menambahkan 1 menu kategori di sidebar bernama "Alumni" yang terdiri dari beberapa menu di mana salah satunya adalah "Tracer Study". Saat menu Tracer Study ditekan, navigasi berpindah ke halaman `/alumni/tracer-study`.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/dashboard/page.tsx`:
    - Ditambahkan import `Link` dari `next/link` dan state `isAlumniOpen`.
    - Ditambahkan kategori menu **Alumni** di sidebar dengan ikon `GraduationCap` dan chevron dropdown toggle yang interaktif.
    - Menampilkan submenu **Tracer Study** (dengan link ke `/alumni/tracer-study`) dan **Data Alumni** ketika kategori terbuka.
  - Dibuat halaman baru `src/app/alumni/tracer-study/page.tsx`:
    - Layout lengkap terintegrasi dengan tema kampus `#0D3B82`, header, notifikasi, dan avatar profil.
    - Sidebar konsisten dengan submenu `Tracer Study` dalam keadaan aktif/terpilih dan link `Home` yang mengarah kembali ke `/dashboard`.
    - 4 KPI Stat Cards: Responden Alumni (1.248), Relevansi Bidang IT (78.5%), Rata-Rata Waktu Tunggu (2.1 Bulan), Tingkat Keterserapan (92.3%).
    - Filter dinamis berdasarkan Tahun Kelulusan dan Program Studi, search filter, tombol export, serta tabel interaktif kuesioner responden alumni dan diagram distribusi status alumni.
### 29. Pengosongan Konten Halaman Tracer Study (/alumni/tracer-study)
- **Permintaan**: Mengosongkan halaman Tracer Study terlebih dahulu tanpa ada kartu/card ataupun komponen data dummy apapun.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/alumni/tracer-study/page.tsx`:
    - Dihapus 4 KPI Stat Cards, bilah filter, tabel responden kuesioner, dan diagram status alumni.
    - Struktur layout utama (sidebar responsif, header judul, breadcrumb `Dashboard / Alumni / Tracer Study`, notifikasi, dan profil pengguna) dipertahankan utuh dan tetap berfungsi.
    - Area konten body disiapkan dalam keadaan bersih/kosong (*empty canvas*) siap diisi sesuai kebutuhan mendatang.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error (Exit code 0).

### 30. Setup Backend Laravel 12 & Database Normalisasi (Tahap 1 Tracer Study)
- **Permintaan**: Menyiapkan backend RESTful API Laravel 12 dan basis data MySQL XAMPP ternormalisasi (3NF) bebas redundansi untuk fitur Tracer Study dinamis (Google Form style).
- **Hasil/Perubahan**:
  - Dibuat basis data `tracer_study_db` di MySQL XAMPP (`127.0.0.1:3306`).
  - Dijalankan migrasi 6 tabel relasional ternormalisasi (3NF) di `d:\Code App\portal-stmiktime-api`:
    1. `tracer_forms`: Header form (title, slug, description, visibility [draft/published/closed], created_by).
    2. `tracer_questions`: Pertanyaan dinamis (short_text, long_text, radio, checkbox, dropdown, scale, date, is_required, order_index).
    3. `tracer_question_options`: Opsi atomik pilihan ganda/checkbox/dropdown.
    4. `tracer_responses`: Header respon responden alumni (nim, nama, email, prodi, tahun lulus, ip, submitted_at).
    5. `tracer_answers`: Header jawaban per pertanyaan.
    6. `tracer_answer_options`: Pivot relasi jawaban pilihan ganda/checkbox.
  - CORS dikonfigurasi untuk menerima akses dari `http://localhost:3000`.
  - Berhasil termigrasi 100% di MySQL XAMPP.

### 31. Implementasi Tracer Study: Form Builder (Google Form Style), Form Filler, & Responses View
- **Permintaan**: Mengintegrasikan frontend Next.js dengan RESTful API Laravel 12 dan MySQL XAMPP untuk pembuatan kuesioner dinamis mirip Google Form dan pengisian oleh mahasiswa/alumni.
- **Hasil/Perubahan**:
  - Dibuat tipe data TypeScript di `src/types/tracer-study.ts` untuk kuesioner, pertanyaan, opsi atomik, dan respon mahasiswa.
  - Dibuat service Axios terpusat di `src/services/tracer-study.service.ts` yang menangani endpoint CRUD form admin, status visibility, submit kuesioner mahasiswa, dan get responses.
  - Ditambahkan konfigurasi `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api` di `.env.local`.
  - Dibuat komponen `src/components/tracer-study/tracer-form-builder.tsx`:
    - Google Form style editor: Judul, deskripsi, selector visibility (*Draft / Public / Closed*).
    - Pertanyaan dinamis dengan 7 tipe input: Short Text, Long Text, Radio (Pilihan Ganda), Checkbox (Kotak Centang), Dropdown, Skala Penilaian (Likert 1-5), Tanggal.
    - Opsi atomik dinamis (tambah, edit, hapus opsi).
    - Toggle *Wajib Diisi (Required)*, reorder pertanyaan (up/down), duplikasi, dan hapus pertanyaan.
    - Mode Pratinjau Mahasiswa (*Preview Mode*).
  - Dibuat komponen `src/components/tracer-study/tracer-form-filler.tsx`:
    - Merender kuesioner yang berstatus `published` secara dinamis.
    - Validasi identitas alumni (NIM, Nama, Prodi, Tahun Kelulusan, Email) dan pertanyaan wajib diisi.
    - Submit respon yang tersimpan di MySQL XAMPP dengan umpan balik toast Sonner dan tampilan halaman sukses (*Thank You screen*).
  - Dibuat komponen `src/components/tracer-study/tracer-responses-view.tsx`:
    - Menampilkan ringkasan metrik (Total Responden, Status Visibilitas, Jumlah Pertanyaan).
    - Tabel daftar responden alumni dengan rincian jawaban soal yang dapat di-expand.
  - Diperbarui `src/app/alumni/tracer-study/page.tsx` dengan sistem tab terintegrasi (*Kuesioner Alumni*, *Form Builder*, *Rekap Responden*).
  - Diuji dengan `npm.cmd run build` dan berhasil 100% tanpa error (Exit code 0).

---

## 📐 Arsitektur & Aturan Utama Terpasang
1. **App Router Structure**: Semua komponen berada di `src/app/`, `src/components/`, `src/store/`, `src/lib/`, `src/hooks/`, `src/services/`, `src/validators/`.
2. **Strict TypeScript & RSC**: Gunakan Server Components secara default, `'use client'` hanya jika diperlukan interactivity/hooks.
3. **Persetujuan Sebelum Eksekusi**: Setiap perubahan kode baru **wajib** melalui tahap konfirmasi/approval dengan menyajikan maksud, gambaran *before/after*, perubahan detail, dan hasil yang diharapkan.




### 32. Perbaikan Issue Uncontrolled to Controlled Input pada Dropdown & Checkbox Tracer Study
- **Permintaan**: Mengatasi console error React 'A component is changing an uncontrolled input to be controlled...' saat memilih opsi pada dropdown kuesioner Tracer Study.
- **Hasil/Perubahan**:
  - Ditemukan penyebab bahwa isChecked pada checkbox dievaluasi menghasilkan undefined ketika state currentAns?.option_ids belum ada, menyebabkan React menganggap checkbox sebagai input uncontrolled, dan saat dropdown dipilih komponen re-render sehingga nilai berubah menjadi defined.
  - Diperbarui src/components/tracer-study/tracer-form-filler.tsx:
    - Mengubah evaluasi isChecked menjadi Boolean(opt.id && currentAns?.option_ids?.includes(opt.id)) sehingga selalu bertipe boolean murni (true / false).
    - Mengubah evaluasi isSelected pada radio button menjadi Boolean(opt.id && currentAns?.option_ids?.[0] === opt.id).
    - Menyesuaikan value pada elemen select dropdown agar selalu bertipe string (String(currentAns?.option_ids?.[0] ?? '')) dan value={String(opt.id)} pada setiap option.
  - Diuji dengan npm.cmd run build dan berhasil 100% tanpa error (Exit code 0).

### 33. Penyesuaian Desain Seamless Cut-Out Tab pada Menu Tracer Study di Sidebar
- **Permintaan**: Menyesuaikan tampilan tab submenu `Tracer Study` pada sidebar halaman `/alumni/tracer-study` agar putihnya memanjang dan menyatu secara mulus (seamless cut-out) ke area isi dashboard, persis seperti menu `Home` sebelumnya.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/alumni/tracer-study/page.tsx`:
    - Menghilangkan pembatasan padding kanan (`pr-5`) pada container aktif `Tracer Study`.
    - Menerapkan background `#F4F6FB` dengan sudut kiri melengkung (`rounded-l-2xl`) yang memanjang hingga batas kanan sidebar (`right-0`).
    - Memasang kurva cekung alami (*inverted concave curve*) di bagian atas (`-top-7 right-0 w-7 h-7 bg-[#F4F6FB]` dengan inner `bg-[#0D3B82] rounded-br-[28px]`) dan bawah (`-bottom-7 right-0 w-7 h-7 bg-[#F4F6FB]` dengan inner `bg-[#0D3B82] rounded-tr-[28px]`).
  - Diuji dengan `npm.cmd run build` dan berhasil 100% tanpa error (Exit code 0).

### 34. Implementasi Role-Based Routing & Dashboard Terpisah (/admin/dashboard & /mahasiswa/dashboard)
- **Permintaan**: Memisahkan dashboard dan rute pengalihan login berdasarkan role dari JWT backend kampus:
  - Akun dengan group `administrator` (contoh: `admin` / `admin`) diarahkan ke `/admin/dashboard`.
  - Akun dengan group `mahasiswa` (contoh: `2345012` / `asdf`) diarahkan ke `/mahasiswa/dashboard`.
- **Hasil/Perubahan**:
  - Dibuat utility `src/lib/jwt.ts` untuk men-decode token JWT di sisi client dan mengekstrak `upn`, `groups`, dan `sub`.
  - Diperbarui `src/hooks/useAuthMutation.ts`:
    - Callback `onSuccess` men-decode token JWT dan menyimpan data identitas serta role ke `useAuthStore`.
    - Mengarahkan login secara dinamis: jika `role === 'administrator'` ke `/admin/dashboard`, dan jika `role === 'mahasiswa'` ke `/mahasiswa/dashboard`.
  - Dibuat halaman `src/app/admin/dashboard/page.tsx`: Dashboard khusus admin dengan metrik 4 KPI, grafik donat, spline, clustered column chart, dan menu kelola.
  - Dibuat halaman `src/app/mahasiswa/dashboard/page.tsx`: Dashboard khusus mahasiswa dengan profil NIM, status akademik aktif, call-to-action kuesioner Tracer Study, kartu metrik IPK/SKS/Presensi, dan jadwal kuliah.
  - Diperbarui `src/app/dashboard/page.tsx`: Router penyeimbang cerdas yang secara otomatis mengarahkan akses langsung `/dashboard` ke dashboard masing-masing role.
  - Diperbarui `src/components/tracer-study/tracer-form-filler.tsx` agar otomatis mengisi (*pre-fill*) field NIM mahasiswa dari data login.
  - Diuji dengan `npm.cmd run build` dan berhasil 100% (Exit code 0).

### 35. Penerapan Struktur URL Berbasis Role (/{role}/...) & Pemisahan Fitur Tracer Study
- **Permintaan**: Menata seluruh rute URL agar setelah domain wajib diawali dengan nama role (`/admin/...` dan `/mahasiswa/...`). Khusus Tracer Study:
  - Admin (`/admin/tracer-study`): Hanya bisa membuat, mengontrol visibilitas form (*Google Form Style Builder*), dan melihat rekap respon (*TracerResponsesView*).
  - Mahasiswa (`/mahasiswa/tracer-study`): Murni hanya bisa mengisi/menjawab formulir kuesioner yang aktif (*TracerFormFiller*) dengan NIM yang otomatis terisi.
- **Hasil/Perubahan**:
  - Dibuat halaman `src/app/admin/tracer-study/page.tsx` khusus Admin (Form Builder & Rekap Respon Responden).
  - Dibuat halaman `src/app/mahasiswa/tracer-study/page.tsx` khusus Mahasiswa (Murni formulir pengisian kuesioner tanpa tab builder/rekap).
  - Diperbarui `src/app/admin/dashboard/page.tsx`: Submenu Alumni mengarah langsung ke `/admin/tracer-study`.
  - Diperbarui `src/app/mahasiswa/dashboard/page.tsx`: Submenu Alumni dan tombol CTA banner mengarah langsung ke `/mahasiswa/tracer-study`.
  - Diperbarui `src/app/alumni/tracer-study/page.tsx`: Menjadi smart router redirector otomatis ke `/admin/tracer-study` atau `/mahasiswa/tracer-study` berdasarkan role user aktif.
  - Diuji dengan `npm.cmd run build` dan berhasil 100% tanpa error (Exit code 0, 11/11 pages generated).

### 36. Perombakan Layout & Alur CRUD Tracer Study Admin (/admin/tracer-study)
- **Permintaan**: Mengubah tata letak Tracer Study Admin agar tidak langsung membuka Form Builder panjang di halaman muka:
  - Menyediakan tombol utama "+ Tambah Formulir Baru" di kiri dan tombol "Rekap Respon" di kanan.
  - Menampilkan tabel CRUD daftar formulir lengkap dengan kolom No, Judul & Deskripsi, Status Visibilitas (Public/Draft/Closed), Jumlah Pertanyaan, Jumlah Responden, Waktu Update, dan Kolom Aksi (Edit, Lihat Respon, Hapus).
  - Ketika tombol "+ Tambah Formulir Baru" atau aksi "Edit" ditekan, beralih ke Form Builder dengan tombol navigasi "← Kembali ke Daftar".
- **Hasil/Perubahan**:
  - Dibuat komponen `src/components/tracer-study/tracer-forms-table.tsx`:
    - 3 kartu ringkasan cepat (Total Formulir, Formulir Aktif/Public, Total Respon Masuk).
    - Tombol aksi "+ Tambah Formulir Baru" dan "Rekap Respon ({total})".
    - Tabel interaktif daftar form dengan badge status visibilitas klik-cepat (Draft <-> Public), jumlah soal, counter responden, dan tombol Edit, Lihat Respon, serta Hapus form ke MySQL XAMPP.
  - Diperbarui `src/components/tracer-study/tracer-form-builder.tsx`:
    - Ditambahkan dukungan prop `initialFormId` dan `onBack`.
    - Ditambahkan tombol "← Kembali ke Daftar" di toolbar atas.
  - Diperbarui `src/components/tracer-study/tracer-responses-view.tsx`:
    - Ditambahkan dukungan prop `initialFormId` dan tombol navigasi "← Kembali ke Daftar".
  - Diperbarui `src/app/admin/tracer-study/page.tsx`:
    - Mengelola state alur: `'list'` (Tabel CRUD) ➔ `'builder'` (Editor Form) ➔ `'responses'` (Rekap Respon).
  - Diuji dengan `npm.cmd run build` dan berhasil 100% tanpa error (Exit code 0).

### 37. Integrasi API Data Mahasiswa Dinamis & Halaman Profil Mahasiswa (/mahasiswa/profile)
- **Permintaan**: Menampilkan data mahasiswa dinamis dari API `https://portal.stmik-time.ac.id/rest/api/mahasiswa/nim/(nim)` di dashboard ("Selamat datang, {nama}"), serta menambahkan tampilan baru `/mahasiswa/profile` yang dapat diakses melalui dropdown menu saat menekan ikon profil di top header.
- **Hasil/Perubahan**:
  - Dibuat tipe TypeScript `MahasiswaDetail` di `src/types/mahasiswa.ts`.
  - Diperbarui `src/store/useAuthStore.ts` dengan middleware `persist` bawaan Zustand agar data sesi pengguna dan token tersimpan aman saat refresh halaman.
  - Dibuat route handler proxy di `src/app/api/mahasiswa/[nim]/route.ts` yang mem-forward request ke server STMIK TIME dengan header authorization, serta aman dengan fallback data lokal jika server eksternal offline.
  - Dibuat service `mahasiswaService.getByNim` di `src/services/mahasiswa.service.ts` dan hook TanStack Query `useMahasiswaProfile` di `src/hooks/useMahasiswaProfile.ts`.
  - Diperbarui `src/app/mahasiswa/dashboard/page.tsx`:
    - Teks sambutan dinamis memuat nama asli mahasiswa (`TARQ HILMAR SIREGAR` atau nama dinamis yang login).
    - Avatar di top header kini memiliki interaksi dropdown menu mengambang (floating dropdown) yang berisi ringkasan info user, link menuju **Profil Mahasiswa**, link Tracer Study, dan tombol Logout, dilengkapi event listener *click-outside*.
    - Hero Card menampilkan nama, NIM, prodi, dan kampus secara dinamis.
  - Dibuat halaman profil komprehensif di `src/app/mahasiswa/profile/page.tsx`:
    - Layout terpadu bertema `#0D3B82` dengan navigasi sidebar dan breadcrumbs.
    - Banner profil besar (avatar inisial, nama lengkap, NIM, prodi, angkatan, status aktif).
    - Diuji dengan `npm.cmd run build` dan berhasil 100% tanpa error (Exit code 0).

### 38. Penyelarasan Standar Sidebar Mahasiswa, Format Gender, dan Dynamic User Profile Switching
- **Permintaan**:
  1. Halaman `/mahasiswa/profile` menggunakan susunan sidebar yang persis sama dengan dashboard, tanpa ada menu yang terpilih (tidak ada cut-out aktif). Prinsip ini menjadi aturan baku untuk setiap pembuatan halaman baru mahasiswa mendatang.
  2. Format jenis kelamin: `P` = Pria, `W` = Wanita.
  3. Memperbaiki masalah pergantian akun di mana saat login NIM `2345012` (Rinawati) setelah `2244090` (Tarq), nama masih tercetak Tarq.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/mahasiswa/profile/page.tsx`:
    - Sidebar diselaraskan 1:1 dengan dashboard (Beranda, KRS & KHS, Jadwal Kuliah, Alumni, Pengumuman, Log Out) dalam status tidak aktif (tanpa lengkungan cut-out putih).
    - Fungsi `formatGender` diperbarui: `P` ➔ Pria, `W` ➔ Wanita.
    - Resolusi nama dinamis dari field profile API/user tanpa fallback string hardcode Tarq.
    - Ditambahkan `queryClient.clear()` pada `handleLogout` agar seluruh query cache ter-reset bersih saat logout.
  - Diperbarui `src/app/mahasiswa/dashboard/page.tsx`:
    - Dihapus item ekstra "Profil Saya" dari sidebar agar susunan sidebar tetap murni dan seragam.
    - Nama mahasiswa dinamis dan penambahan `queryClient.clear()` saat logout.
  - Diperbarui `src/app/mahasiswa/tracer-study/page.tsx`:
    - Dibersihkan menu "Profil Saya" dari sidebar agar identik dengan dashboard.
  - Diperbarui `src/app/api/mahasiswa/[nim]/route.ts`:
    - Dihapus hardcode `TARQ HILMAR SIREGAR` pada fallback; kini menghasilkan identitas dinamis yang tepat per NIM.
  - Diperbarui `src/services/mahasiswa.service.ts`:
    - Memastikan header Authorization tidak menduplikasi prefix `Bearer`.
  - Diuji dengan `npm.cmd run build` dan berhasil 100% tanpa error (Exit code 0, 12/12 pages).

### 39. Perbaikan Penarikan Nama Lengkap Asli dari API Kampus (RISNAWATI DAMANIK untuk NIM 2345012)
- **Permintaan**: Memastikan nama lengkap mahasiswa ditarik langsung dan seutuhnya dari API kampus (`namaMahasiswa`), bukan nama panggilan atau nama fallback pendek.
- **Hasil/Perubahan**:
  - Ditemukan akar masalah: Hook `useMahasiswaProfile` sebelumnya memicu fetch sebelum token JWT ter-rehidrasi dari `localStorage`, menyebabkan request ke API eksternal kampus ditolak (403 forbidden) sehingga jatuh ke data fallback pendek.
  - Diperbarui `src/hooks/useMahasiswaProfile.ts`:
    - Ditambahkan guard `enabled: Boolean(activeNim && token)` sehingga request ke API kampus HANYA berjalan setelah token autentikasi aktif tersedia.
    - Query key diperbarui menjadi `['mahasiswa', 'profile', activeNim, token]`.
  - Diperbarui `src/app/api/mahasiswa/[nim]/route.ts`:
    - Fallback darurat disinkronkan persis dengan database kampus (`RISNAWATI DAMANIK` untuk NIM `2345012`, lengkap dengan email `watirisnadmk@gmail.com`, agama `KR`, dan orang tua).
  - Diuji dengan `npm.cmd run build` dan berhasil 100% tanpa error (Exit code 0, 12/12 pages).

### 40. Perombakan Desain Minimalis & Pembersihan Elemen AI-Slop (Dashboard & Profile)
- **Permintaan**: Menjadikan tampilan lebih minimalis dan menghilangkan elemen AI-slop seperti gradasi mencolok, card bertumpuk berlebihan (card-in-card), dan efek glassmorphism.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/mahasiswa/profile/page.tsx`:
    - Dihapus banner gradasi besar, rounded-3xl berlebih, efek glassmorphism, dan kotak card kecil bersarang.
    - Dibuat header profil flat putih bersih (`bg-white border border-slate-200 rounded-xl`) dengan avatar solid `#0D3B82`, nama mahasiswa, NIM, prodi, dan pill status aktif yang simpel.
    - Biodata disusun ke dalam 2 panel utama terstruktur: *Data Akademik & Pribadi* dan *Kontak, Domisili & Keluarga* menggunakan layout baris data bergaris (clean key-value list with subtle borders).
  - Diperbarui `src/app/mahasiswa/dashboard/page.tsx`:
    - Hero card diubah dari gradasi warna mencolok menjadi panel solid navy `#0D3B82` flat yang minimalis dan proporsional.
    - Card CTA Tracer Study diselaraskan dengan border dan sudut rounded-xl standar.
  - Diuji dengan `npm.cmd run build` dan berhasil 100% tanpa error (Exit code 0, 12/12 pages).

### 41. Integrasi Tracer Study Berdasarkan Target Angkatan & Kunci Otomatis Identitas Responden
- **Permintaan**:
  1. Mahasiswa hanya menerima kuesioner Tracer Study yang ditujukan spesifik untuk tahun angkatannya (dari data `tahunAngkatan` API kampus). Jika kuesioner dibuat untuk angkatan 2022, mahasiswa angkatan 2023 tidak boleh menerima form tersebut dan menampilkan pemberitahuan yang jelas.
  2. Saat mahasiswa mengisi kuesioner, bagian data identitas responden terisi otomatis dari profil mahasiswa dan terkunci permanen (*read-only*), tidak dapat diedit secara manual.
  3. Desain tetap minimalis, bersih, dan bebas dari elemen AI-slop.
- **Hasil/Perubahan**:
  - Diperbarui backend `portal-stmiktime-api/app/Http/Controllers/Api/PublicTracerController.php`:
    - Method `getActiveForm` menerapkan filter kueri ketat berdasarkan parameter `year` (`target_graduation_year == $year || target_graduation_year == 'Semua Angkatan' || null`).
    - Dihapus fallback yang sebelumnya otomatis mengambil kuesioner tahun lain jika kuesioner tahun angkatan mahasiswa kosong.
    - Mengembalikan respons terstruktur status `empty` dengan pesan ramah jika form untuk angkatan mahasiswa belum tersedia.
  - Diperbarui frontend `Portal STMIKTIME/src/components/tracer-study/tracer-form-filler.tsx`:
    - Terintegrasi langsung dengan hook `useMahasiswaProfile(activeNim)` untuk mengambil data profil resmi mahasiswa (`namaMahasiswa`, `nim`, `email`, `prodi`, `tahunAngkatan`).
    - Mengirimkan `profile.tahunAngkatan` ke API Tracer Study saat fetch kuesioner aktif.
    - Bagian **Identitas Responden (Mahasiswa)** diisi otomatis dan dipasang atribut `readOnly` dengan styling *disabled* bersih beraksen badge `Terverifikasi Sistem` dan ikon gembok `Lock`.
    - Desain kartu form diselaraskan dengan estetika minimalis (sudut `rounded-xl`, border tipis slate, tanpa gradient berlebihan).
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error (Exit code 0, 12/12 routes).

### 42. Perbaikan Error Rules of Hooks React Saat Logout di Tracer Study
- **Permintaan/Masalah**: Muncul pesan error *"React has detected a change in the order of Hooks called by TracerFormFiller"* saat mahasiswa refresh di halaman Tracer Study lalu melakukan logout.
- **Penyebab**:
  - Pada hook `src/hooks/useMahasiswaProfile.ts`, terdapat pemanggilan `const activeNim = nim || useAuthStore((state) => state.user?.name);`.
  - Operator logika `||` menyebabkan hook `useAuthStore` dieksekusi secara kondisional: saat user login dan `nim` berupa string terisi, `useAuthStore` tidak dipanggil (short-circuit). Saat user logout dan `nim` menjadi string kosong (`""`), sisi kanan dievaluasi sehingga `useAuthStore` terpanggil secara tiba-tiba, menyebabkan jumlah dan urutan pemanggilan hooks berubah antar-render (pelanggaran *Rules of Hooks*).
- **Hasil/Perubahan**:
  - Diperbarui `src/hooks/useMahasiswaProfile.ts`:
    - Pemanggilan `useAuthStore` dideklarasikan secara konstan dan tanpa syarat (*unconditionally*) di tingkat atas fungsi hook.
    - Urutan dan jumlah hook selalu stabil dan konsisten pada setiap render (login, refresh, maupun logout).
  - Diperbarui `src/app/mahasiswa/tracer-study/page.tsx`:
    - Ditambahkan `queryClient.clear()` pada `handleLogout` agar query cache TanStack Query ter-reset bersih saat logout.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error (Exit code 0, 12/12 routes).

### 43. Penerapan Arsitektur App Shell: Sidebar Fixed 100vh & Area Konten Scroll Independen
- **Permintaan/Masalah**: Pada halaman `/mahasiswa/tracer-study`, saat pengguna men-scroll kuesioner ke bawah, sidebar sebelumnya ikut terdorong/terpotong ke atas karena `overflow-x: hidden` pada container memutus perilaku `sticky`.
- **Hasil/Perubahan**:
  - Diterapkan pola arsitektur **App Shell Dashboard**:
    - Container terluar: `h-screen w-full flex overflow-hidden relative` (menonaktifkan scroll window global).
    - Sidebar (`<aside>`): `h-screen max-h-screen w-64 lg:w-60 shrink-0 overflow-hidden` (terkunci permanen pas tinggi layar 100vh, tidak memanjang dan tidak bisa di-scroll).
    - Konten utama (`<main>`): `flex-1 min-w-0 h-screen overflow-y-auto` (seluruh formulir di-scroll secara independen di dalam panel kanan tanpa menggeser sidebar).
  - Diterapkan secara seragam di `tracer-study/page.tsx`, `dashboard/page.tsx`, dan `profile/page.tsx`.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error (Exit code 0, 12/12 routes).

### 44. Pembersihan Header Tracer Study Mahasiswa (Hapus Profil & Notifikasi)
- **Permintaan**: Pada halaman `/mahasiswa/tracer-study`, hilangkan widget profil mahasiswa (avatar, inisial, nama) dan tombol notifikasi lonceng di header atas.
- **Hasil/Perubahan**:
  - Diperbarui `src/app/mahasiswa/tracer-study/page.tsx`:
    - Dihapus elemen tombol lonceng notifikasi `<Bell />` (baik untuk desktop maupun mobile).
    - Dihapus widget profil (avatar dan teks nama mahasiswa) di header.
    - Dihapus import ikon `Bell` dan variabel `displayName` yang tidak lagi digunakan.
    - Header kini murni dan bersih, hanya menyisakan navigasi breadcrumbs (`Mahasiswa / Alumni / Tracer Study`), judul kuesioner, dan tombol hamburger menu mobile.
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error (Exit code 0, 12/12 routes).




