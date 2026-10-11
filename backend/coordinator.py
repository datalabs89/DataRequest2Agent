import os
import time
from typing import Dict, Any, Optional, Generator
from models import PipelineResponse, SQLGenerationResult, DataRequestSpec, CatalogMatchResult, VerificationReport, VerifierFeedback
from pdf_parser import PDFRequestParser
from openmetadata_connector import OpenMetadataConnector
from sql_generator import SQLGenerator
from independent_verifier import IndependentVerifier
from data_exporter import DataExporter
from history_manager import HistoryManager

class PipelineCoordinator:
    """
    Koordinator orkestrator multi-agent untuk pemenuhan permohonan data enterprise.
    Menghubungkan tahap ekstraksi PDF, katalog OpenMetadata, perumusan SQL,
    verifikasi independen, dan eksekusi export data.
    """

    def __init__(self, output_dir: str = "outputs"):
        self.output_dir = output_dir
        self.parser = PDFRequestParser()
        self.om_connector = OpenMetadataConnector()
        self.sql_gen = SQLGenerator()
        self.verifier = IndependentVerifier()
        self.exporter = DataExporter(output_dir=output_dir)
        self.history_mgr = HistoryManager(history_file=os.path.join(output_dir, "history.json"))

    def process_request(self, pdf_path: str, dialect: str = "PostgreSQL", masking_mode: str = "PARTIAL") -> PipelineResponse:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"File PDF tidak ditemukan: {pdf_path}")

        # Tahap 1: Ekstraksi Dokumen PDF
        spec = self.parser.parse_pdf(pdf_path)

        # Tahap 2: OpenMetadata Catalog Search & Schema Grounding
        search_terms = [spec.primary_entity] + [f.name for f in spec.requested_fields]
        catalog_match = self.om_connector.search_relevant_tables(
            search_terms=search_terms,
            primary_entity=spec.primary_entity
        )

        # Tahap 3: Perumusan Query SQL Minimal & PII Masking
        sql_result = self.sql_gen.generate_sql(
            spec=spec,
            catalog_match=catalog_match,
            dialect=dialect,
            masking_mode=masking_mode
        )

        # Tahap 4: Verifikasi Kepatuhan & Keamanan Independen
        verification = self.verifier.verify_query(
            spec=spec,
            catalog_match=catalog_match,
            sql_result=sql_result
        )

        # Tahap 5: Eksekusi Query & Delivery File Excel/CSV
        execution = self.exporter.execute_and_export(
            spec=spec,
            catalog_match=catalog_match,
            sql_result=sql_result,
            verification=verification
        )

        # Rekam ke CMS Riwayat Permohonan Data
        self.history_mgr.record_request(spec=spec, verification=verification, execution=execution)

        return PipelineResponse(
            success=True,
            message="Pemenuhan permohonan data berhasil diproses.",
            spec=spec,
            catalog_match=catalog_match,
            generated_sql=sql_result,
            verification=verification,
            execution=execution
        )

    def process_request_streaming(self, pdf_path: str, dialect: str = "PostgreSQL", masking_mode: str = "PARTIAL") -> Generator[Dict[str, Any], None, None]:
        """Streaming log pemikiran tiap agen (SSE Event Generator)."""
        yield {
            "step": 1,
            "agent": "PDF Request Extractor",
            "log": f"Menganalisis berkas PDF: {os.path.basename(pdf_path)}...",
            "detail": "Mengekstrak nomor dokumen, data pemohon, periode tanggal, dan kriteria filter."
        }
        time.sleep(0.3)
        spec = self.parser.parse_pdf(pdf_path)
        yield {
            "step": 1,
            "agent": "PDF Request Extractor",
            "log": f"Spesifikasi teridentifikasi: ID={spec.request_id}, Pemohon='{spec.requester_name}', Entitas='{spec.primary_entity}'",
            "detail": f"Terdeteksi {len(spec.filters)} kriteria filter dan {len(spec.requested_fields)} atribut."
        }

        yield {
            "step": 2,
            "agent": "OpenMetadata Catalog Matcher",
            "log": f"Menghubungkan ke OpenMetadata MCP server untuk entitas '{spec.primary_entity}'...",
            "detail": "Mencari DDL tabel, deskripsi kolom resmi, tags PII, dan lineage relasi."
        }
        time.sleep(0.3)
        search_terms = [spec.primary_entity] + [f.name for f in spec.requested_fields]
        catalog_match = self.om_connector.search_relevant_tables(
            search_terms=search_terms,
            primary_entity=spec.primary_entity
        )
        tbl_names = ", ".join([t.table_name for t in catalog_match.selected_tables])
        yield {
            "step": 2,
            "agent": "OpenMetadata Catalog Matcher",
            "log": f"Grounding selesai: {len(catalog_match.selected_tables)} tabel dipilih [{tbl_names}].",
            "detail": f"Strategi Join: {len(catalog_match.join_strategy)} relasi foreign key tervalidasi."
        }

        yield {
            "step": 3,
            "agent": "SQL Implementer & Synthesizer",
            "log": f"Merumuskan query SQL untuk database {dialect} (Mode Proteksi PII: {masking_mode})...",
            "detail": "Menerapkan klausa WHERE, membatasi baris dengan LIMIT, dan mengaktifkan Dynamic PII Masking."
        }
        time.sleep(0.3)
        sql_result = self.sql_gen.generate_sql(
            spec=spec,
            catalog_match=catalog_match,
            dialect=dialect,
            masking_mode=masking_mode
        )
        yield {
            "step": 3,
            "agent": "SQL Implementer & Synthesizer",
            "log": f"Query SQL berhasil disusun ({len(sql_result.selected_columns)} kolom terpilih).",
            "detail": f"Kebijakan proteksi PII ({masking_mode}) diaplikasikan secara ketat pada data pribadi nasabah."
        }

        yield {
            "step": 4,
            "agent": "Independent Verifier Agent",
            "log": "Melakukan audit independen terhadap SQL vs Dokumen PDF asli...",
            "detail": "Memeriksa: Safety DML Guard, Cartesian Product Guard, Date Range Fidelity, dan PDP Compliance."
        }
        time.sleep(0.3)
        verification = self.verifier.verify_query(
            spec=spec,
            catalog_match=catalog_match,
            sql_result=sql_result
        )
        yield {
            "step": 4,
            "agent": "Independent Verifier Agent",
            "log": f"Hasil Audit: Status={verification.status} ({len(verification.checks)} parameter diuji).",
            "detail": verification.executive_summary
        }

        yield {
            "step": 5,
            "agent": "Data Delivery & Exporter",
            "log": "Mengeksekusi query dan mengemas file luaran Excel, CSV, & ZIP...",
            "detail": "Menyusun Sheet 1 (Data), Sheet 2 (Audit Provenance), Sheet 3 (Kamus Data), serta paket ZIP."
        }
        time.sleep(0.3)
        execution = self.exporter.execute_and_export(
            spec=spec,
            catalog_match=catalog_match,
            sql_result=sql_result,
            verification=verification
        )
        yield {
            "step": 5,
            "agent": "Data Delivery & Exporter",
            "log": f"Ekstraksi sukses: {execution.row_count} baris data berhasil diekspor ke Excel & CSV.",
            "detail": f"Paket ZIP lengkap siap unduh: {os.path.basename(execution.zip_path)}"
        }

        # Rekam ke CMS Riwayat Permohonan Data
        self.history_mgr.record_request(spec=spec, verification=verification, execution=execution)

        response = PipelineResponse(
            success=True,
            message="Pemenuhan permohonan data berhasil diproses.",
            spec=spec,
            catalog_match=catalog_match,
            generated_sql=sql_result,
            verification=verification,
            execution=execution
        )
        yield {
            "step": 5,
            "agent": "Coordinator",
            "log": "Pipeline Selesai 100%. Tersimpan di CMS.",
            "done": True,
            "result": response.model_dump()
        }

    def reverify_and_execute(
        self,
        spec: DataRequestSpec,
        catalog_match: CatalogMatchResult,
        modified_sql: str,
        dialect: str = "PostgreSQL"
    ) -> PipelineResponse:
        """Mengaudit ulang SQL yang diedit user dan merefresh output data."""
        sql_result = SQLGenerationResult(
            dialect=dialect,
            query=modified_sql,
            explanation="Query telah dimodifikasi secara manual oleh Data Analyst dan diaudit ulang.",
            selected_columns=["custom_columns"],
            applied_filters=["custom_filters"],
            tables_used=[t.fqn for t in catalog_match.selected_tables]
        )

        verification = self.verifier.verify_query(
            spec=spec,
            catalog_match=catalog_match,
            sql_result=sql_result
        )

        execution = self.exporter.execute_and_export(
            spec=spec,
            catalog_match=catalog_match,
            sql_result=sql_result,
            verification=verification
        )

        self.history_mgr.record_request(spec=spec, verification=verification, execution=execution)

        return PipelineResponse(
            success=True,
            message="Kueri berhasil diaudit ulang dan dieksekusi.",
            spec=spec,
            catalog_match=catalog_match,
            generated_sql=sql_result,
            verification=verification,
            execution=execution
        )

    def submit_verifier_feedback(
        self,
        spec: DataRequestSpec,
        catalog_match: CatalogMatchResult,
        sql_result: SQLGenerationResult,
        verification: VerificationReport
    ) -> PipelineResponse:
        """Menerapkan catatan feedback & sign-off verifikator ke dokumen luaran."""
        import hashlib
        import datetime

        # Buat Cryptographic Digital Signature Hash (SHA-256) untuk Anti-Tampering
        sig_time = verification.verifier_feedback.signature_timestamp or datetime.datetime.now(datetime.timezone.utc).isoformat()
        verification.verifier_feedback.signature_timestamp = sig_time
        sig_payload = f"{spec.request_id}|{sql_result.query}|{verification.verifier_feedback.reviewer_name}|{verification.verifier_feedback.action}|{sig_time}"
        sig_hash = hashlib.sha256(sig_payload.encode('utf-8')).hexdigest()
        verification.verifier_feedback.digital_signature_hash = sig_hash
        verification.digital_fingerprint = sig_hash

        # Ekspor ulang Excel, CSV & ZIP dengan feedback verifikator tercantum resmi
        execution = self.exporter.execute_and_export(
            spec=spec,
            catalog_match=catalog_match,
            sql_result=sql_result,
            verification=verification
        )

        if verification.verifier_feedback:
            self.history_mgr.update_feedback(spec.request_id, verification.verifier_feedback)

        return PipelineResponse(
            success=True,
            message="Persetujuan dan feedback verifikator berhasil disematkan ke dalam paket pemenuhan data.",
            spec=spec,
            catalog_match=catalog_match,
            generated_sql=sql_result,
            verification=verification,
            execution=execution
        )

    def extract_spec_only(self, pdf_path: str) -> DataRequestSpec:
        """Ekstraksi spesifikasi permohonan saja untuk konfirmasi Human-in-the-Loop."""
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"File PDF tidak ditemukan: {pdf_path}")
        return self.parser.parse_pdf(pdf_path)

    def process_from_spec_streaming(
        self,
        spec: DataRequestSpec,
        dialect: str = "PostgreSQL",
        masking_mode: str = "PARTIAL"
    ) -> Generator[Dict[str, Any], None, None]:
        """Menjalankan tahapan 2-5 streaming berdasarkan spesifikasi yang sudah dikonfirmasi pengguna."""
        yield {
            "step": 1,
            "agent": "Human-in-the-Loop Validator",
            "log": f"Spesifikasi telah dikonfirmasi pengguna (ID: {spec.request_id}).",
            "detail": f"Periode: {spec.time_range_start} s/d {spec.time_range_end}. Jumlah kolom aktif: {len(spec.requested_fields)}."
        }
        time.sleep(0.2)

        yield {
            "step": 2,
            "agent": "OpenMetadata Catalog Matcher",
            "log": f"Menghubungkan ke OpenMetadata MCP server untuk entitas '{spec.primary_entity}'...",
            "detail": "Mencari DDL tabel, deskripsi kolom resmi, tags PII, dan lineage relasi."
        }
        time.sleep(0.3)
        search_terms = [spec.primary_entity] + [f.name for f in spec.requested_fields]
        catalog_match = self.om_connector.search_relevant_tables(
            search_terms=search_terms,
            primary_entity=spec.primary_entity
        )
        tbl_names = ", ".join([t.table_name for t in catalog_match.selected_tables])
        yield {
            "step": 2,
            "agent": "OpenMetadata Catalog Matcher",
            "log": f"Grounding selesai: {len(catalog_match.selected_tables)} tabel dipilih [{tbl_names}].",
            "detail": f"Strategi Join: {len(catalog_match.join_strategy)} relasi foreign key tervalidasi."
        }

        yield {
            "step": 3,
            "agent": "SQL Implementer & Synthesizer",
            "log": f"Merumuskan query SQL untuk database {dialect} (Mode Proteksi PII: {masking_mode})...",
            "detail": "Menerapkan klausa WHERE, membatasi baris dengan LIMIT, dan mengaktifkan Dynamic PII Masking."
        }
        time.sleep(0.3)
        sql_result = self.sql_gen.generate_sql(
            spec=spec,
            catalog_match=catalog_match,
            dialect=dialect,
            masking_mode=masking_mode
        )
        yield {
            "step": 3,
            "agent": "SQL Implementer & Synthesizer",
            "log": f"Query SQL berhasil disusun ({len(sql_result.selected_columns)} kolom terpilih).",
            "detail": f"Kebijakan proteksi PII ({masking_mode}) diaplikasikan secara ketat pada data pribadi nasabah."
        }

        yield {
            "step": 4,
            "agent": "Independent Verifier Agent",
            "log": "Menjalankan audit kepatuhan & fidelity independen terhadap query SQL...",
            "detail": "Memeriksa anti-Cartesian JOIN, validitas WHERE filter rentang waktu, dan proteksi PII PDP."
        }
        time.sleep(0.3)
        verification = self.verifier.verify_query(
            spec=spec,
            catalog_match=catalog_match,
            sql_result=sql_result
        )
        import hashlib
        init_hash = hashlib.sha256(f"{spec.request_id}|{sql_result.query}|{verification.verifier_timestamp}".encode('utf-8')).hexdigest()
        verification.digital_fingerprint = init_hash

        yield {
            "step": 4,
            "agent": "Independent Verifier Agent",
            "log": f"Hasil Audit: Status={verification.status} ({len(verification.checks)} parameter diuji).",
            "detail": verification.executive_summary
        }

        yield {
            "step": 5,
            "agent": "Data Delivery & Exporter",
            "log": "Mengeksekusi query dan mengemas file luaran Excel, CSV, & ZIP...",
            "detail": "Menyusun Sheet 1 (Data), Sheet 2 (Audit Provenance), Sheet 3 (Kamus Data), serta paket ZIP."
        }
        time.sleep(0.3)
        execution = self.exporter.execute_and_export(
            spec=spec,
            catalog_match=catalog_match,
            sql_result=sql_result,
            verification=verification
        )
        yield {
            "step": 5,
            "agent": "Data Delivery & Exporter",
            "log": f"Ekstraksi sukses: {execution.row_count} baris data berhasil diekspor ke Excel & CSV.",
            "detail": f"Paket ZIP lengkap siap unduh: {os.path.basename(execution.zip_path)}"
        }

        # Rekam ke CMS Riwayat Permohonan Data
        self.history_mgr.record_request(spec=spec, verification=verification, execution=execution)

        response = PipelineResponse(
            success=True,
            message="Pemenuhan permohonan data berhasil diproses.",
            spec=spec,
            catalog_match=catalog_match,
            generated_sql=sql_result,
            verification=verification,
            execution=execution
        )
        yield {
            "step": 5,
            "agent": "Coordinator",
            "log": "Pipeline Selesai 100%. Tersimpan di CMS.",
            "done": True,
            "result": response.model_dump()
        }

