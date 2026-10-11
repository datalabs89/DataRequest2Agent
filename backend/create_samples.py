import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_sample_pdf_1(filepath: str):
    """Dokumen Sampel 1: Internal Bea dan Cukai (DJBC)."""
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    story = []

    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#1E3A8A'),
        alignment=1
    )
    sub_style = ParagraphStyle(
        'SubStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1E293B')
    )
    label_style = ParagraphStyle(
        'LabelStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0F172A')
    )

    story.append(Paragraph("KEMENTERIAN KEUANGAN REPUBLIK INDONESIA", sub_style))
    story.append(Paragraph("DIREKTORAT JENDERAL BEA DAN CUKAI", header_style))
    story.append(Paragraph("FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN", sub_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceAfter=15))

    info_data = [
        [Paragraph("Nomor Permohonan", label_style), Paragraph(": REQ-2026-BC-089", body_style)],
        [Paragraph("Tanggal Pengajuan", label_style), Paragraph(": 10 Oktober 2026", body_style)],
        [Paragraph("Nama Pemohon (PIC)", label_style), Paragraph(": Ahmad Fauzi, S.Kom", body_style)],
        [Paragraph("Unit Kerja / Divisi", label_style), Paragraph(": Internal Bea dan Cukai", body_style)],
        [Paragraph("Sub-Unit / Direktorat", label_style), Paragraph(": Direktorat Penindakan dan Penyidikan (P2)", body_style)],
        [Paragraph("Tujuan Penggunaan Data", label_style), Paragraph(": Evaluasi Profil Risiko Pelanggaran Kepabeanan & Analisis Pola Transaksi Ekspor-Impor Q3", body_style)],
        [Paragraph("Periode Data Diminta", label_style), Paragraph(": 2026-07-01 s/d 2026-09-30", body_style)],
        [Paragraph("Klasifikasi Akses", label_style), Paragraph(": Rahasia Negara / Terbatas (Regulasi PDP & Kepabeanan)", body_style)]
    ]
    t1 = Table(info_data, colWidths=[160, 360])
    t1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t1)
    story.append(Spacer(1, 15))

    story.append(Paragraph("<b>Spesifikasi Kebutuhan Atribut Data:</b>", label_style))
    story.append(Spacer(1, 6))

    spec_data = [
        ["No", "Nama Kolom / Entitas", "Deskripsi Kebutuhan", "Kriteria Khusus / Filter"],
        ["1", "ID Transaksi & Waktu", "transaction_id, transaction_date", "Periode 01 Juli 2026 s/d 30 September 2026"],
        ["2", "Nominal & Pembayaran", "total_amount, payment_method", "Hanya transaksi berstatus SUCCESS"],
        ["3", "Profil Entitas / Wajib Pajak", "customer_id, customer_name, NIK", "Wajib pajak segmen PRIORITAS"],
        ["4", "Kontak & Wilayah", "phone_number, city", "Masking NIK dan No Kontak sesuai regulasi PDP"]
    ]
    t2 = Table(spec_data, colWidths=[30, 140, 170, 180])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t2)
    story.append(Spacer(1, 15))

    notice_text = """
    <b>Pernyataan Kepatuhan Integritas & UU PDP:</b><br/>
    Data yang diperoleh semata-mata digunakan untuk kepentingan kedinasan pengawasan kepabeanan dan penerimaan negara. Dilarang mendistribusikan data tanpa persetujuan tertulis Pejabat Pengelola Data (Data Steward).
    """
    story.append(Paragraph(notice_text, ParagraphStyle('Notice', parent=styles['Normal'], fontSize=8.5, leading=12, textColor=colors.HexColor('#475569'))))
    doc.build(story)
    print(f"Generated sample 1: {filepath}")

