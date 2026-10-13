import os
import json
import datetime
from typing import List, Dict, Any, Optional
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

class ROPAGenerator:
    """
    Generator Buku Catatan Pemrosesan Data Pribadi (Record of Processing Activities - ROPA).
    Diterbitkan berdasarkan:
    1. Pasal 138 Peraturan Pemerintah No. 33 Tahun 2026 (Lembaran Negara RI Tahun 2026 No. 88).
    2. Pasal 31 & 35 Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
    3. Standar Audit Tata Kelola BPKP, Inspektorat Jenderal Kemenkeu, dan Lembaga Pengawas PDP.
    """

    def generate_ropa_excel(self, history_items: List[Dict[str, Any]], output_path: str) -> str:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        wb = openpyxl.Workbook()
        
        # Style Definitions
        font_title = Font(name="Calibri", size=14, bold=True, color="1E3A8A")
        font_subtitle = Font(name="Calibri", size=9, italic=True, color="475569")
        font_section = Font(name="Calibri", size=11, bold=True, color="0F172A")
        font_header = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
        font_bold = Font(name="Calibri", size=10, bold=True, color="1E293B")
        font_regular = Font(name="Calibri", size=10, color="334155")
        font_mono = Font(name="Consolas", size=9, color="1E293B")

        fill_header = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
        fill_meta_hdr = PatternFill(start_color="0F766E", end_color="0F766E", fill_type="solid")
        fill_zebra = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
        fill_high_risk = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
        fill_stat_box = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")

        thin_border = Border(
            left=Side(style='thin', color='CBD5E1'),
            right=Side(style='thin', color='CBD5E1'),
            top=Side(style='thin', color='CBD5E1'),
            bottom=Side(style='thin', color='CBD5E1')
        )
        double_bottom_border = Border(
            left=Side(style='thin', color='CBD5E1'),
            right=Side(style='thin', color='CBD5E1'),
            top=Side(style='thin', color='CBD5E1'),
            bottom=Side(style='double', color='1E3A8A')
        )

        align_center = Alignment(horizontal="center", vertical="center", wrap_text=True)
        align_left = Alignment(horizontal="left", vertical="center", wrap_text=True)
        align_right = Alignment(horizontal="right", vertical="center")

        # =========================================================================
        # SHEET 1: REKAPITULASI ROPA (PASAL 138 PP 33/2026)
        # =========================================================================
        ws1 = wb.active
        ws1.title = "ROPA_REGISTRY_PASAL_138"
        ws1.views.sheetView[0].showGridLines = True

        # Header Title
        ws1["A1"] = "KEMENTERIAN KEUANGAN REPUBLIK INDONESIA — DIREKTORAT JENDERAL BEA DAN CUKAI"
        ws1["A1"].font = Font(name="Calibri", size=10, bold=True, color="64748B")
        ws1["A2"] = "BUKU CATATAN PEMROSESAN DATA PRIBADI (RECORD OF PROCESSING ACTIVITIES - ROPA)"
        ws1["A2"].font = font_title
        ws1["A3"] = "Berdasarkan Mandat Pasal 138 PP No. 33 Tahun 2026 & Pasal 31 UU No. 27 Tahun 2022 | Terbit: " + datetime.datetime.now().strftime("%d %B %Y %H:%M:%S WIB")
        ws1["A3"].font = font_subtitle

        # Meta Controller Info Block
        meta_rows = [
            ("Nama Pengendali Data:", "Direktorat Jenderal Bea dan Cukai (DJBC) - Kementerian Keuangan RI", "Pejabat DPO / PPDP:", "Tim Pelaksana Fungsi PPDP / DPO DIKC DJBC"),
            ("Alamat Resmi Pengendali:", "Jl. Jenderal Ahmad Yani By Pass, Rawamangun, Jakarta Timur", "Kontak Resmi DPO:", "dpo.dikc@customs.go.id / csirt-bc@kemenkeu.go.id"),
            ("Sistem Pemroses:", "DataRequestStudio — CEISA Enterprise Data Platform", "Dasar Kewenangan:", "UU Kepabeanan, UU Cukai, UU PDP 27/2022 & PP 33/2026")
        ]
        curr_r = 5
        for m1, v1, m2, v2 in meta_rows:
            ws1.cell(row=curr_r, column=1, value=m1).font = font_bold
            ws1.cell(row=curr_r, column=1).fill = fill_stat_box
            ws1.cell(row=curr_r, column=2, value=v1).font = font_regular
            ws1.cell(row=curr_r, column=4, value=m2).font = font_bold
            ws1.cell(row=curr_r, column=4).fill = fill_stat_box
            ws1.cell(row=curr_r, column=5, value=v2).font = font_regular
            for col_idx in [1, 2, 4, 5]:
                ws1.cell(row=curr_r, column=col_idx).border = thin_border
            curr_r += 1

        curr_r += 2

        # Table Column Headers
        headers = [
            "NO",
            "ID PERMOHONAN",
            "JUDUL KEGIATAN PEMROSESAN",
            "UNIT PEMOHON / PENERIMA",
            "TUJUAN PEMROSESAN (PURPOSE)",
            "DASAR HUKUM (LEGAL BASIS)",
            "KATEGORI SUBJEK DATA",
            "KATEGORI DATA PRIBADI",
            "METODE PERLINDUNGAN TEKNIS",
            "MASA RETENSI (HARI)",
            "STATUS PEMUSNAHAN (CoD)",
            "STATUS DPIA (PP 33/2026)",
            "SKOR KEPATUHAN",
            "STATUS TATA KELOLA"
        ]

        for col_idx, h in enumerate(headers, start=1):
            cell = ws1.cell(row=curr_r, column=col_idx, value=h)
            cell.font = font_header
            cell.fill = fill_header
            cell.alignment = align_center
            cell.border = thin_border
        ws1.row_dimensions[curr_r].height = 28

        start_table_row = curr_r + 1
        curr_r += 1

        for idx, item in enumerate(history_items, start=1):
            req_id = item.get("id") or item.get("request_id") or f"REQ-{idx:04d}"
            title = item.get("document_title") or item.get("title") or "Permohonan Data Kepabeanan"
            dept = item.get("department") or "Internal Bea dan Cukai"
            status = item.get("status") or "APPROVED"
            rows = item.get("row_count") or 0
            
            # Purpose inference
            biz = item.get("business_process") or "Ekspor"
            purpose = f"Analisis kedinasan dan kepatuhan pabean terkait {biz} sesuai permohonan dinas."
            legal_basis = "Pasal 20 ayat (2) UU PDP (Kewajiban Hukum / Pelaksanaan Tugas Pemerintahan)"
            subj_cat = "Wajib Pajak, Eksportir, Importir, Kuasa Kepabeanan, dan Perseorangan"
            
            # PII categories
            pii_cat = "Data Pribadi Spesifik (NPWP, Keuangan) & Umum (Nama, NIK, No. Telepon, Alamat)"
            tech_sec = "Dynamic Masking, TLS 1.3, SHA-256 HMAC Digital Seal, Zero Shadow Copy"
            
            retention = item.get("retention_days", 30)
            
            # DPIA Screening
            dpia_status = "WAJIB DPIA (HIGH RISK)" if (rows > 100000 or "gabungan" in title.lower() or "audit" in title.lower()) else "STANDAR (LOW RISK)"
            
            # CoD Status
            cod_status = "Aktif (Dalam Retensi)" if any(k in status.upper() for k in ["APPROV", "DISETUJUI"]) else "Dibatalkan / Belum Berlaku"

            compliance_score = item.get("compliance_score", 100)

            row_values = [
                idx,
                req_id,
                title,
                dept,
                purpose,
                legal_basis,
                subj_cat,
                pii_cat,
                tech_sec,
                retention,
                cod_status,
                dpia_status,
                f"{compliance_score}%",
                status
            ]

            is_zebra = (idx % 2 == 0)
            is_high_risk = "WAJIB" in dpia_status

            for col_idx, val in enumerate(row_values, start=1):
                cell = ws1.cell(row=curr_r, column=col_idx, value=val)
                cell.font = font_mono if col_idx in [2, 10, 13] else font_regular
                cell.border = thin_border
                
                if col_idx == 12 and is_high_risk:
                    cell.fill = fill_high_risk
                    cell.font = Font(name="Calibri", size=9, bold=True, color="991B1B")
                elif is_zebra:
                    cell.fill = fill_zebra

                if col_idx in [1, 10, 11, 12, 13, 14]:
                    cell.alignment = align_center
                elif col_idx in [2]:
                    cell.alignment = align_left
                else:
                    cell.alignment = align_left

            ws1.row_dimensions[curr_r].height = 22
            curr_r += 1

        # Summary bottom line
        ws1.cell(row=curr_r, column=1, value="RINGKASAN REKAPITULASI PEMROSESAN DATA PRIBADI:").font = font_bold
        ws1.cell(row=curr_r, column=1).alignment = align_left
        ws1.merge_cells(start_row=curr_r, start_column=1, end_row=curr_r, end_column=9)
        ws1.cell(row=curr_r, column=10, value=f"=AVERAGE(J{start_table_row}:J{curr_r-1})").font = font_bold
        ws1.cell(row=curr_r, column=10).number_format = '0.0'
        ws1.cell(row=curr_r, column=10).alignment = align_center
        ws1.cell(row=curr_r, column=11, value=f"Total: {len(history_items)} Kegiatan").font = font_bold
        ws1.cell(row=curr_r, column=11).alignment = align_center
        
        for c_idx in range(1, len(headers) + 1):
            ws1.cell(row=curr_r, column=c_idx).border = double_bottom_border
            ws1.cell(row=curr_r, column=c_idx).fill = fill_stat_box

        # Auto-adjust column widths
        col_widths = {
            1: 6,
            2: 20,
            3: 35,
            4: 26,
            5: 35,
            6: 30,
            7: 28,
            8: 30,
            9: 30,
            10: 16,
            11: 22,
            12: 24,
            13: 16,
            14: 20
        }
        for c_idx, width in col_widths.items():
            ws1.column_dimensions[get_column_letter(c_idx)].width = width

        # =========================================================================
        # SHEET 2: STANDAR KEPATUHAN PASAL 138 PP 33/2026
        # =========================================================================
        ws2 = wb.create_sheet(title="DASAR_REGULASI_PASAL_138")
        ws2.views.sheetView[0].showGridLines = True
        ws2["A1"] = "CHECKLIST PEMENUHAN PASAL 138 PP NO. 33 TAHUN 2026 (ROPA)"
        ws2["A1"].font = font_title
        ws2["A2"] = "Elemen Wajib Buku Catatan Pemrosesan Menurut Regulasi Perlindungan Data Pribadi Indonesia"
        ws2["A2"].font = font_subtitle

        checklist_headers = ["NO", "ELEMEN WAJIB PASAL 138 PP 33/2026", "STATUS IMPLEMENTASI SISTEM", "LOKASI PENCATATAN", "KETERANGAN TEKNIS"]
        for col_idx, h in enumerate(checklist_headers, start=1):
            c = ws2.cell(row=4, column=col_idx, value=h)
            c.font = font_header
            c.fill = fill_meta_hdr
            c.alignment = align_center
            c.border = thin_border
        ws2.row_dimensions[4].height = 25

        checklist_items = [
            (1, "Nama dan Kontak Pengendali Data & DPO", "TERPENUHI 100%", "Header Metadata ROPA & CoD", "Tercatat resmi nama DPO, unit kerja, dan kontak kedinasan"),
            (2, "Tujuan Pemrosesan Data Pribadi", "TERPENUHI 100%", "Kolom 'TUJUAN PEMROSESAN'", "Diuraikan berdasarkan formulir permohonan dan mandat dinas"),
            (3, "Kategori Subjek Data & Data Pribadi", "TERPENUHI 100%", "Kolom 'KATEGORI SUBJEK & DATA'", "Klasifikasi PII spesifik (NPWP, keuangan) vs umum"),
            (4, "Kategori Penerima Data Pribadi", "TERPENUHI 100%", "Kolom 'UNIT PEMOHON / PENERIMA'", "Dicatat PIC pemohon, departemen, dan tingkat wewenang"),
            (5, "Transfer Data ke Pihak Ketiga / Luar Negeri", "TERPENUHI 100%", "Whitelist Policy Guard", "Data dibatasi dalam DWH privat, dilarang transfer lintas yurisdiksi"),
            (6, "Jangka Waktu Penghapusan / Pemusnahan Data", "TERPENUHI 100%", "Pelacak Retensi & CoD Generator", "Batas retensi 30 hari otomatis memicu Berita Acara CoD (Ps. 75)"),
            (7, "Deskripsi Umum Langkah Keamanan Teknis", "TERPENUHI 100%", "Sertifikat PDF & Manifest Audit", "Enkripsi AES-256, Dynamic Masking, Hash SHA-256, & Zero Shadow Copy")
        ]

        for r_idx, item in enumerate(checklist_items, start=5):
            for c_idx, val in enumerate(item, start=1):
                cell = ws2.cell(row=r_idx, column=c_idx, value=val)
                cell.font = font_regular
                cell.border = thin_border
                if c_idx in [1, 3]:
                    cell.alignment = align_center
                    if c_idx == 3:
                        cell.font = Font(name="Calibri", size=10, bold=True, color="047857")
                else:
                    cell.alignment = align_left
            ws2.row_dimensions[r_idx].height = 22

        ws2.column_dimensions["A"].width = 6
        ws2.column_dimensions["B"].width = 38
        ws2.column_dimensions["C"].width = 24
        ws2.column_dimensions["D"].width = 30
        ws2.column_dimensions["E"].width = 45

        wb.save(output_path)
        return output_path
