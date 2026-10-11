# DataRequest Studio

> **Unified Data Service & Metadata Platform**  
> **Platform Layanan dan Tata Kelola Data Terpadu** — *Layanan Data Cepat, Tata Kelola Tepat.*  
> Otomasi pemenuhan permohonan data berbasis OpenMetadata & audit independen.

---

## 🌟 Gambaran Umum

**DataRequest Studio** adalah platform enterprise berbasis sistem **Multi-Agent AI** yang mengotomatisasi alur pemenuhan permohonan data (*data requisition*) secara terstruktur, aman, dan patuh regulasi perlindungan data pribadi (PDP):

1. **Ekstraksi Formulir Permohonan (PDF)** $\to$ Mengekstrak spesifikasi, filter bisnis, periode waktu, pemohon, dan klausul kerahasiaan.
2. **Koneksi OpenMetadata Catalog** $\to$ Menemukan tabel DWH resmi, tipe data, dan relasi lineage (*Strict Schema Grounding*).
3. **Sintesis Query SQL Teroptimasi** $\to$ Merumuskan SQL (PostgreSQL, Trino, BigQuery, DuckDB) dengan *Dynamic Masking* pada data sensitif PII (NIK, Nama, No Telepon).
4. **Audit Independen & Feedback Verifikator** $\to$ Mengaudit kesesuaian filter, proteksi anti-Cartesian, dan menyediakan sistem *digital sign-off* resmi bagi Data Steward/Governance.
5. **Ekspor Data & CMS Repositori** $\to$ Menghasilkan:
   - **Excel (.xlsx 3-Sheet)**: Data tabular berformat rapi, Lembar Audit & Provenance, serta Kamus Data resmi.
   - **CSV (.csv)**: Raw dataset UTF-8.
   - **Sertifikat PDF Resmi**: Surat Pengesahan & Bukti Kepatuhan Tata Kelola Data bertanda tangan digital.
   - **Paket Pemenuhan Lengkap (.ZIP)**: Arsip komprehensif berisi Excel, CSV, Sertifikat PDF, SQL, spec JSON, dan manifest README.
   - **CMS Riwayat Permohonan**: Modul arsip, pelacakan, dan tombol **Ekspor Rekapitulasi CSV** untuk komite audit.

---

## 🚀 Fitur Unggulan Enterprise

- **📊 Dashboard Analitik & SLA Tata Kelola**:
  Menampilkan ringkasan metrik kepatuhan (Compliance Rate %), total baris data yang diserahkan, volume atribut PII terlindungi, dan diagram distribusi per unit kerja/divisi pemohon secara interaktif.
- **⚙️ Konfigurasi Koneksi OpenMetadata Live & MCP**:
  Mendukung pengaturan endpoint REST API/MCP OpenMetadata secara real-time melalui modal pengaturan UI, pengujian koneksi langsung (*Test Connection*), serta mode otomatis *fallback* ke katalog DWH enterprise internal jika server offline.
- **🔒 Fleksibilitas Kebijakan Proteksi PII (PII Masking Policy)**:
  Pilihan strategi proteksi data pribadi:
  1. *Masking Parsial*: Menyamarkan sebagian karakter (contoh: `Ahm***zi` & `320101******0001`).
  2. *Pseudonimisasi Hash Kriptografis*: Menghasilkan token deterministik acak (Hex Pseudonym).
  3. *Redaksi Total*: Mengganti data sensitif dengan tag `[TERLINDUNGI_UU_PDP]`.
- **📄 Smart OCR & Structural Fallback**:
  Dukungan untuk dokumen PDF hasil pemindaian/scan fisik (*non-searchable*). Sistem mendeteksi ketiadaan stream teks dan otomatis mengaktifkan fallback metadata & template pemohon agar alur kerja tidak terhenti.
- **🛡️ SQLite DWH Engine dengan Circuit Breaker Read-Only**:
  Database warehouse lokal (`outputs/dwh_enterprise.db`) dengan 250+ baris data transaksi terstruktur. Sistem mengisolasi eksekusi dalam mode *read-only URI* (`file:...mode=ro`) yang secara fisik memblokir query perusak (DROP, DELETE, UPDATE, INSERT).
- **🔐 Keamanan & Kontrol Akses Ketat (Server-Side RBAC & Segregation of Duties)**:
  Pemisahan wewenang 4 peran (*Pemohon Data / Analyst*, *Data Steward*, *Data Engineer*, dan *Auditor IT*). Endpoint otorisasi diproteksi di lapisan backend FastAPI dengan header `X-User-Role`, mencegah *self-approval* secara absolut.
- **🔏 Integritas Kriptografis Anti-Manipulasi (SHA-256 Digital Fingerprint)**:
  Setiap pengesahan data menghasilkan kode *hash* digital satu arah yang mengikat ID Permohonan, SQL final, nama verifikator, keputusan, dan stempel waktu. Kode ini dicantumkan pada Sertifikat PDF resmi, sheet *AUDIT_PROVENANCE* berkas Excel, dan manifes ZIP.
- **🔄 Alur Revisi & Penyesuaian Interaktif**:
  Dukungan alur kerja kolaboratif ketika verifikator meminta revisi data (*Interactive Revision Loop*) tanpa mengharuskan pemohon mengunggah ulang dokumen dari awal.

---

## 🏗️ Struktur Proyek

```text
DataRequest2Agent/
├── backend/
│   ├── app.py                     # FastAPI REST API, streaming SSE & static server
│   ├── coordinator.py             # Koordinator orkestrator 5 tahap pipeline
│   ├── pdf_parser.py              # Parser teks dan formulir PDF + Scan Fallback
│   ├── openmetadata_connector.py  # Konektor OpenMetadata MCP & Dynamic Config
│   ├── sql_generator.py           # Generator SQL ber-masking PII (Partial/Hash/Redact)
│   ├── independent_verifier.py    # Auditor kepatuhan & fidelity independen
│   ├── certificate_generator.py   # Generator Sertifikat PDF Otorisasi Data (ReportLab)
│   ├── data_exporter.py           # Generator Excel 3-sheet, CSV, Sertifikat & ZIP
│   ├── history_manager.py         # CMS Repositori Riwayat, Analitik & Ekspor CSV
│   ├── db_engine.py               # SQLite Enterprise DWH Engine + Read-Only Circuit Breaker
│   ├── models.py                  # Pydantic data schemas & validation
│   └── create_samples.py          # Generator dokumen contoh PDF resmi
├── frontend/
│   ├── index.html                 # UI Enterprise Dashboard (Tailwind + Lucide)
│   ├── app.js                     # Logika antarmuka, SSE stream, CMS, Analitik & Verifier sign-off
│   └── styles.css                 # Custom styling
├── samples/                       # Dokumen PDF contoh permohonan resmi
├── outputs/                       # Direktori file Excel, CSV, ZIP, Sertifikat PDF & history.json
└── run_server.py                  # Skrip peluncur server (port 8000)
```

---

## 💻 Cara Menjalankan

Jalankan server lokal:
```bash
python run_server.py
```
Buka peramban di:  
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**
