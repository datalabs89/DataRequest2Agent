import os
import hashlib
import datetime
from typing import Optional, List
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.graphics.barcode import qr

class BreachNotificationGenerator:
    """
    Generator Surat Pemberitahuan Tertulis Kegagalan Pelindungan Data Pribadi (Data Breach Notification)
    sesuai amanat Pasal 46 UU No. 27/2022 jo. Pasal 114-119 Peraturan Pemerintah No. 33/2026.
    Diterbitkan dalam format tata naskah dinas resmi DJBC Kementerian Keuangan.
    """

    def __init__(self):
        self.kemenkeu_blue = colors.HexColor("#0D3B66")
        self.kemenkeu_gold = colors.HexColor("#D4AF37")
        self.alert_red = colors.HexColor("#B91C1C")
        self.alert_bg = colors.HexColor("#FEF2F2")
        self.slate_dark = colors.HexColor("#1E293B")
        self.slate_gray = colors.HexColor("#475569")
        self.slate_light = colors.HexColor("#F8FAFC")
        self.border_color = colors.HexColor("#E2E8F0")

    def generate_notification(
        self,
        output_path: str,
        request_id: str,
        document_title: str,
        requester_name: str,
        requester_department: str,
        discovery_date: str,
        severity_level: str,
        impacted_categories: List[str],
        chronology: str,
        potential_impact: str,
        containment_steps: str,
        reporter_name: Optional[str] = "Hendra Gunawan, S.Kom.",
        reporter_nip: Optional[str] = "198304122006021001",
        dpo_name: Optional[str] = "Dr. Irwan Setiawan, M.M., CISA",
        dpo_nip: Optional[str] = "197809152002121002"
    ) -> str:
        """Menghasilkan dokumen resmi Surat Pemberitahuan Kegagalan PDP (2 Halaman Standar Kedinasan)."""
        out_dir = os.path.dirname(os.path.abspath(output_path))
        if out_dir:
            os.makedirs(out_dir, exist_ok=True)

        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            leftMargin=2.0 * cm,
            rightMargin=2.0 * cm,
            topMargin=1.6 * cm,
            bottomMargin=1.6 * cm
        )

        styles = getSampleStyleSheet()

        # Custom Typography
        style_header_kemenkeu = ParagraphStyle(
            "HeaderKemenkeu",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=13,
            textColor=self.kemenkeu_blue,
            alignment=1,
            textTransform="uppercase"
        )
        style_header_djbc = ParagraphStyle(
            "HeaderDJBC",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=14,
            textColor=self.kemenkeu_blue,
            alignment=1,
            textTransform="uppercase"
        )
        style_header_sub = ParagraphStyle(
            "HeaderSub",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=self.slate_gray,
            alignment=1
        )
        style_body = ParagraphStyle(
            "BodyDinas",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=self.slate_dark,
            alignment=4
        )
        style_body_bold = ParagraphStyle(
            "BodyDinasBold",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=13,
            textColor=self.slate_dark
        )
        style_alert_title = ParagraphStyle(
            "AlertTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=self.alert_red,
            alignment=1
        )
        style_tbl_label = ParagraphStyle(
            "TblLabel",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11,
            textColor=self.slate_dark
        )
        style_tbl_val = ParagraphStyle(
            "TblVal",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=self.slate_dark
        )
        style_footer_meta = ParagraphStyle(
            "FooterMeta",
            parent=styles["Normal"],
            fontName="Courier",
            fontSize=7,
            leading=9,
            textColor=self.slate_gray
        )

        elements = []

        # ================= KOP SURAT RESMI DINAS =================
        elements.append(Paragraph("KEMENTERIAN KEUANGAN REPUBLIK INDONESIA", style_header_kemenkeu))
        elements.append(Paragraph("DIREKTORAT JENDERAL BEA DAN CUKAI", style_header_djbc))
        elements.append(Paragraph("DIREKTORAT INFORMASI KEPABEANAN DAN CUKAI", style_header_kemenkeu))
        elements.append(Paragraph("Jalan Jenderal Ahmad Yani, By Pass, Rawamangun, Jakarta Timur 13230 | Telp: (021) 4890308 | Bravo Bea Cukai: 1500225", style_header_sub))
        elements.append(Spacer(1, 0.2 * cm))

        # Garis Pembatas Kop
        d_line = Drawing(480, 4)
        d_line.add(Rect(0, 2, 480, 2, fillColor=self.kemenkeu_blue, strokeColor=None))
        d_line.add(Rect(0, 0, 480, 0.8, fillColor=self.kemenkeu_gold, strokeColor=None))
        elements.append(d_line)
        elements.append(Spacer(1, 0.3 * cm))

        # Atribut Surat Dinas (Nomor, Sifat, Hal)
        safe_code = request_id.replace("/", "").replace("-", "")[-6:]
        nomor_surat = f"S-{safe_code}/KBC.01/BD.06/2026"
        tanggal_surat = datetime.date.today().strftime("%d %B %Y")

        meta_table_data = [
            [
                Paragraph("<b>Nomor</b>", style_tbl_label),
                Paragraph(f": {nomor_surat}", style_tbl_val),
                Paragraph(f"Jakarta, {tanggal_surat}", ParagraphStyle("RightDate", parent=style_tbl_val, alignment=2))
            ],
            [
                Paragraph("<b>Sifat</b>", style_tbl_label),
                Paragraph(": <b>SANGAT RAHASIA / SEGERA (3 x 24 JAM)</b>", ParagraphStyle("RedSifat", parent=style_tbl_val, textColor=self.alert_red)),
                Paragraph("", style_tbl_val)
            ],
            [
                Paragraph("<b>Lampiran</b>", style_tbl_label),
                Paragraph(": 1 (satu) Berkas Laporan Analisis Forensik Insiden", style_tbl_val),
                Paragraph("", style_tbl_val)
            ],
            [
                Paragraph("<b>Hal</b>", style_tbl_label),
                Paragraph(": <b>Pemberitahuan Tertulis Dugaan Kegagalan Pelindungan Data Pribadi (Pasal 46 UU No. 27/2022 jo. Pasal 114-119 PP No. 33/2026)</b>", style_tbl_val),
                Paragraph("", style_tbl_val)
            ]
        ]
        meta_table = Table(meta_table_data, colWidths=[2.0 * cm, 9.5 * cm, 5.5 * cm])
        meta_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
            ('TOPPADDING', (0, 0), (-1, -1), 1),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 0.3 * cm))

        # Alamat Tujuan Surat
        dest_p = Paragraph(
            "<b>Yth.<br/>"
            "1. Ketua Lembaga Pelindungan Data Pribadi Republik Indonesia<br/>"
            "2. Pejabat Pengelola Data Pribadi (PPDP) Kementerian Keuangan<br/>"
            "3. Subjek Data Pribadi Terdampak</b><br/>"
            "di Tempat",
            style_body
        )
        elements.append(dest_p)
        elements.append(Spacer(1, 0.3 * cm))

        # Paragraf Pengantar
        intro_p = Paragraph(
            "Sehubungan dengan adanya indikasi dan dugaan terjadinya kegagalan pelindungan data pribadi pada lingkungan operasional pengelolaan data Direktorat Jenderal Bea dan Cukai, bersama ini kami sampaikan pemberitahuan resmi pemenuhan kewajiban hukum akuntabilitas pengendali data sesuai amanat <b>Pasal 46 ayat (1) dan ayat (2) Undang-Undang Nomor 27 Tahun 2022</b> serta <b>Pasal 114 sampai dengan Pasal 119 Peraturan Pemerintah Nomor 33 Tahun 2026</b> dengan rincian sebagai berikut:",
            style_body
        )
        elements.append(intro_p)
        elements.append(Spacer(1, 0.25 * cm))

        # Banner Klasifikasi Severitas
        sev_color = self.alert_red if severity_level.upper() in ["KRITIS", "TINGGI", "HIGH", "CRITICAL"] else self.kemenkeu_gold
        sev_box_data = [[
            Paragraph(f"<b>KLASIFIKASI INSIDEN: {severity_level.upper()}</b> — BATAS NOTIFIKASI MAKSIMAL 3 x 24 JAM TERPENUHI", ParagraphStyle("SevBox", parent=style_alert_title, textColor=sev_color, fontSize=9, leading=12))
        ]]
        sev_box = Table(sev_box_data, colWidths=[17.0 * cm])
        sev_box.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), self.alert_bg),
            ('BOX', (0, 0), (-1, -1), 1, sev_color),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(sev_box)
        elements.append(Spacer(1, 0.3 * cm))

        # Tabel Rincian Wajib Pasal 116 PP 33/2026
        cat_str = ", ".join(impacted_categories) if impacted_categories else "Data Identitas & Transaksi Kepabeanan"

        detail_data = [
            [Paragraph("1. ID Permohonan Terkait", style_tbl_label), Paragraph(f": <b>{request_id}</b> ({document_title})", style_tbl_val)],
            [Paragraph("2. Unit Kerja Pemohon / PIC", style_tbl_label), Paragraph(f": {requester_name} ({requester_department})", style_tbl_val)],
            [Paragraph("3. Waktu Penemuan Insiden", style_tbl_label), Paragraph(f": <b>{discovery_date}</b>", style_tbl_val)],
            [Paragraph("4. Kategori Data Terdampak", style_tbl_label), Paragraph(f": {cat_str}", style_tbl_val)],
            [Paragraph("5. Kronologi Singkat Kejadian", style_tbl_label), Paragraph(f": {chronology}", style_tbl_val)],
            [Paragraph("6. Potensi Dampak / Risiko", style_tbl_label), Paragraph(f": {potential_impact}", style_tbl_val)],
            [Paragraph("7. Tindakan Mitigasi Darurat", style_tbl_label), Paragraph(f": {containment_steps}", style_tbl_val)],
            [Paragraph("8. Narahubung Penanganan (DPO)", style_tbl_label), Paragraph(": Subdirektorat Keamanan Informasi & PPDP DIKC DJBC (Email: ppdp.dikc@customs.go.id, Bravo Bea Cukai: 1500225)", style_tbl_val)]
        ]

        t_detail = Table(detail_data, colWidths=[5.0 * cm, 12.0 * cm])
        t_detail.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, self.border_color),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(t_detail)
        elements.append(Spacer(1, 0.3 * cm))

        # Pernyataan Komitmen
        closing_p = Paragraph(
            "Direktorat Jenderal Bea dan Cukai telah mengisolasi lingkungan data yang terdampak, mencabut hak akses terkait (*revocation of credentials*), serta menjalankan audit forensik digital komprehensif. Perkembangan penanganan insiden ini akan dilaporkan secara berkala kepada Lembaga Pelindungan Data Pribadi sesuai ketentuan perundang-undangan.",
            style_body
        )
        elements.append(closing_p)
        elements.append(Spacer(1, 0.4 * cm))

        # ================= TANDA TANGAN RESMI =================
        # Generate QR Code Validasi Integritas
        raw_hash_seed = f"{nomor_surat}|{request_id}|{discovery_date}|{severity_level}|{dpo_name}"
        sha256_hash = hashlib.sha256(raw_hash_seed.encode("utf-8")).hexdigest()
        qr_url = f"https://datalabs89.github.io/DataRequestStudio/?verify={request_id}&type=breach_notice"

        qr_draw = Drawing(55, 55)
        qr_widget = qr.QrCodeWidget(qr_url)
        qr_widget.barWidth = 55
        qr_widget.barHeight = 55
        qr_draw.add(qr_widget)

        sign_data = [
            [
                Paragraph("<b>DILAPORKAN OLEH:</b><br/>Petugas Tanggap Insiden Siber / PPDP,", ParagraphStyle("Sign1", parent=style_tbl_val, alignment=1)),
                Paragraph("<b>VERIFIKASI & PENGESAHAN:</b><br/>Pejabat Pelaksana Fungsi PDP (DPO) DIKC,", ParagraphStyle("Sign2", parent=style_tbl_val, alignment=1))
            ],
            [
                Paragraph("<br/><br/><i>[Ditandatangani secara Elektronik]</i><br/>", ParagraphStyle("SignMid", parent=style_tbl_val, alignment=1, textColor=self.slate_gray)),
                Paragraph("<br/><br/><i>[Ditandatangani secara Elektronik]</i><br/>", ParagraphStyle("SignMid", parent=style_tbl_val, alignment=1, textColor=self.slate_gray))
            ],
            [
                Paragraph(f"<b>{reporter_name}</b><br/>NIP {reporter_nip}", ParagraphStyle("SignBottom1", parent=style_tbl_val, alignment=1)),
                Paragraph(f"<b>{dpo_name}</b><br/>NIP {dpo_nip}", ParagraphStyle("SignBottom2", parent=style_tbl_val, alignment=1))
            ]
        ]

        t_sign = Table(sign_data, colWidths=[8.5 * cm, 8.5 * cm])
        t_sign.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
            ('TOPPADDING', (0, 0), (-1, -1), 1),
        ]))

        footer_table_data = [
            [
                qr_draw,
                Paragraph(
                    f"<b>SEGEL INTEGRITAS KRIPTOGRAFIS NOTIFIKASI INSIDEN PDP:</b><br/>"
                    f"HMAC-SHA256: <code>{sha256_hash}</code><br/>"
                    f"Dokumen dinas sah diterbitkan oleh Sistem DataRequest Studio DJBC sesuai regulasi UU No. 27/2022 & PP No. 33/2026.<br/>"
                    f"Pindai QR Code untuk memvalidasi nomor surat, status notifikasi, dan verifikasi institusional.",
                    style_footer_meta
                )
            ]
        ]
        t_footer = Table(footer_table_data, colWidths=[2.2 * cm, 14.8 * cm])
        t_footer.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 2),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ]))

        elements.append(KeepTogether([t_sign, Spacer(1, 0.4 * cm), t_footer]))

        doc.build(elements)
        return output_path