def generate_sample_pdf_2(filepath: str):
    """Dokumen Sampel 2: Internal Kemenkeu (DJP / BKF / DJPb)."""
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    story = []

    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#B45309'),
        alignment=1
    )
    sub_style = ParagraphStyle(
        'SubStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1E293B')
    )
    label_style = ParagraphStyle(
        'LabelStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0F172A')
    )

    story.append(Paragraph("KEMENTERIAN KEUANGAN REPUBLIK INDONESIA", sub_style))
    story.append(Paragraph("DIREKTORAT JENDERAL PAJAK & BADAN KEBIJAKAN FISKAL", header_style))
    story.append(Paragraph("FORMULIR PERMOHONAN REKONSILIASI DATA TRANSAKSI PENERIMAAN NEGARA", sub_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#D97706'), spaceAfter=15))

    info_data = [
        [Paragraph("Nomor Permohonan", label_style), Paragraph(": REQ-2026-KMK-114", body_style)],
        [Paragraph("Tanggal Pengajuan", label_style), Paragraph(": 05 Oktober 2026", body_style)],
        [Paragraph("Nama Pemohon (PIC)", label_style), Paragraph(": Siti Sarah, S.T.", body_style)],
        [Paragraph("Unit Kerja / Divisi", label_style), Paragraph(": Internal Kemenkeu", body_style)],
        [Paragraph("Sub-Unit / Instansi", label_style), Paragraph(": Direktorat Potensi, Kepatuhan dan Penerimaan", body_style)],
        [Paragraph("Tujuan Penggunaan Data", label_style), Paragraph(": Rekonsiliasi Arus Transaksi Logistik Ekspedisi & Verifikasi PPN atas Jasa Pengiriman", body_style)],
        [Paragraph("Periode Data Diminta", label_style), Paragraph(": 2026-07-01 s/d 2026-09-30", body_style)],
        [Paragraph("Klasifikasi Akses", label_style), Paragraph(": Rahasia Jabatan / Operasional Kedinasan Kemenkeu", body_style)]
    ]
    t1 = Table(info_data, colWidths=[160, 360])
    t1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t1)
    story.append(Spacer(1, 15))

    story.append(Paragraph("<b>Spesifikasi Kebutuhan Atribut Data:</b>", label_style))
    story.append(Spacer(1, 6))

    spec_data = [
        ["No", "Nama Kolom / Entitas", "Deskripsi Kebutuhan", "Kriteria Khusus / Filter"],
        ["1", "Resi & Transaksi", "shipment_id, transaction_id", "Semua pengiriman kuartal 3"],
        ["2", "Kurir & Status", "courier_name, delivery_status", "Hanya pengiriman berstatus DELIVERED"],
        ["3", "Ongkos & Rute", "shipping_cost, origin_city, destination_city", "Biaya pengiriman bruto"],
        ["4", "Waktu Kirim & Terima", "dispatch_date, received_date", "Filter 2026-07-01 sampai 2026-09-30"]
    ]
    t2 = Table(spec_data, colWidths=[30, 140, 170, 180])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#FEF3C7')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#92400E')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#FDE68A')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t2)
    doc.build(story)
    print(f"Generated sample 2: {filepath}")

def generate_sample_pdf_3(filepath: str):
    """Dokumen Sampel 3: Eksternal Kemenkeu (Kejaksaan Agung / BPK / BPKP)."""
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    story = []

    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#0F766E'),
        alignment=1
    )
    sub_style = ParagraphStyle(
        'SubStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1E293B')
    )
    label_style = ParagraphStyle(
        'LabelStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0F172A')
    )

    story.append(Paragraph("REPUBLIK INDONESIA", sub_style))
    story.append(Paragraph("KEJAKSAAN AGUNG RI / BADAN PENGAWAS KEUANGAN (EKSTERNAL)", header_style))
    story.append(Paragraph("SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA", sub_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0F766E'), spaceAfter=15))

    info_data = [
        [Paragraph("Nomor Surat Permintaan", label_style), Paragraph(": REQ-2026-EKS-042", body_style)],
        [Paragraph("Tanggal Surat", label_style), Paragraph(": 08 Oktober 2026", body_style)],
        [Paragraph("Nama Pejabat Pemohon", label_style), Paragraph(": Bambang Pratama, S.H., M.H.", body_style)],
        [Paragraph("Unit Kerja / Divisi", label_style), Paragraph(": Eksternal Kemenkeu", body_style)],
        [Paragraph("Instansi Pemohon", label_style), Paragraph(": Jaksa Agung Muda Tindak Pidana Khusus (Satgassus)", body_style)],
        [Paragraph("Tujuan Penggunaan Data", label_style), Paragraph(": Data Dukung Audit Kepatuhan Devisa & Penegakan Hukum Tata Kelola Finansial Negara", body_style)],
        [Paragraph("Periode Data Diminta", label_style), Paragraph(": 2026-07-01 s/d 2026-09-30", body_style)],
        [Paragraph("Klasifikasi Akses", label_style), Paragraph(": Pro Justitia / Rahasia Negara Terbatas", body_style)]
    ]
    t1 = Table(info_data, colWidths=[160, 360])
    t1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t1)
    story.append(Spacer(1, 15))

    story.append(Paragraph("<b>Spesifikasi Kebutuhan Atribut Data:</b>", label_style))
    story.append(Spacer(1, 6))

    spec_data = [
        ["No", "Nama Kolom / Entitas", "Deskripsi Kebutuhan", "Kriteria Khusus / Filter"],
        ["1", "ID Transaksi & Waktu", "transaction_id, transaction_date", "Periode 01 Juli 2026 s/d 30 September 2026"],
        ["2", "Nominal & Status", "total_amount, status", "Hanya transaksi SUCCESS bernilai tinggi"],
        ["3", "Profil Entitas & NIK", "customer_id, customer_name, nik", "Enkripsi/Pseudonimisasi NIK sesuai UU PDP"],
        ["4", "Rekam Pembayaran", "payment_method, channel", "Seluruh kanal perbankan dan transaksi elektronik"]
    ]
    t2 = Table(spec_data, colWidths=[30, 140, 170, 180])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#CCFBF1')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#0F766E')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#99F6E4')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t2)
    doc.build(story)
    print(f"Generated sample 3: {filepath}")

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "..", "samples")
    os.makedirs(out_dir, exist_ok=True)
    generate_sample_pdf_1(os.path.join(out_dir, "Permohonan_Data_Bea_Cukai_Ekspor_Impor.pdf"))
    generate_sample_pdf_2(os.path.join(out_dir, "Permohonan_Data_Fiskal_Internal_Kemenkeu.pdf"))
    generate_sample_pdf_3(os.path.join(out_dir, "Permohonan_Data_Eksternal_Kemenkeu.pdf"))
