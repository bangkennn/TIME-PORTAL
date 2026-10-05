# Tech Stack & Architectural Guidelines

Panduan ini berisi arsitektur teknis dan standar pengodean (coding standards) untuk AI agent & developer yang bekerja pada project **Portal STMIK TIME**.

---

## 🛠️ Stack Teknologi

| Layer | Teknologi & Library |
|---|---|
| **Framework** | Next.js (App Router) + TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui + Lucide React |
| **API & Data Fetching** | TanStack Query (React Query v5) + Axios |
| **Form & Validasi** | React Hook Form + Zod (`@hookform/resolvers`) |
| **State Management Global** | Zustand |
| **Notifikasi / Feedback** | Sonner |

---

## 📁 Struktur Folder Proyek

Semua kode sumber utama berada di dalam folder `src/`:

```text
src/
├── app/                  # Next.js App Router (pages, layouts, route handlers)
│   ├── (auth)/           # Route group untuk otentikasi (login, register)
│   ├── (dashboard)/      # Route group untuk dashboard
│   ├── api/              # Route handlers / API routes (jika ada)
│   ├── globals.css       # Global CSS & Tailwind CSS custom styles
│   └── layout.tsx        # Root layout (termasuk Provider: QueryClient, Toaster)
├── components/           # Component React
│   ├── ui/               # shadcn/ui base components (Button, Input, Dialog, dll)
│   ├── forms/            # Reusable form components
│   ├── layouts/          # Header, Sidebar, Footer, Navbar
│   └── shared/           # Component bersama (Tables, Cards, Modals)
├── hooks/                # Custom React Hooks & TanStack Query custom hooks
├── lib/                  # Library instance & utilities
│   ├── axios.ts          # Configured Axios instance with interceptors
│   ├── utils.ts          # Utility functions (`cn` helper untuk Tailwind, dll)
│   └── query-client.ts   # TanStack QueryClient setup
├── services/             # Service functions untuk HTTP Requests (Axios calls)
├── store/                # Zustand global stores
│   ├── useAuthStore.ts   # Store data user aktif & token
│   └── useFilterStore.ts # Store filter aktif & UI state
├── types/                # TypeScript interfaces & types
└── validators/           # Zod validation schemas
```

---

## 🎯 Panduan & Aturan Implementasi

### 1. Framework & React Components (Next.js & TypeScript)
- Gunakan **React Server Components (RSC)** secara default.
- Tambahkan direktif `'use client'` di paling atas file **hanya** jika komponen membutuhkan state local, event listener, browser APIs, atau React Hooks.
- Semua file, props, API response, dan state **wajib menggunakan TypeScript** (hindari `any`).

### 2. Styling & UI Components (Tailwind CSS + shadcn/ui + Lucide React)
- Gunakan Tailwind utility classes secara konsisten.
- Gunakan fungsi helper `cn(...)` dari `@/lib/utils` untuk penggabungan class Tailwind secara dinamis.
- Gunakan komponen dari `shadcn/ui` untuk konsistensi UI.
- Gunakan ikon dari `lucide-react`.

### 3. API & Data Fetching (TanStack Query + Axios)
- Buat instance Axios terpusat di `@/lib/axios.ts` yang menangani Base URL dan HTTP Interceptors (Inject Header `Authorization: Bearer <token>` otomatis).
- Pisahkan logika pemanggilan API ke folder `src/services/`.
- Gunakan **TanStack Query** (`useQuery`, `useMutation`, `useQueryClient`) melalui custom hooks di `src/hooks/` untuk caching, automatic revalidation, dan state error/loading.

### 4. Form & Validasi (React Hook Form + Zod)
- Setiap form **wajib** divalidasi menggunakan Zod schema (`src/validators/`).
- Integrasikan Zod dengan React Hook Form menggunakan `@hookform/resolvers/zod`.
- Tampilkan error message yang jelas di bawah input field yang gagal validasi.

### 5. State Management Global (Zustand)
- Gunakan **Zustand** untuk mengelola state global:
  - `useAuthStore`: Menyimpan data user aktif (profile, role), token authentication, status login, serta method `setAuth`, `clearAuth`/`logout`.
  - `useFilterStore`: Menyimpan filter aktif (search, pagination, date range, status filter).
- Hindari meletakkan state lokal komponen ke dalam Zustand store.

### 6. Notifikasi & Feedback UI (Sonner)
- Gunakan **Sonner** (`toast.success()`, `toast.error()`, `toast.info()`, `toast.promise()`) untuk memberikan umpan balik (toast feedback) kepada pengguna saat melakukan aksi atau HTTP request (API hit).
- Pastikan `<Toaster />` dari Sonner dipasang pada Root Layout (`src/app/layout.tsx`).

---

## 🚀 Panduan Kualitas Kode & Praktik Terbaik
- **Clean Code**: Tulis fungsi yang modular, berfokus pada 1 tanggung jawab (Single Responsibility Principle).
- **Error Handling**: Tangani error secara tertata di Axios Interceptor & TanStack Query `onError` / `catch` blocks dengan notifikasi Sonner.
- **Environment Variables**: Simpan konfigurasi sensitif (seperti API URL) di `.env.local` dengan prefix `NEXT_PUBLIC_`.
