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
  - Diuji dengan `npm run build` dan berhasil 100% tanpa error.

---

## 📐 Arsitektur & Aturan Utama Terpasang
1. **App Router Structure**: Semua komponen berada di `src/app/`, `src/components/`, `src/store/`, `src/lib/`, `src/hooks/`, `src/services/`, `src/validators/`.
2. **Strict TypeScript & RSC**: Gunakan Server Components secara default, `'use client'` hanya jika diperlukan interactivity/hooks.
3. **Persetujuan Sebelum Eksekusi**: Setiap perubahan kode baru **wajib** melalui tahap konfirmasi/approval dengan menyajikan maksud, gambaran *before/after*, perubahan detail, dan hasil yang diharapkan.
