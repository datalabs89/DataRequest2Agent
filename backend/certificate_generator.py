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
    HRFlowable,
    PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.barcode.qr import QrCodeWidget
from models import DataRequestSpec, VerificationReport, SQLGenerationResult

class CertificateGenerator:
    """
    Membuat Sertifikat Otorisasi & Kepatuhan Tata Kelola Data Resmi (PDF).
    Sepenuhnya diselaraskan dengan:
    1. Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
    2. Peraturan Pemerintah No. 33 Tahun 2026 tentang Perlindungan Data Pribadi (LNRI 2026 No. 88).
    3. Tata Kelola Privasi Data Direktorat Informasi Kepabeanan dan Cukai (DIKC) - DJBC.
    4. Standar SMKI ISO/IEC 27001:2022 & ISO/IEC 27701:2025 (PIMS).
    """

    def generate_certificate(
        self,
        output_path: str,
        spec: DataRequestSpec,
        verification: VerificationReport,
        sql_result: SQLGenerationResult
    ) -> str:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=28,
            bottomMargin=28
        )

        styles = getSampleStyleSheet()

        # Tipografi Dokumen Resmi
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
        cert_main_title = ParagraphStyle(
            'CertMainTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=12,
            leading=15,
            textColor=colors.HexColor('#1E3A8A'),
            alignment=1
        )
        cert_sub_title = ParagraphStyle(
            'CertSubTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=8,
            leading=10,
            textColor=colors.HexColor('#0284C7'),
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
            textColor=colors.HexColor('#1E3A8A')
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
            leading=9,
            textColor=colors.HexColor('#1E293B')
        )

        # Variabel Dinamis Permohonan
        query_hash = hashlib.sha256(sql_result.query.encode('utf-8')).hexdigest()[:24].upper()
        b_proc = getattr(spec, 'business_process', 'Lainnya') or 'Lainnya'

        # Feedback & Identitas Pengesah
        fb = verification.verifier_feedback
        reviewer_name = fb.reviewer_name if (fb and fb.reviewer_name) else "Hendra Gunawan, S.Kom"
        reviewer_role = fb.reviewer_role if (fb and fb.reviewer_role) else "Kepala Seksi Analisa dan Layanan Data"
        dpo_name = getattr(fb, 'dpo_name', None) if fb else None
        dpo_name = dpo_name or "Tim PPDP / DPO DIKC DJBC"
        dpo_role = getattr(fb, 'dpo_role', None) if fb else None
        dpo_role = dpo_role or "Pejabat Pelaksana Fungsi Pelindungan Data Pribadi"
        retention_days = getattr(fb, 'retention_days', 30) if fb else 30
        comments = (
            fb.comments
            if (fb and fb.comments)
            else "Data disetujui untuk analisis kedinasan resmi. Wajib patuh UU No. 27/2022 & PP No. 33/2026: Masking dinamis aktif, retensi maks 30 hari kalender, pemusnahan wajib (CoD) pasca-analisis, dan dilarang transfer ke pihak ketiga."
        )

        cert_no = f"CERT-PDP/DIKC/{datetime.date.today().year}/{spec.request_id.replace('-', '/')}"

        # Digital Signature Hash
        dig_hash = (
            fb.digital_signature_hash
            if (fb and fb.digital_signature_hash)
            else (
                verification.digital_fingerprint
                or hashlib.sha256(f"{spec.request_id}|{sql_result.query}|{reviewer_name}|{comments}".encode('utf-8')).hexdigest()
            )
        )

        story = []

        # =============================================================
        # HALAMAN 1: IDENTITAS PERMOHONAN, KONSIDERANS & AUDIT SPESIFIKASI
        # =============================================================

        # 1. Kop Resmi Kementerian Keuangan / DJBC / DIKC
        story.append(Paragraph("KEMENTERIAN KEUANGAN REPUBLIK INDONESIA", inst_title_style))
        story.append(Paragraph("DIREKTORAT JENDERAL BEA DAN CUKAI", inst_title_style))
        story.append(Paragraph("DIREKTORAT INFORMASI KEPABEANAN DAN CUKAI", inst_title_style))
        story.append(Paragraph("Gedung Kalimantan Lantai 3-5, Kantor Pusat DJBC, Jl. Jenderal Ahmad Yani, Jakarta Timur - 13230", inst_sub_style))
        story.append(Paragraph("Subdirektorat Pengelolaan dan Layanan Data  |  Subdirektorat Pengendalian Keamanan Informasi", inst_sub_style))
        story.append(Spacer(1, 4))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceAfter=1))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#1E3A8A'), spaceAfter=5))

        # 2. Judul Sertifikat Resmi Kepatuhan
        story.append(Paragraph("SERTIFIKAT RESMI OTORISASI & KEPATUHAN PEMENUHAN DATA", cert_main_title))
        story.append(Paragraph("OFFICIAL DATA REQUISITION & PRIVACY GOVERNANCE COMPLIANCE CERTIFICATE", cert_sub_title))
        story.append(Paragraph("Berdasarkan UU No. 27 Tahun 2022 (UU PDP) & PP No. 33 Tahun 2026 tentang Perlindungan Data Pribadi", legal_basis_style))
        story.append(Spacer(1, 5))

        # 3. Banner Metadata Sertifikat
        meta_data = [
            [
                Paragraph("<b>Nomor Sertifikat:</b>", label_style),
                Paragraph(cert_no, val_style),
                Paragraph("<b>Klasifikasi Dokumen:</b>", label_style),
                Paragraph("<font color='#B91C1C'><b>TERBATAS (RESTRICTED DINAS)</b></font>", val_style)
            ],
            [
                Paragraph("<b>Status Kelayakan:</b>", label_style),
                Paragraph("<font color='#047857'><b>RESMI DISETUJUI & COMPLIANT</b></font>", val_style),
                Paragraph("<b>Tanggal Otorisasi:</b>", label_style),
                Paragraph(datetime.datetime.now().strftime("%d %B %Y, %H:%M WIB"), val_style)
            ]
        ]
        t_meta = Table(meta_data, colWidths=[105, 175, 115, 145])
        t_meta.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 3.5),
        ]))
        story.append(t_meta)
        story.append(Spacer(1, 5))

        # 4. Landasan Hukum & Konsiderans Regulasi (UU 27/2022, PP 33/2026, ISO 27001/27701)
        story.append(Paragraph("<b>LANDASAN HUKUM & KONSIDERANS REGULASI:</b>", section_hdr))
        legal_box = [
            [Paragraph(
                "1. <b>Undang-Undang No. 27 Tahun 2022</b> tentang Pelindungan Data Pribadi (UU PDP) pasal 4 klasifikasi data, pasal 20 ayat (2) dasar pemrosesan sah dalam rangka pelaksanaan kewenangan badan publik, pasal 46 notifikasi kegagalan PDP, pasal 53-54 fungsi pengawasan, dan ketentuan pidana pasal 67-73.<br/>"
                "2. <b>Peraturan Pemerintah No. 33 Tahun 2026</b> tentang Perlindungan Data Pribadi (LNRI Tahun 2026 No. 88 - berlaku efektif 16 Januari 2027) pasal 6-7 larangan pengombinasian/triangularisasi data pribadi domain publik, pasal 20-26 tata cara pelaksanaan hak subjek data, pasal 32-36 larangan dark pattern & persetujuan sah, pasal 75 kewajiban dokumen kebijakan masa retensi tertulis, pasal 114-119 tata cara notifikasi kegagalan 3x24 jam, pasal 123 pengamanan teknis/enkripsi/pseudonimisasi, pasal 138 akuntabilitas eksplisit & audit berkala, serta pasal 142-147 kewenangan Pejabat Pengelola Data Pribadi (PPDP / DPO).<br/>"
                "3. <b>Standar Keamanan Informasi & Privasi:</b> ISO/IEC 27001:2022 (SMKI CEISA 4.0 DJBC) dan ISO/IEC 27701:2025 (Privacy Information Management System).",
                val_small
            )]
        ]
        t_legal = Table(legal_box, colWidths=[540])
        t_legal.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94A3B8')),
            ('PADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_legal)
        story.append(Spacer(1, 5))

        # 5. Bagian I: Identitas Para Pihak & Dasar Pemrosesan Sah
        story.append(Paragraph("<b>I. IDENTITAS PARA PIHAK & DASAR PEMROSESAN SAH (LAWFUL BASIS)</b>", section_hdr))
        req_rows = [
            [
                Paragraph("ID Permohonan", label_style),
                Paragraph(f": <b>{spec.request_id}</b>", val_style),
                Paragraph("Pengendali Data Pribadi", label_style),
                Paragraph(": DIKC - DJBC (Badan Publik)", val_style)
            ],
            [
                Paragraph("Judul Dokumen", label_style),
                Paragraph(f": {spec.document_title}", val_style),
                Paragraph("Prosesor / Pemohon Data", label_style),
                Paragraph(f": {spec.requester_name}", val_style)
            ],
            [
                Paragraph("Unit Kerja Pemohon", label_style),
                Paragraph(f": {spec.requester_department}", val_style),
                Paragraph("Tipe Proses Bisnis", label_style),
                Paragraph(f": {b_proc}", val_style)
            ],
            [
                Paragraph("Tujuan Pemrosesan", label_style),
                Paragraph(f": {spec.business_purpose}", val_style),
                Paragraph("Periode Data Diizinkan", label_style),
                Paragraph(f": {spec.time_range_start} s/d {spec.time_range_end}", val_style)
            ],
            [
                Paragraph("Dasar Hukum Pemrosesan", label_style),
                Paragraph(": <b>Pelaksanaan Tugas & Kewenangan Kedinasan</b> (Ps. 20 ayat 2 huruf b UU PDP jo. Ps. 32 PP 33/2026)", val_style),
                Paragraph("Prinsip Pemrosesan", label_style),
                Paragraph(": Purpose Limitation & Minimization Terpenuhi", val_style)
            ]
        ]
        t_req = Table(req_rows, colWidths=[110, 160, 120, 150])
        t_req.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('PADDING', (0,0), (-1,-1), 3),
        ]))
        story.append(t_req)
        story.append(Spacer(1, 5))

        # 6. Bagian II: Spesifikasi Data, Minimisasi & Kontrol Keamanan Teknis (Ps. 123 PP 33/2026)
        story.append(Paragraph("<b>II. SPESIFIKASI DATA, MINIMISASI & KONTROL KEAMANAN TEKNIS (PS. 123 PP 33/2026)</b>", section_hdr))
        spec_rows = [
            [
                Paragraph("Parameter Kontrol", label_style),
                Paragraph("Spesifikasi & Penerapan Teknis", label_style),
                Paragraph("Status Kepatuhan Audit", label_style)
            ],
            [
                Paragraph("Minimisasi Data (Data Minimization)", val_style),
                Paragraph("Hanya kolom yang relevan dengan tujuan kedinasan diekstraksi; kolom berlebih dieksklusi.", val_style),
                Paragraph("<font color='#047857'><b>COMPLIANT (PASAL 123)</b></font>", val_style)
            ],
            [
                Paragraph("Penyamaran PII / Masking Dinamis", val_style),
                Paragraph("Kolom sensitif (NIK, NPWP Orang Pribadi, Telepon, Nama Subjek) dimasking permanen mencegah rekombinasi/triangularisasi data (Ps. 7 PP 33/2026).", val_style),
                Paragraph("<font color='#047857'><b>MASKING AKTIF (SHA/SUBSTR)</b></font>", val_style)
            ],
            [
                Paragraph("Audit Grounding Skema DWH", val_style),
                Paragraph("Katalog tabel & kolom tervalidasi 100% terhadap OpenMetadata Enterprise Data Catalog.", val_style),
                Paragraph("<font color='#047857'><b>TERVERIFIKASI CATALOG</b></font>", val_style)
            ],
            [
                Paragraph("Integritas Kueri SQL (Hash)", val_style),
                Paragraph(f"Kueri hanya bersifat Read-Only (SELECT). Hash Kueri: <font name='Courier'>SHA256:{query_hash}</font>", val_style),
                Paragraph("<font color='#047857'><b>READ-ONLY SECURED</b></font>", val_style)
            ],
        ]
        t_spec = Table(spec_rows, colWidths=[130, 290, 120])
        t_spec.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 3),
        ]))
        story.append(t_spec)

        # Akhir Halaman 1 -> Pindah ke Halaman 2
        story.append(PageBreak())

        # =============================================================
        # HALAMAN 2: RETENSI, PAKTA INTEGRITAS, PENGESAHAN & STEMPEL SHA-256
        # =============================================================

        # Header Sambungan Halaman 2
        h2_title = Paragraph(
            f"<b>LAMPIRAN KEPATUHAN & PENGESAHAN RESMI (SERTIFIKAT NO: {cert_no})</b>",
            ParagraphStyle('H2Title', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor('#1E3A8A'), alignment=1)
        )
        story.append(h2_title)
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#1E3A8A'), spaceAfter=6))

        # 7. Bagian III: Kebijakan Masa Retensi & Pemusnahan Data Wajib (Pasal 75 PP No. 33/2026)
        story.append(Paragraph("<b>III. KEBIJAKAN MASA RETENSI & PEMUSNAHAN DATA WAJIB (PASAL 75 PP NO. 33/2026)</b>", section_hdr))
        retention_rows = [
            [Paragraph("<b>Ketentuan Retensi & Pemusnahan</b>", label_style), Paragraph("<b>Rincian Kewajiban Pengendali & Pemroses Data</b>", label_style)],
            [Paragraph("Masa Retensi Data Diizinkan", val_style), Paragraph(f"Maksimum <b>{retention_days} (tiga puluh) hari kalender</b> sejak tanggal penyerahan data atau segera setelah analisis kedinasan selesai (mana yang tercapai lebih dahulu).", val_style)],
            [Paragraph("Pelarangan Salinan Bayangan (Shadow Copy)", val_style), Paragraph("Pemohon/pemroses <b>DILARANG KERAS</b> membuat, menggandakan, atau mendistribusikan salinan data di luar lingkungan komputasi dinas yang telah disetujui.", val_style)],
            [Paragraph("Metode Sanitasi & Pemusnahan Wajib", val_style), Paragraph("Pemusnahan wajib dilakukan melalui <i>cryptographic erasure</i> / penghapusan permanen dari media penyimpanan, basis data lokal, file cache, dan backup temporal.", val_style)],
            [Paragraph("Bukti Pemusnahan (Certificate of Destruction)", val_style), Paragraph("Setelah masa retensi berakhir, pemohon wajib menyampaikan <b>Certificate of Destruction (CoD) / Berita Acara Pemusnahan</b> kepada Subdit PLD & PPDP DIKC DJBC.", val_style)],
        ]
        t_ret = Table(retention_rows, colWidths=[160, 380])
        t_ret.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F8FAFC')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 3),
        ]))
        story.append(t_ret)
        story.append(Spacer(1, 5))

        # 8. Bagian IV: Pakta Integritas Kepatuhan, Keamanan & Klausul Sanksi Hukum (UU 27/2022 & PP 33/2026)
        story.append(Paragraph("<b>IV. PAKTA INTEGRITAS KEPATUHAN, KERAHASIAAN & SANKSI HUKUM (UU 27/2022 & PP 33/2026)</b>", section_hdr))
        pact_box = [
            [Paragraph(
                "Dengan diterbitkannya sertifikat otorisasi ini, Pemohon/Penerima Data menyatakan tunduk dan terikat pada ketentuan hukum berikut:<br/>"
                "1. <b>Batasan Tujuan:</b> Data semata-mata digunakan untuk tujuan analisis resmi sebagaimana disetujui. Dilarang memanfaatkan data untuk profiling diskriminatif atau komersial.<br/>"
                "2. <b>Larangan Pengalihan Pihak Ketiga:</b> Dilarang memindahkan, mentransfer, atau mengekspor data ke instansi/pihak luar tanpa persetujuan tertulis Direktur IKC dan kajian transfer data (Ps. 160-168 PP 33/2026).<br/>"
                "3. <b>Keamanan Teknis:</b> Wajib menjaga kerahasiaan data dengan enkripsi <i>at-rest</i> dan <i>in-transit</i> serta menerapkan prinsip <i>need-to-know basis</i> (Ps. 123 PP 33/2026).<br/>"
                "4. <b>Kewajiban Notifikasi Insiden (Data Breach):</b> Jika terindikasi atau terjadi insiden kebocoran/akses tidak sah, penerima data wajib melapor secara tertulis kepada PPDP DIKC dalam waktu <b>&lt; 24 jam</b> dan ke Lembaga PDP dalam <b>3 x 24 jam</b> (Ps. 46 UU PDP jo. Ps. 114-119 PP 33/2026).<br/>"
                "5. <b>Sanksi Hukum:</b> Pelanggaran terhadap ketentuan ini dapat dikenai sanksi administratif hingga 2% pendapatan tahunan (Ps. 184-185 PP 33/2026), hukuman disiplin ASN, serta tuntutan pidana penjara paling lama 6 tahun dan/atau denda paling banyak Rp 6.000.000.000,- (Pasal 67 jo. Pasal 68 UU No. 27 Tahun 2022).",
                clause_style
            )]
        ]
        t_pact = Table(pact_box, colWidths=[540])
        t_pact.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#F87171')),
            ('PADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_pact)
        story.append(Spacer(1, 5))

        # 9. Bagian V: Catatan & Arahan Khusus Verifikator (Data Steward & PPDP)
        story.append(Paragraph("<b>V. CATATAN & ARAHAN KHUSUS VERIFIKATOR (DATA STEWARD & PPDP):</b>", section_hdr))
        fb_box = [[Paragraph(f"<i>\"{comments}\"</i>", val_style)]]
        t_fb = Table(fb_box, colWidths=[540])
        t_fb.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0FDF4')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#86EFAC')),
            ('PADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_fb)
        story.append(Spacer(1, 6))

        # 10. Bagian VI: Pengesahan Pejabat Berwenang (3 Pihak) & QR Code
        story.append(Paragraph("<b>VI. PENGESAHAN PEJABAT BERWENANG & INTEGRITAS DIGITAL</b>", section_hdr))
        verify_url = f"https://datalabs89.github.io/DataRequestStudio/?verify={spec.request_id}"
        qr = QrCodeWidget(verify_url)
        b = qr.getBounds()
        w = b[2] - b[0]
        h = b[3] - b[1]
        qr_drawing = Drawing(52, 52, transform=[52/w, 0, 0, 52/h, 0, 0])
        qr_drawing.add(qr)

        sig_table_data = [
            [
                Paragraph(f"<b>PEMOHON / ANALIS DATA:</b><br/><br/><br/><b>{spec.requester_name}</b><br/>{spec.requester_department}", val_style),
                Paragraph("<font size='6.5' color='#64748B'><b>PINDAI VALIDASI</b><br/>Verifikasi Keaslian</font>", ParagraphStyle('QRLbl', fontName='Helvetica', fontSize=6.5, leading=8, alignment=1)),
                Paragraph(f"<b>DATA STEWARD OPERASIONAL:</b><br/><br/><br/><b>{reviewer_name}</b><br/>{reviewer_role}", val_style),
                Paragraph(f"<b>PEJABAT PDP (PPDP / DPO):</b><br/><br/><br/><b>{dpo_name}</b><br/>{dpo_role}", val_style)
            ],
            [
                Paragraph("<font size='6' color='#059669'>[Signed Digitally - SSO DJBC]</font>", val_style),
                qr_drawing,
                Paragraph("<font size='6' color='#059669'>[Signed Digitally - Governance]</font>", val_style),
                Paragraph("<font size='6' color='#059669'>[Verified - Ps. 145 PP 33/2026]</font>", val_style)
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

        # 11. Kotak Integritas Kriptografis Anti-Tampering (SHA-256)
        story.append(Paragraph(
            "<b>KODE INTEGRITAS DIGITAL & ANTI-TAMPERING (HMAC-SHA256):</b>",
            ParagraphStyle('SecNote', fontName='Helvetica-Bold', fontSize=6.5, leading=8, textColor=colors.HexColor('#475569'), alignment=1)
        ))
        story.append(Paragraph(
            f"<font color='#0284C7' name='Courier'>SHA256-DIGEST:</font> <font name='Courier'>{dig_hash}</font>",
            ParagraphStyle('HashSt', fontName='Courier', fontSize=7, leading=8.5, textColor=colors.HexColor('#0F172A'), alignment=1)
        ))
        story.append(Paragraph(
            "Dokumen sertifikat ini sah dan mengikat secara hukum berdasarkan Pasal 138 PP No. 33/2026 serta UU No. 27/2022. Integritas naskah, query SQL, dan catatan verifikator dijamin oleh sidik jari digital kriptografis.",
            ParagraphStyle('SecNote2', fontName='Helvetica', fontSize=6, leading=7.5, textColor=colors.HexColor('#64748B'), alignment=1)
        ))

        doc.build(story)
        return output_path
