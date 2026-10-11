import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_sample_pdf_1(filepath: str):
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    story = []

    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#1E3A8A'),
        alignment=1 # Center
    )
    sub_style = ParagraphStyle(
        'SubStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
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

    story.append(Paragraph("PT BANK DIGITAL NUSANTARA TBK", sub_style))
    story.append(Paragraph("FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA", header_style))
    story.append(Paragraph("Dokumen Pengajuan Kebutuhan Data Warehouse & Analitik Bisnis", sub_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceAfter=15))

    # Info Pemohon Table
    info_data = [
        [Paragraph("Nomor Permohonan", label_style), Paragraph(": REQ-2026-BDN-089", body_style)],
        [Paragraph("Tanggal Pengajuan", label_style), Paragraph(": 10 Oktober 2026", body_style)],
        [Paragraph("Nama Pemohon (PIC)", label_style), Paragraph(": Ahmad Fauzi, S.Kom", body_style)],
        [Paragraph("Unit Kerja / Divisi", label_style), Paragraph(": Customer Intelligence & Loyalty Analytics", body_style)],
        [Paragraph("Tujuan Penggunaan Data", label_style), Paragraph(": Evaluasi Pola Transaksi dan Retensi Nasabah Segmen Prioritas Q3", body_style)],
        [Paragraph("Periode Data Diminta", label_style), Paragraph(": 2026-07-01 s/d 2026-09-30", body_style)],
        [Paragraph("Klasifikasi Akses", label_style), Paragraph(": Terbatas (Kerahasiaan Tinggi - Regulasi PDP)", body_style)]
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
        ["3", "Profil Nasabah", "customer_id, customer_name, NIK", "Khusus segmen nasabah PRIORITAS"],
        ["4", "Kontak & Lokasi", "phone_number, city", "Masking nomor NIK dan No HP untuk kepatuhan PDP"]
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
    story.append(Spacer(1, 20))

    story.append(Paragraph("<b>Pernyataan Kepatuhan & Persetujuan:</b>", label_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Dengan menandatangani formulir ini, pemohon menyetujui bahwa data yang diekstraksi hanya digunakan untuk keperluan analitik resmi dan dilarang disebarluaskan di luar otorisasi yang telah disetujui tim Data Governance.", sub_style))
    story.append(Spacer(1, 35))

    # Signature Block
    sig_data = [
        [Paragraph("Diajukan Oleh:<br/><br/><br/><b>( Ahmad Fauzi )</b><br/>Lead Data Analyst", body_style),
         Paragraph("Disetujui Oleh:<br/><br/><br/><b>( Hendra Gunawan )</b><br/>Head of Data Governance", body_style)]
    ]
    t3 = Table(sig_data, colWidths=[260, 260])
    t3.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t3)

    doc.build(story)
    print(f"Generated sample 1: {filepath}")

def generate_sample_pdf_2(filepath: str):
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    story = []

    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#1E3A8A'),
        alignment=1
    )
    sub_style = ParagraphStyle(
        'SubStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
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

    story.append(Paragraph("LOGISTIK NUSANTARA EKSPRES", sub_style))
    story.append(Paragraph("FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI", header_style))
    story.append(Paragraph("Divisi Supply Chain & SLA Monitoring", sub_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceAfter=15))

    info_data = [
        [Paragraph("Nomor Permohonan", label_style), Paragraph(": REQ-2026-LOG-114", body_style)],
        [Paragraph("Tanggal Pengajuan", label_style), Paragraph(": 05 Oktober 2026", body_style)],
        [Paragraph("Nama Pemohon (PIC)", label_style), Paragraph(": Siti Sarah, S.T.", body_style)],
        [Paragraph("Unit Kerja / Divisi", label_style), Paragraph(": Operation Performance & Logistics SLA", body_style)],
        [Paragraph("Tujuan Penggunaan Data", label_style), Paragraph(": Evaluasi Ketepatan Waktu Ekspedisi dan Biaya Logistik Kurir", body_style)],
        [Paragraph("Periode Data Diminta", label_style), Paragraph(": 2026-07-01 s/d 2026-09-30", body_style)],
        [Paragraph("Klasifikasi Akses", label_style), Paragraph(": Operasional Internal", body_style)]
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
        ["3", "Ongkos & Rute", "shipping_cost, origin_city, destination_city", "Biaya pengiriman kotor"],
        ["4", "Waktu Kirim & Terima", "dispatch_date, received_date", "Filter 2026-07-01 sampai 2026-09-30"]
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
    story.append(Spacer(25, 25))

    doc.build(story)
    print(f"Generated sample 2: {filepath}")

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "..", "samples")
    os.makedirs(out_dir, exist_ok=True)
    generate_sample_pdf_1(os.path.join(out_dir, "Permohonan_Data_Nasabah_Q3_2026.pdf"))
    generate_sample_pdf_2(os.path.join(out_dir, "Permohonan_Data_Logistik_Pengiriman.pdf"))
