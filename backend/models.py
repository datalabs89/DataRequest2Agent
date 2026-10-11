from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class MaskingPolicy(BaseModel):
    mode: str = "PARTIAL"  # "PARTIAL", "HASH", "FULL_REDACT"
    salt: Optional[str] = "SALT_PDP_2026"

class OpenMetadataConfig(BaseModel):
    api_url: str = "http://localhost:8585/api/v1"
    jwt_token: str = ""
    preferred_mode: str = "AUTO"  # "AUTO", "LIVE_ONLY", "OFFLINE_ONLY"

class AnalyticsSummary(BaseModel):
    total_requests: int
    approved_count: int
    revision_count: int
    rejected_count: int
    compliance_rate_pct: float
    total_rows_delivered: int
    pii_columns_protected_count: int
    department_distribution: Dict[str, int]
    status_distribution: Dict[str, int]

class FilterCriterion(BaseModel):
    field_description: str
    target_column: Optional[str] = None
    operator: str = "="
    value: Any
    rationale: str = ""

class RequestedField(BaseModel):
    name: str
    description: str
    business_term: Optional[str] = None
    pii_sensitive: bool = False
    masking_rule: Optional[str] = None

OFFICIAL_DEPARTMENTS = [
    "Internal Bea dan Cukai",
    "Internal Kemenkeu",
    "Eksternal Kemenkeu"
]

OFFICIAL_BUSINESS_PROCESSES = [
    "Ekspor",
    "Impor",
    "Cukai",
    "Fasilitas",
    "Manifest",
    "Penerimaan",
    "Keberatan & Banding",
    "Dukungan Manajemen",
    "Lainnya"
]

class DataRequestSpec(BaseModel):
    request_id: str = "REQ-UNKNOWN"
    document_title: str
    requester_name: str
    requester_department: str = "Internal Bea dan Cukai"  # Salah satu dari OFFICIAL_DEPARTMENTS
    business_process: str = "Lainnya"  # Salah satu dari OFFICIAL_BUSINESS_PROCESSES
    request_date: Optional[str] = None
    business_purpose: str
    primary_entity: str
    time_range_start: Optional[str] = None
    time_range_end: Optional[str] = None
    requested_fields: List[RequestedField] = []
    filters: List[FilterCriterion] = []
    aggregation_level: Optional[str] = "detail"
    compliance_notes: Optional[str] = None
    raw_text_summary: Optional[str] = None

class OpenMetadataColumn(BaseModel):
    name: str
    data_type: str
    description: str
    tags: List[str] = []
    is_pii: bool = False
    glossary_terms: List[str] = []

class OpenMetadataTable(BaseModel):
    fqn: str  # e.g., "dwh_production.retail.fct_transactions"
    service_name: str
    database_name: str
    schema_name: str
    table_name: str
    description: str
    columns: List[OpenMetadataColumn]
    tier: Optional[str] = "Tier 1"
    owner: Optional[str] = "Data Platform Team"
    lineage_upstream: List[str] = []
    lineage_downstream: List[str] = []
    match_score: float = 0.0
    match_rationale: str = ""

class CatalogMatchResult(BaseModel):
    selected_tables: List[OpenMetadataTable]
    join_strategy: List[Dict[str, str]] = []
    unmapped_fields: List[str] = []
    match_summary: str = ""

class SQLGenerationResult(BaseModel):
    dialect: str = "PostgreSQL"
    query: str
    explanation: str
    selected_columns: List[str]
    applied_filters: List[str]
    tables_used: List[str]

class VerificationCheck(BaseModel):
    category: str  # "Fidelity", "Safety", "PII/Governance", "Syntax/Schema"
    item: str
    passed: bool
    details: str
    severity: str = "HIGH"  # "HIGH", "MEDIUM", "LOW"

class VerifierFeedback(BaseModel):
    reviewer_name: str = "Hendra Gunawan"
    reviewer_role: str = "Head of Data Governance & Compliance"
    action: str = "APPROVE"  # "APPROVE", "REVISION_REQUESTED", "REJECT"
    comments: str = "Data disetujui untuk analisis internal. Akses terbatas sesuai ketentuan PDP."
    signature_timestamp: Optional[str] = None
    digital_signature_hash: Optional[str] = None

class VerificationReport(BaseModel):
    status: str  # "APPROVED", "APPROVED_WITH_WARNINGS", "REJECTED", "APPROVED_BY_STEWARD", "REVISION_REQUIRED", "REJECTED_BY_STEWARD"
    checks: List[VerificationCheck]
    verifier_id: str
    verifier_timestamp: str
    executive_summary: str
    compliance_score: Optional[int] = 100
    digital_fingerprint: Optional[str] = None
    repair_actions_taken: List[str] = []
    verifier_feedback: Optional[VerifierFeedback] = None

class ExecutionResult(BaseModel):
    row_count: int
    column_names: List[str]
    preview_rows: List[Dict[str, Any]]
    excel_path: Optional[str] = None
    csv_path: Optional[str] = None
    zip_path: Optional[str] = None
    certificate_path: Optional[str] = None
    execution_time_ms: float
    dialect: str

class RequestHistoryItem(BaseModel):
    id: str
    request_id: str
    document_title: str
    requester_name: str
    department: str
    created_at: str
    status: str
    row_count: int
    excel_filename: Optional[str] = None
    zip_filename: Optional[str] = None
    comments: Optional[str] = None

class PipelineResponse(BaseModel):
    success: bool
    message: str
    spec: DataRequestSpec
    catalog_match: CatalogMatchResult
    generated_sql: SQLGenerationResult
    verification: VerificationReport
    execution: Optional[ExecutionResult] = None
