# Standar Alur Kerja AI Agent (Workflow Rules)

Aturan ini mengatur bagaimana AI Agent **WAJIB** merespons dan mengeksekusi setiap permintaan dari pengguna.

---

## 🚨 MANDATORY: Langkah Awal Memulai Chat
Pada setiap awal percakapan/chat baru, AI Agent **WAJIB** membaca file berikut terlebih dahulu:
1. `[.agents/MEMORY.md](file:///d:/My%20Coding%20App/Portal%20STMIKTIME/.agents/MEMORY.md)` — Memori konteks & riwayat proyek.
2. `[.agents/AGENTS.md](file:///d:/My%20Coding%20App/Portal%20STMIKTIME/.agents/AGENTS.md)` — Panduan utama AI agent.
3. `[.agents/rules/tech-stack.md](file:///d:/My%20Coding%20App/Portal%20STMIKTIME/.agents/rules/tech-stack.md)` — Aturan tech stack proyek.

---

## 🔄 Alur Kerja 3 Tahapan Wajib (3-Step Mandatory Workflow)

### 🔹 Tahap 1: Analisis Permintaan & Penjelasan Rencana
Setiap kali menerima permintaan baru dari pengguna, AI Agent **TIDAK BOLEH** langsung mengubah kode. AI wajib menyajikan penjelasan terstruktur yang mencakup:
1. **Analisis Permintaan**: Penjelasan maksud & tujuan utama dari permintaan pengguna.
2. **Gambaran Before & After**:
   - **Before**: Kondisi kode / fitur saat ini.
   - **After**: Kondisi target setelah perubahan diterapkan.
3. **Detail Rencana Perubahan**: Daftar file yang akan dibuat/diubah dan deskripsi perubahan logikanya.
4. **Hasil Akhir yang Diharapkan**: Penjelasan dampak dan fungsi akhir bagi pengguna.

---

### 🔹 Tahap 2: Konfirmasi Persetujuan Pengguna (User Approval)
- AI Agent harus mengajukan pertanyaan konfirmasi kepada pengguna:
  > *"Apakah rencana perubahan di atas sudah disetujui (approved) untuk dijalankan, atau apakah ada saran/perbaikan terlebih dahulu?"*
- AI Agent **harus berhenti sejenak** dan menunggu jawaban / persetujuan dari pengguna sebelum mengeksekusi penulisan kode atau perintah.

---

### 🔹 Tahap 3: Eksekusi Kode & Pengujian Ulang (Testing & Verification)
- Setelah menerima persetujuan (*approval*) dari pengguna, eksekusi kode sesuai rencana.
- Setelah kode diubah/diperbaiki, AI Agent **WAJIB** menguji kembali (misalnya menjalankan perintah build/lint/test) untuk memastikan **TIDAK ADA kesalahan kode, type error, atau broken build**.
