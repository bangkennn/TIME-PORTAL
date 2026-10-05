# AI Agent Guidelines - Portal STMIK TIME

Aturan dan panduan ini wajib dibaca dan dipatuhi oleh semua AI Agent di setiap awal percakapan (chat).

---

## 🛑 MANDATORY STEP PERTAMA SAAT CHAT DIMULAI
Pada awal percakapan, AI Agent **WAJIB** membaca file berikut untuk mendapatkan konteks lengkap:
1. `[.agents/MEMORY.md](file:///d:/My%20Coding%20App/Portal%20STMIKTIME/.agents/MEMORY.md)` (Memori konteks & riwayat permintaan user)
2. `[.agents/rules/workflow.md](file:///d:/My%20Coding%20App/Portal%20STMIKTIME/.agents/rules/workflow.md)` (Standard Operating Procedure / Workflow 3 Tahap)
3. `[.agents/rules/tech-stack.md](file:///d:/My%20Coding%20App/Portal%20STMIKTIME/.agents/rules/tech-stack.md)` (Standar & konvensi tech stack proyek)

---

## ⚡ Ringkasan Workflow 3 Tahap
1. **Tahap 1 (Analisis & Plan)**: Menganalisis permintaan, jelaskan maksud permintaan, berikan gambaran *Before & After*, perubahan file/kode yang dilakukan, dan hasil akhir yang diharapkan.
2. **Tahap 2 (Approval)**: Tanyakan persetujuan (*approve*) kepada user dan tunggu konfirmasi sebelum mengubah kode.
3. **Tahap 3 (Execution & Re-testing)**: Eksekusi kode secara presisi dan **uji ulang** (misalnya `npm run build`) untuk memastikan **0 error**.

---

## 🛠️ Tech Stack Overview
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Lucide React
- **API & Data Fetching**: TanStack Query + Axios
- **Form & Validation**: React Hook Form + Zod
- **Global State**: Zustand
- **Notification**: Sonner (Toast)
