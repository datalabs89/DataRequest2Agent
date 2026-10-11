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
    title="DataRequest2Agent Studio",
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
        for f in os.listdir(SAMPLES_DIR):
            if f.endswith(".pdf"):
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
