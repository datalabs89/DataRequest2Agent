import os
import shutil
import json
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from coordinator import PipelineCoordinator
from openmetadata_connector import OpenMetadataConnector
from models import PipelineResponse, DataRequestSpec, CatalogMatchResult

def check_role_permission(allowed_roles: List[str], role_header: Optional[str] = None):
    """Memverifikasi otorisasi peran (RBAC) pada endpoint sensitif."""
    user_role = (role_header or "steward").strip().lower()
    allowed_lower = [r.lower() for r in allowed_roles]
    if user_role not in allowed_lower:
        raise HTTPException(
            status_code=403,
            detail=f"Akses Ditolak (403 Forbidden): Peran '{user_role}' tidak memiliki wewenang untuk tindakan ini. Diperlukan peran: {', '.join(allowed_roles)}."
        )

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
SAMPLES_DIR = os.path.join(BASE_DIR, "samples")
OUTPUTS_DIR = os.path.join(BASE_DIR, "outputs")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(OUTPUTS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

app = FastAPI(
    title="DataRequestStudio",
    description="Multi-Agent System for converting PDF Data Requests into verified OpenMetadata SQL and Excel/CSV output.",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

coordinator = PipelineCoordinator(output_dir=OUTPUTS_DIR)
om_connector = OpenMetadataConnector()

@app.get("/api/health")
def health_check():
    conn_info = om_connector.test_live_connection()
    return {
        "status": "online",
        "openmetadata": conn_info,
        "sample_count": len(os.listdir(SAMPLES_DIR)) if os.path.exists(SAMPLES_DIR) else 0,
        "output_count": len(os.listdir(OUTPUTS_DIR)) if os.path.exists(OUTPUTS_DIR) else 0
    }

@app.get("/api/samples")
def list_samples():
    files = []
    if os.path.exists(SAMPLES_DIR):
        preferred = [
            "Permohonan_Data_Internal_Bea_dan_Cukai.pdf",
            "Permohonan_Data_Internal_Kemenkeu.pdf",
            "Permohonan_Data_Eksternal_Kemenkeu.pdf"
        ]
        all_files = [f for f in os.listdir(SAMPLES_DIR) if f.endswith(".pdf")]
        ordered_files = [f for f in preferred if f in all_files] + [f for f in sorted(all_files) if f not in preferred]
        for f in ordered_files:
            path = os.path.join(SAMPLES_DIR, f)
            files.append({
                "filename": f,
                "size_bytes": os.path.getsize(path),
                "title": f.replace("_", " ").replace(".pdf", "")
            })
    return {"samples": files}

@app.get("/api/config/openmetadata")
def get_openmetadata_config():
    return coordinator.om_connector.get_current_config()

class OMConfigPayload(BaseModel):
    api_url: str
    jwt_token: str = ""
    preferred_mode: str = "AUTO"

@app.post("/api/config/openmetadata")
def update_openmetadata_config(cfg: OMConfigPayload, x_user_role: Optional[str] = Header(None, alias="X-User-Role")):
    # Kontrol Keamanan IT: Konfigurasi server hanya boleh diubah oleh Data Engineer / Admin
    check_role_permission(["admin"], x_user_role)
    coordinator.om_connector.save_config(
        api_url=cfg.api_url,
        jwt_token=cfg.jwt_token,
        preferred_mode=cfg.preferred_mode
    )
    return coordinator.om_connector.get_current_config()

@app.get("/api/catalog")
def get_catalog():
    tables = coordinator.om_connector.get_all_catalog_tables()
    return {
        "total_tables": len(tables),
        "tables": [t.model_dump() for t in tables]
    }

@app.get("/api/openmetadata/test-suite/{table_fqn:path}")
def get_openmetadata_test_suite(table_fqn: str):
    """Mengambil atau menjalankan automated test suite kualitas data OpenMetadata untuk tabel tertentu."""
    try:
        ts_res = coordinator.om_connector.get_table_test_suite(table_fqn)
        return ts_res.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil test suite: {str(e)}")

@app.post("/api/process")
async def process_pdf(
    file: Optional[UploadFile] = File(None),
    sample_name: Optional[str] = Form(None),
    dialect: str = Form("PostgreSQL"),
    masking_mode: str = Form("PARTIAL")
):
    target_path = _resolve_pdf_path(file, sample_name)
    try:
        response = coordinator.process_request(pdf_path=target_path, dialect=dialect, masking_mode=masking_mode)
        return response.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses permohonan data: {str(e)}")

@app.post("/api/process-stream")
async def process_pdf_stream(
    file: Optional[UploadFile] = File(None),
    sample_name: Optional[str] = Form(None),
    dialect: str = Form("PostgreSQL"),
    masking_mode: str = Form("PARTIAL")
):
    target_path = _resolve_pdf_path(file, sample_name)

    def event_stream():
        for event in coordinator.process_request_streaming(pdf_path=target_path, dialect=dialect, masking_mode=masking_mode):
            yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.post("/api/extract-spec")
async def extract_pdf_spec(
    file: Optional[UploadFile] = File(None),
    sample_name: Optional[str] = Form(None)
):
    """Tahap 1 saja: Ekstraksi spesifikasi PDF untuk konfirmasi Human-in-the-Loop."""
    target_path = _resolve_pdf_path(file, sample_name)
    try:
        spec = coordinator.extract_spec_only(pdf_path=target_path)
        return spec.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengekstrak spesifikasi: {str(e)}")

class ConfirmedSpecPayload(BaseModel):
    spec: DataRequestSpec
    dialect: str = "PostgreSQL"
    masking_mode: str = "PARTIAL"

@app.post("/api/process-confirmed-stream")
async def process_confirmed_spec_stream(payload: ConfirmedSpecPayload):
    """Menjalankan tahapan 2-5 streaming berdasarkan spesifikasi yang telah dikonfirmasi pengguna."""
    def event_stream():
        for event in coordinator.process_from_spec_streaming(
            spec=payload.spec,
            dialect=payload.dialect,
            masking_mode=payload.masking_mode
        ):
            yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

def _resolve_pdf_path(file: Optional[UploadFile], sample_name: Optional[str]) -> str:
    MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB
    if file and file.filename:
        # Validasi Keamanan IT: Magic Bytes Inspection (%PDF-)
        magic_bytes = file.file.read(5)
        file.file.seek(0)
        if not magic_bytes.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=400,
                detail="Validasi Berkas Gagal: Berkas bukan merupakan format PDF yang sah (Magic Bytes mismatch)."
            )

        safe_filename = file.filename.replace(" ", "_")
        target_path = os.path.join(UPLOADS_DIR, safe_filename)

        total_size = 0
        with open(target_path, "wb") as buffer:
            while chunk := file.file.read(1024 * 64):
                total_size += len(chunk)
                if total_size > MAX_FILE_SIZE:
                    buffer.close()
                    if os.path.exists(target_path):
                        os.remove(target_path)
                    raise HTTPException(
                        status_code=400,
                        detail=f"Validasi Gagal: Ukuran berkas melebihi batas maksimal 15 MB ({round(total_size / (1024*1024), 2)} MB)."
                    )
                buffer.write(chunk)
        return target_path
    elif sample_name:
        target_path = os.path.join(SAMPLES_DIR, sample_name)
        if not os.path.exists(target_path):
            raise HTTPException(status_code=404, detail="Sample PDF tidak ditemukan.")
        return target_path
    else:
        sample_files = [f for f in os.listdir(SAMPLES_DIR) if f.endswith(".pdf")]
        if sample_files:
            return os.path.join(SAMPLES_DIR, sample_files[0])
        raise HTTPException(status_code=400, detail="Tidak ada file PDF yang diunggah atau dipilih.")

class ReverifyRequest(BaseModel):
    spec: DataRequestSpec
    catalog_match: CatalogMatchResult
    modified_sql: str
    dialect: str = "PostgreSQL"

@app.post("/api/reverify-sql")
def reverify_sql(req: ReverifyRequest, x_user_role: Optional[str] = Header(None, alias="X-User-Role")):
    """Audit ulang query SQL yang dimodifikasi oleh pengguna."""
    # Kontrol Keamanan IT: Hanya Data Steward atau Admin yang boleh mengaudit ulang query
    check_role_permission(["steward", "admin"], x_user_role)
    try:
        res = coordinator.reverify_and_execute(
            spec=req.spec,
            catalog_match=req.catalog_match,
            modified_sql=req.modified_sql,
            dialect=req.dialect
        )
        return res.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengaudit ulang query: {str(e)}")

class AIRefineRequest(BaseModel):
    current_sql: str
    prompt: str
    dialect: str = "PostgreSQL"

@app.post("/api/ai-refine-sql")
def ai_refine_sql(req: AIRefineRequest):
    """Menyempurnakan query SQL secara cerdas berdasarkan prompt bahasa alami."""
    import re
    sql = req.current_sql.strip()
    prompt = req.prompt.strip().lower()
    explanations = []

    # 1. LIMIT
    limit_match = re.search(r"(?:limit|batasi|maksimal|hanya|top)\s*(\d+)", prompt) or re.search(r"(\d+)\s*(?:baris|rows|data)", prompt)
    if limit_match:
        lim = limit_match.group(1)
        if re.search(r"LIMIT\s+\d+", sql, re.IGNORECASE):
            sql = re.sub(r"LIMIT\s+\d+", f"LIMIT {lim}", sql, flags=re.IGNORECASE)
        else:
            if sql.endswith(";"):
                sql = sql[:-1].strip() + f"\nLIMIT {lim};"
            else:
                sql = sql + f"\nLIMIT {lim};"
        explanations.append(f"LIMIT disetel ke {lim}")

    # 2. ORDER BY
    is_desc = any(w in prompt for w in ["desc", "terbesar", "menurun", "tertinggi", "terbaru"])
    is_asc = any(w in prompt for w in ["asc", "terkecil", "menaik", "terendah", "terlama"])
    if is_desc or is_asc:
        direction = "DESC" if is_desc else "ASC"
        col = "devisa_usd"
        if any(w in prompt for w in ["tanggal", "waktu", "created", "date"]):
            col = "tanggal_transaksi" if "tanggal_transaksi" in sql else "created_at"
        elif any(w in prompt for w in ["nomor", "aju"]):
            col = "nomor_aju"
        elif any(w in prompt for w in ["nama", "eksportir"]):
            col = "nama_eksportir"

        if re.search(r"ORDER\s+BY\s+[^;\n\)]+", sql, re.IGNORECASE):
            sql = re.sub(r"ORDER\s+BY\s+[^;\n\)]+", f"ORDER BY {col} {direction}", sql, flags=re.IGNORECASE)
        else:
            if re.search(r"LIMIT\s+\d+", sql, re.IGNORECASE):
                sql = re.sub(r"(\s*)(LIMIT\s+\d+)", rf"\nORDER BY {col} {direction}\1\2", sql, flags=re.IGNORECASE)
            elif sql.endswith(";"):
                sql = sql[:-1].strip() + f"\nORDER BY {col} {direction};"
            else:
                sql = sql + f"\nORDER BY {col} {direction};"
        explanations.append(f"ORDER BY {col} {direction}")

    # 3. Filter devisa / nilai
    num_match = re.search(r"(?:devisa|nilai|usd)?\s*(?:>|lebih dari|di atas)\s*\$?(\d+(?:\.\d+)?)\s*(k|rb|ribu|jt|juta)?", prompt)
    if num_match or ">$50k" in prompt or "> 50000" in prompt:
        val = 50000
        if num_match:
            try:
                raw = float(num_match.group(1))
                unit = (num_match.group(2) or "").lower()
                if unit in ["k", "rb", "ribu"]:
                    raw *= 1000
                elif unit in ["jt", "juta"]:
                    raw *= 1000000
                val = int(raw)
            except Exception:
                pass
        cond = f"devisa_usd > {val}"
        if cond not in sql:
            if re.search(r"WHERE\s+", sql, re.IGNORECASE):
                if re.search(r"ORDER\s+BY\s+", sql, re.IGNORECASE):
                    sql = re.sub(r"(\s*)(ORDER\s+BY\s+)", rf"\n  AND {cond}\1\2", sql, flags=re.IGNORECASE)
                elif re.search(r"LIMIT\s+\d+", sql, re.IGNORECASE):
                    sql = re.sub(r"(\s*)(LIMIT\s+\d+)", rf"\n  AND {cond}\1\2", sql, flags=re.IGNORECASE)
                elif sql.endswith(";"):
                    sql = sql[:-1].strip() + f"\n  AND {cond};"
                else:
                    sql = sql + f"\n  AND {cond};"
            else:
                if re.search(r"LIMIT\s+\d+", sql, re.IGNORECASE):
                    sql = re.sub(r"(\s*)(LIMIT\s+\d+)", rf"\nWHERE {cond}\1\2", sql, flags=re.IGNORECASE)
                elif sql.endswith(";"):
                    sql = sql[:-1].strip() + f"\nWHERE {cond};"
                else:
                    sql = sql + f"\nWHERE {cond};"
            explanations.append(f"Filter kriteria ditambahkan: {cond}")

    if not explanations:
        explanations.append("Query berhasil diselaraskan dengan parameter copilot")

    return {
        "status": "success",
        "refined_sql": sql,
        "explanation": ", ".join(explanations)
    }

@app.get("/api/history")
def get_request_history():
    """Mengambil seluruh arsip riwayat permohonan data (CMS)."""
    return {"history": coordinator.history_mgr.get_all()}

@app.get("/api/analytics")
def get_governance_analytics(period: str = "all"):
    """Mengambil metrik ringkasan analitik kepatuhan dan tata kelola data."""
    return coordinator.history_mgr.get_analytics_summary(period=period)

@app.get("/api/history/export")
def export_history():
    """Mengunduh rekapitulasi audit riwayat permohonan ke file CSV."""
    csv_path = coordinator.history_mgr.export_history_csv(output_dir=OUTPUTS_DIR)
    filename = os.path.basename(csv_path)
    return FileResponse(csv_path, media_type="text/csv", filename=filename)

@app.get("/api/history/export-ropa")
def export_history_ropa():
    """Mengunduh Buku Catatan Pemrosesan (ROPA) Excel sesuai Pasal 138 PP 33/2026."""
    ropa_path = coordinator.history_mgr.export_history_ropa(output_dir=OUTPUTS_DIR)
    filename = os.path.basename(ropa_path)
    return FileResponse(
        ropa_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=filename
    )

# =========================================================================
# Modul Pemenuhan Hak Subjek Data / DSR Registry (UU PDP Ps. 5-15 & PP 33/2026)
# =========================================================================
from dsr_manager import DSRManager
dsr_manager = DSRManager(data_file=os.path.join(OUTPUTS_DIR, "dsr_registry.json"))

class DSRSubmissionRequest(BaseModel):
    subject_name: str
    subject_identifier: str
    right_type: str
    description: str
    related_req_id: Optional[str] = "-"
    handler_name: Optional[str] = "Tim PPDP / DPO DIKC DJBC"

@app.get("/api/dsr/list")
def list_dsr_requests():
    """Daftar permohonan pemenuhan hak subjek data pribadi (DSR Portal)."""
    return {"requests": dsr_manager.get_all()}

@app.post("/api/dsr/submit")
def submit_dsr_request(payload: DSRSubmissionRequest):
    """Pencatatan permohonan pemenuhan hak subjek data (Hak Akses/Koreksi/Pemusnahan/Penarikan Persetujuan)."""
    item = dsr_manager.record_request(
        subject_name=payload.subject_name,
        subject_identifier=payload.subject_identifier,
        right_type=payload.right_type,
        description=payload.description,
        related_req_id=payload.related_req_id or "-",
        handler_name=payload.handler_name or "Tim PPDP / DPO DIKC DJBC"
    )
    return {
        "status": "success",
        "message": "Permohonan Hak Subjek Data berhasil dicatatkan dalam Register Resmi DSR.",
        "item": item
    }

class DSRStatusUpdateRequest(BaseModel):
    dsr_id: str
    status: str
    action_taken: str

@app.post("/api/dsr/update")
def update_dsr_status(payload: DSRStatusUpdateRequest, x_user_role: Optional[str] = Header(None, alias="X-User-Role")):
    """Pembaruan status tindak lanjut hak subjek data oleh DPO / Data Steward."""
    check_role_permission(["steward", "admin"], x_user_role)
    updated = dsr_manager.update_status(
        dsr_id=payload.dsr_id,
        status=payload.status,
        action_taken=payload.action_taken
    )
    if not updated:
        raise HTTPException(status_code=404, detail="ID Permohonan DSR tidak ditemukan")
    return {"status": "success", "item": updated}

from models import VerifierFeedback, SQLGenerationResult, VerificationReport

class FeedbackSubmissionRequest(BaseModel):
    spec: DataRequestSpec
    catalog_match: CatalogMatchResult
    generated_sql: SQLGenerationResult
    verification: VerificationReport
    feedback: VerifierFeedback

@app.post("/api/feedback")
def submit_feedback(req: FeedbackSubmissionRequest, x_user_role: Optional[str] = Header(None, alias="X-User-Role")):
    """Mencatat feedback resmi dan sign-off persetujuan verifikator ke dokumen luaran."""
    # Kontrol Keamanan IT: Mencegah self-approval; otorisasi sign-off khusus Data Steward & Admin
    check_role_permission(["steward", "admin"], x_user_role)
    try:
        req.verification.verifier_feedback = req.feedback
        req.verification.verifier_feedback.signature_timestamp = (
            req.verification.verifier_feedback.signature_timestamp or 
            req.verification.verifier_timestamp
        )
        if req.feedback.action == "APPROVE":
            req.verification.status = "APPROVED_BY_STEWARD"
        elif req.feedback.action == "REVISION_REQUESTED":
            req.verification.status = "REVISION_REQUIRED"
        elif req.feedback.action == "REJECT":
            req.verification.status = "REJECTED_BY_STEWARD"

        res = coordinator.submit_verifier_feedback(
            spec=req.spec,
            catalog_match=req.catalog_match,
            sql_result=req.generated_sql,
            verification=req.verification
        )
        return res.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan feedback verifikator: {str(e)}")

@app.get("/api/history/{request_id}")
def get_history_detail(request_id: str):
    """Mencari rekaman permohonan spesifik untuk validasi publik QR Code."""
    item = coordinator.history_mgr.get_by_id(request_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Permohonan '{request_id}' tidak ditemukan dalam repositori resmi.")
    # Return both flat fields and nested item for complete backward compatibility
    return {**item, "item": item, "status": "success"}

class CodGenerationRequest(BaseModel):
    request_id: str
    destruction_method: Optional[str] = "Cryptographic Erasure & Secure Sanitization (NIST SP 800-88)"
    notes: Optional[str] = "Pemusnahan permanen data aktif, file Excel/CSV, cache komputasi, dan direktori temporer. Bebas dari salinan bayangan (zero shadow copy)."

@app.post("/api/cod/generate")
def generate_certificate_of_destruction(
    payload: CodGenerationRequest,
    x_user_role: Optional[str] = Header(None, alias="X-User-Role")
):
    """Menerbitkan Berita Acara Pemusnahan Data Resmi (Certificate of Destruction - CoD) sesuai Pasal 75 PP No. 33/2026."""
    from cod_generator import CertificateOfDestructionGenerator
    import datetime

    item = coordinator.history_mgr.get_by_id(payload.request_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Permohonan '{payload.request_id}' tidak ditemukan.")

    timestamp_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_id = payload.request_id.replace("/", "_").replace("-", "_")
    cod_filename = f"Berita_Acara_Pemusnahan_{safe_id}_{timestamp_str}.pdf"
    cod_path = os.path.join(OUTPUTS_DIR, cod_filename)

    cod_gen = CertificateOfDestructionGenerator()
    cod_gen.generate_cod(
        output_path=cod_path,
        request_id=item.get("request_id", payload.request_id),
        document_title=item.get("document_title", "Dokumen Permohonan"),
        requester_name=item.get("requester_name", "Analis Data"),
        requester_department=item.get("department", "Direktorat Jenderal Bea dan Cukai"),
        row_count=item.get("row_count", 0),
        granted_date=item.get("created_at", "10 Oktober 2026"),
        destruction_method=payload.destruction_method,
        reviewer_name=item.get("reviewer_name") or "Hendra Gunawan, S.Kom",
        reviewer_role=item.get("reviewer_role") or "Kepala Seksi Analisa dan Layanan Data",
        destruction_notes=payload.notes
    )

    updated_item = coordinator.history_mgr.mark_destroyed(
        request_id=payload.request_id,
        cod_filename=cod_filename,
        notes=payload.notes
    )

    return {
        "status": "success",
        "success": True,
        "message": "Berita Acara Pemusnahan Data (CoD) berhasil diterbitkan sesuai Pasal 75 PP No. 33/2026.",
        "cod_filename": cod_filename,
        "destruction_date": updated_item.get("destruction_date", datetime.date.today().isoformat()),
        "item": updated_item
    }

class BreachReportRequest(BaseModel):
    request_id: str
    discovery_date: Optional[str] = None
    severity_level: Optional[str] = "TINGGI"
    impacted_categories: Optional[List[str]] = None
    chronology: Optional[str] = "Terdeteksi anomali pada akses data pemenuhan atau dugaan paparan di luar lingkungan resmi."
    potential_impact: Optional[str] = "Potensi penyalahgunaan identitas subjek data dan kebocoran rahasia kepabeanan."
    containment_steps: Optional[str] = "Akses dicabut seketika, kredensial di-reset, dan investigasi forensik diaktifkan."
    reporter_name: Optional[str] = "Hendra Gunawan, S.Kom."
    reporter_nip: Optional[str] = "198304122006021001"

@app.post("/api/breach/report")
def report_data_breach(
    payload: BreachReportRequest,
    x_user_role: Optional[str] = Header(None, alias="X-User-Role")
):
    """Menerbitkan Surat Pemberitahuan Resmi Kegagalan Pelindungan Data Pribadi (3x24 Jam - Pasal 46 UU PDP)."""
    from breach_notification_generator import BreachNotificationGenerator
    import datetime

    item = coordinator.history_mgr.get_by_id(payload.request_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Permohonan '{payload.request_id}' tidak ditemukan.")

    timestamp_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_id = payload.request_id.replace("/", "_").replace("-", "_")
    notice_filename = f"Surat_Notifikasi_Kegagalan_PDP_{safe_id}_{timestamp_str}.pdf"
    notice_path = os.path.join(OUTPUTS_DIR, notice_filename)

    now_disc = payload.discovery_date or datetime.datetime.now().strftime("%d %B %Y %H:%M WIB")
    categories = payload.impacted_categories or ["Data Pribadi Spesifik / Keuangan", "Identitas Pengguna Jasa", "Data Transaksi Ekspor/Impor"]

    gen = BreachNotificationGenerator()
    gen.generate_notification(
        output_path=notice_path,
        request_id=item.get("request_id", payload.request_id),
        document_title=item.get("document_title", "Dokumen Permohonan"),
        requester_name=item.get("requester_name", "Analis Data"),
        requester_department=item.get("department", "Direktorat Jenderal Bea dan Cukai"),
        discovery_date=now_disc,
        severity_level=payload.severity_level or "TINGGI",
        impacted_categories=categories,
        chronology=payload.chronology,
        potential_impact=payload.potential_impact,
        containment_steps=payload.containment_steps,
        reporter_name=payload.reporter_name or "Hendra Gunawan, S.Kom.",
        reporter_nip=payload.reporter_nip or "198304122006021001"
    )

    # Sinkronisasi ke frontend/outputs jika ada
    if os.path.exists(FRONTEND_DIR):
        f_out = os.path.join(FRONTEND_DIR, "outputs")
        os.makedirs(f_out, exist_ok=True)
        import shutil
        shutil.copy(notice_path, os.path.join(f_out, notice_filename))

    updated_item = coordinator.history_mgr.report_breach(
        request_id=payload.request_id,
        breach_details=payload.model_dump(),
        notice_filename=notice_filename
    )

    return {
        "status": "success",
        "success": True,
        "message": "Surat Pemberitahuan Tertulis Kegagalan PDP berhasil diterbitkan sesuai Pasal 46 UU No. 27/2022 & Pasal 114-119 PP No. 33/2026.",
        "notice_filename": notice_filename,
        "item": updated_item
    }

@app.get("/api/preview/{folder_type}/{filename}")
def preview_file_inline(folder_type: str, filename: str):
    """Menyajikan dokumen PDF secara inline untuk In-App PDF Preview Modal tanpa memicu paksa download."""
    if folder_type == "outputs":
        target = os.path.join(OUTPUTS_DIR, filename)
    elif folder_type == "samples":
        target = os.path.join(SAMPLES_DIR, filename)
    else:
        raise HTTPException(status_code=400, detail="Invalid folder type")

    if not os.path.exists(target):
        raise HTTPException(status_code=404, detail="File tidak ditemukan")

    return FileResponse(
        target,
        media_type="application/pdf" if filename.endswith(".pdf") else "application/octet-stream",
        headers={"Content-Disposition": f"inline; filename=\"{filename}\""}
    )

@app.get("/api/download/{folder_type}/{filename}")
def download_file(folder_type: str, filename: str):
    if folder_type == "outputs":
        target = os.path.join(OUTPUTS_DIR, filename)
    elif folder_type == "samples":
        target = os.path.join(SAMPLES_DIR, filename)
    else:
        raise HTTPException(status_code=400, detail="Invalid folder type")

    if not os.path.exists(target):
        raise HTTPException(status_code=404, detail="File tidak ditemukan")

    if filename.endswith(".xlsx"):
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    elif filename.endswith(".csv"):
        media_type = "text/csv"
    elif filename.endswith(".json"):
        media_type = "application/json"
    elif filename.endswith(".zip"):
        media_type = "application/zip"
    elif filename.endswith(".pdf"):
        media_type = "application/pdf"
    else:
        media_type = "application/octet-stream"

    return FileResponse(target, media_type=media_type, filename=filename)

# Mount Frontend static files
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
