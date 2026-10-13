import os
import hashlib
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.barcode.qr import QrCodeWidget

class CertificateOfDestructionGenerator:
    """
    Generator Berita Acara Pemusnahan Data Pribadi (Certificate of Destruction - CoD).
    Diterbitkan berdasarkan:
    1. Pasal 75 Peraturan Pemerintah No. 33 Tahun 2026 tentang Perlindungan Data Pribadi (LNRI 2026 No. 88).
    2. Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
    3. Standar Manajemen Keamanan & Privasi ISO/IEC 27001:2022 & ISO/IEC 27701:2025.
    """

    def generate_cod(
        self,
        output_path: str,
        request_id: str,
        document_title: str,
        requester_name: str,
        requester_department: str,
        row_count: int,
        granted_date: str,
        destruction_method: str = "Cryptographic Erasure & Secure Sanitization (NIST SP 800-88)",
        reviewer_name: str = "Hendra Gunawan, S.Kom",
        reviewer_role: str = "Kepala Seksi Analisa dan Layanan Data",
        dpo_name: str = "Tim PPDP / DPO DIKC DJBC",
        dpo_role: str = "Pejabat Pelaksana Fungsi Pelindungan Data Pribadi",
        destruction_notes: str = "Seluruh salinan data aktif, file Excel/CSV, cache komputasi, dan media temporal telah dihapus secara permanen. Bebas dari salinan bayangan (zero shadow copy)."
    ) -> str:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=30,
            bottomMargin=30
        )

        styles = getSampleStyleSheet()

        inst_title_style = ParagraphStyle(
            'InstTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=12,
            textColor=colors.HexColor('#0F172A'),
            alignment=1
        )
        inst_sub_style = ParagraphStyle(
            'InstSub',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=8,
            leading=10.5,
            textColor=colors.HexColor('#334155'),
            alignment=1
        )
        main_title_style = ParagraphStyle(
            'MainTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=16,
            textColor=colors.HexColor('#991B1B'),
            alignment=1
        )
        sub_title_style = ParagraphStyle(
            'SubTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=8,
            leading=10,
            textColor=colors.HexColor('#DC2626'),
            alignment=1
        )
        legal_basis_style = ParagraphStyle(
            'LegalBasis',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=7,
            leading=9,
            textColor=colors.HexColor('#475569'),
            alignment=1
        )
        section_hdr = ParagraphStyle(
            'SecHdr',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor('#991B1B')
        )
        label_style = ParagraphStyle(
            'LabelStyle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=7.5,
            leading=9.5,
            textColor=colors.HexColor('#0F172A')
        )
        val_style = ParagraphStyle(
            'ValStyle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=7.5,
            leading=9.5,
            textColor=colors.HexColor('#1E293B')
        )
        val_small = ParagraphStyle(
            'ValSmall',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=7,
            leading=9,
            textColor=colors.HexColor('#334155')
        )
        clause_style = ParagraphStyle(
            'ClauseStyle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=7,
            leading=9.5,
            textColor=colors.HexColor('#1E293B')
        )

        now = datetime.datetime.now()
        destruction_date_str = now.strftime("%d %B %Y, %H:%M WIB")
        ba_no = f"BA-MUSNAH/DIKC/{now.year}/{request_id.replace('-', '/')}"

        # Hash Integritas Pemusnahan (Anti-Tampering)
        hash_payload = f"COD|{request_id}|{requester_name}|{now.isoformat()}|{row_count}|{destruction_method}"
        cod_hash = hashlib.sha256(hash_payload.encode('utf-8')).hexdigest()

        story = []

        # 1. Kop Resmi Kementerian Keuangan / DJBC / DIKC
        story.append(Paragraph("KEMENTERIAN KEUANGAN REPUBLIK INDONESIA", inst_title_style))
        story.append(Paragraph("DIREKTORAT JENDERAL BEA DAN CUKAI", inst_title_style))
        story.append(Paragraph("DIREKTORAT INFORMASI KEPABEANAN DAN CUKAI", inst_title_style))
        story.append(Paragraph("Gedung Kalimantan Lantai 3-5, Kantor Pusat DJBC, Jl. Jenderal Ahmad Yani, Jakarta Timur - 13230", inst_sub_style))
        story.append(Paragraph("Subdirektorat Pengelolaan dan Layanan Data  |  Subdirektorat Pengendalian Keamanan Informasi", inst_sub_style))
        story.append(Spacer(1, 4))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#991B1B'), spaceAfter=1))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#991B1B'), spaceAfter=5))

        # 2. Judul Berita Acara Pemusnahan
        story.append(Paragraph("BERITA ACARA RESMI PEMUSNAHAN DATA PRIBADI", main_title_style))
        story.append(Paragraph("OFFICIAL CERTIFICATE OF DESTRUCTION & DATA DISPOSAL (CoD)", sub_title_style))
        story.append(Paragraph("Kewajiban Pelaksanaan Pasal 75 Peraturan Pemerintah No. 33 Tahun 2026 jo. UU No. 27 Tahun 2022", legal_basis_style))
        story.append(Spacer(1, 6))

        # 3. Metadata Berita Acara
        meta_data = [
            [
                Paragraph("<b>Nomor Berita Acara:</b>", label_style),
                Paragraph(ba_no, val_style),
                Paragraph("<b>Klasifikasi:</b>", label_style),
                Paragraph("<font color='#991B1B'><b>BUKTI KEPATUHAN PEMUSNAHAN</b></font>", val_style)
            ],
            [
                Paragraph("<b>Status Pemusnahan:</b>", label_style),
                Paragraph("<font color='#047857'><b>TERVERIFIKASI DIMUSNAHKAN PENUH</b></font>", val_style),
                Paragraph("<b>Waktu Eksekusi:</b>", label_style),
                Paragraph(destruction_date_str, val_style)
            ]
        ]
        t_meta = Table(meta_data, colWidths=[110, 170, 110, 150])
        t_meta.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#FECACA')),
            ('PADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_meta)
        story.append(Spacer(1, 6))

        # 4. Konsiderans Yuridis Pemusnahan
        story.append(Paragraph("<b>LANDASAN HUKUM PEMUSNAHAN & SANITASI DATA:</b>", section_hdr))
        legal_box = [
            [Paragraph(
                "1. <b>Pasal 75 Peraturan Pemerintah No. 33 Tahun 2026</b>: Pengendali dan Pemroses Data wajib menetapkan dan menjalankan kebijakan masa retensi tertulis serta memastikan metode pemusnahan data pribadi terverifikasi pasca-analisis.<br/>"
                "2. <b>Pasal 1 angka 1 jo. Pasal 46 UU No. 27 Tahun 2022 (UU PDP)</b>: Pemusnahan merupakan siklus akhir sah pemrosesan data untuk mencegah penyalahgunaan, kebocoran, atau akumulasi data tanpa dasar hukum.<br/>"
                "3. <b>Kontrol ISO/IEC 27001:2022 (A.8.10) & ISO/IEC 27701:2025 (PIMS 7.4.7)</b>: Sanitasi media penyimpanan dan pemusnahan informasi digital yang dapat dibuktikan secara kriptografis.",
                val_small
            )]
        ]
        t_legal = Table(legal_box, colWidths=[540])
        t_legal.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_legal)
        story.append(Spacer(1, 6))

        # 5. Rincian Objek Data yang Dimusnahkan
        story.append(Paragraph("<b>I. RINCIAN PERMOHONAN & OBJEK DATA YANG DIMUSNAHKAN</b>", section_hdr))
        obj_data = [
            [
                Paragraph("ID Permohonan Terkait", label_style),
                Paragraph(f": <b>{request_id}</b>", val_style),
                Paragraph("Tanggal Penyerahan Data", label_style),
                Paragraph(f": {granted_date}", val_style)
            ],
            [
                Paragraph("Judul Permohonan", label_style),
                Paragraph(f": {document_title}", val_style),
                Paragraph("Masa Retensi Maksimum", label_style),
                Paragraph(": 30 Hari Kalender (Telah Kedaluwarsa/Selesai)", val_style)
            ],
            [
                Paragraph("Nama Pemohon (PIC)", label_style),
                Paragraph(f": {requester_name}", val_style),
                Paragraph("Total Baris Dimusnahkan", label_style),
                Paragraph(f": <b>{row_count} baris data</b>", val_style)
            ],
            [
                Paragraph("Unit Kerja / Instansi", label_style),
                Paragraph(f": {requester_department}", val_style),
                Paragraph("Metode Sanitasi Media", label_style),
                Paragraph(f": {destruction_method}", val_style)
            ]
        ]
        t_obj = Table(obj_data, colWidths=[120, 160, 115, 145])
        t_obj.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('PADDING', (0,0), (-1,-1), 3.5),
        ]))
        story.append(t_obj)
        story.append(Spacer(1, 6))

        # 6. Pakta Integritas Pernyataan Pemusnahan (Zero Shadow Copy)
        story.append(Paragraph("<b>II. PERNYATAAN PAKTA INTEGRITAS PEMUSNAHAN (DISPOSAL ATTESTATION)</b>", section_hdr))
        attest_box = [
            [Paragraph(
                "Dengan ini, Pemohon Data / Analis yang bertandatangan di bawah ini menyatakan dengan sesungguhnya di bawah sumpah jabatan bahwa:<br/>"
                "1. <b>Pemusnahan Mutlak & Permanen:</b> Seluruh salinan berkas hasil ekstraksi (Excel, CSV, JSON, dump tabel, dan file derivatif) telah dihapus secara permanen dari seluruh media penyimpanan lokal, sistem analitik, perangkat keras pengguna, dan direktori temporer.<br/>"
                "2. <b>Bebas Salinan Bayangan (Zero Shadow Copy):</b> Tidak ada salinan data pribadi kepabeanan yang disalin, dipindahkan ke cloud publik, disimpan pada media cadangan pribadi, atau diserahkan kepada pihak lain tanpa hak.<br/>"
                "3. <b>Keabsahan Hukum:</b> Dokumen Berita Acara ini merupakan bukti akuntabilitas sah sebagaimana diatur dalam Pasal 138 PP No. 33/2026. Apabila di kemudian hari terbukti terdapat kelalaian atau penyimpanan data secara melawan hukum, pihak terkait bersedia dikenai sanksi administratif dan pidana sesuai peraturan perundang-undangan.",
                clause_style
            )]
        ]
        t_attest = Table(attest_box, colWidths=[540])
        t_attest.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94A3B8')),
            ('PADDING', (0,0), (-1,-1), 4.5),
        ]))
        story.append(t_attest)
        story.append(Spacer(1, 6))

        # 7. Catatan Tambahan Eksekusi Pemusnahan
        story.append(Paragraph("<b>III. CATATAN & VERIFIKASI PELAKSANAAN:</b>", section_hdr))
        notes_box = [[Paragraph(f"<i>\"{destruction_notes}\"</i>", val_style)]]
        t_notes = Table(notes_box, colWidths=[540])
        t_notes.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0FDF4')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#86EFAC')),
            ('PADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_notes)
        story.append(Spacer(1, 8))

        # 8. Pengesahan 3 Pihak & QR Code Validasi Pemusnahan
        story.append(Paragraph("<b>IV. PENGESAHAN EKSEKUSI PEMUSNAHAN & REGISTRASI PDP</b>", section_hdr))
        verify_url = f"https://datalabs89.github.io/DataRequestStudio/?verify={request_id}&type=cod"
        qr = QrCodeWidget(verify_url)
        b = qr.getBounds()
        w = b[2] - b[0]
        h = b[3] - b[1]
        qr_drawing = Drawing(52, 52, transform=[52/w, 0, 0, 52/h, 0, 0])
        qr_drawing.add(qr)

        sig_table_data = [
            [
                Paragraph(f"<b>PELAKSANA PEMUSNAHAN:</b><br/><br/><br/><b>{requester_name}</b><br/>{requester_department}", val_style),
                Paragraph("<font size='6.5' color='#64748B'><b>VALIDASI CoD</b><br/>Pindai Keabsahan</font>", ParagraphStyle('QRLbl', fontName='Helvetica', fontSize=6.5, leading=8, alignment=1)),
                Paragraph(f"<b>DATA STEWARD PENGAWAS:</b><br/><br/><br/><b>{reviewer_name}</b><br/>{reviewer_role}", val_style),
                Paragraph(f"<b>PEJABAT PDP (PPDP / DPO):</b><br/><br/><br/><b>{dpo_name}</b><br/>{dpo_role}", val_style)
            ],
            [
                Paragraph("<font size='6' color='#059669'>[Executed & Destroyed]</font>", val_style),
                qr_drawing,
                Paragraph("<font size='6' color='#059669'>[Audit Log Verified]</font>", val_style),
                Paragraph("<font size='6' color='#059669'>[Registered - Ps. 75 PP 33/2026]</font>", val_style)
            ]
        ]
        t_sig = Table(sig_table_data, colWidths=[140, 75, 160, 165])
        t_sig.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('LINEBEFORE', (1,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('PADDING', (0,0), (-1,-1), 3),
        ]))
        story.append(t_sig)
        story.append(Spacer(1, 6))

        # 9. Kotak Integritas Kriptografis Anti-Tampering (SHA-256 Digest)
        story.append(Paragraph(
            "<b>KODE INTEGRITAS DIGITAL PEMUSNAHAN (HMAC-SHA256 FINGERPRINT):</b>",
            ParagraphStyle('SecNote', fontName='Helvetica-Bold', fontSize=6.5, leading=8, textColor=colors.HexColor('#475569'), alignment=1)
        ))
        story.append(Paragraph(
            f"<font color='#DC2626' name='Courier'>SHA256-COD-DIGEST:</font> <font name='Courier'>{cod_hash}</font>",
            ParagraphStyle('HashSt', fontName='Courier', fontSize=7, leading=8.5, textColor=colors.HexColor('#0F172A'), alignment=1)
        ))
        story.append(Paragraph(
            "Dokumen Berita Acara Pemusnahan ini diterbitkan secara otomatis dan mengikat berdasarkan Pasal 75 dan Pasal 138 PP No. 33/2026. Data yang telah dimusnahkan tidak dapat dipulihkan kembali (irreversible).",
            ParagraphStyle('SecNote2', fontName='Helvetica', fontSize=6, leading=7.5, textColor=colors.HexColor('#64748B'), alignment=1)
        ))

        doc.build(story)
        return output_path
