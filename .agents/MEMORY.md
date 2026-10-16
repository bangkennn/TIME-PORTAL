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

---

## 📐 Arsitektur & Aturan Utama Terpasang
1. **App Router Structure**: Semua komponen berada di `src/app/`, `src/components/`, `src/store/`, `src/lib/`, `src/hooks/`, `src/services/`, `src/validators/`.
2. **Strict TypeScript & RSC**: Gunakan Server Components secara default, `'use client'` hanya jika diperlukan interactivity/hooks.
3. **Persetujuan Sebelum Eksekusi**: Setiap perubahan kode baru **wajib** melalui tahap konfirmasi/approval dengan menyajikan maksud, gambaran *before/after*, perubahan detail, dan hasil yang diharapkan.



