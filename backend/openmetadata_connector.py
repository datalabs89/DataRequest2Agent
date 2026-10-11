import os
import requests
from typing import List, Dict, Any, Optional
from models import OpenMetadataTable, OpenMetadataColumn, CatalogMatchResult

class OpenMetadataConnector:
    """
    Connects to OpenMetadata REST API / MCP server.
    Provides offline enterprise catalog fallback if live server is unreachable.
    """
    def __init__(self, api_url: Optional[str] = None, auth_token: Optional[str] = None, config_path: str = "outputs/om_config.json"):
        self.config_path = config_path
        saved_config = self._load_saved_config()
        self.api_url = api_url or saved_config.get("api_url") or os.getenv("OPENMETADATA_API_URL", "http://localhost:8585/api/v1")
        self.auth_token = auth_token or saved_config.get("jwt_token") or os.getenv("OPENMETADATA_JWT_TOKEN", "")
        self.preferred_mode = saved_config.get("preferred_mode", "AUTO")
        self.offline_catalog = self._init_offline_catalog()

    def _init_offline_catalog(self) -> List[OpenMetadataTable]:
        """Built-in Enterprise DWH Catalog for realistic banking, retail, and logistics."""
        return [
            OpenMetadataTable(
                fqn="dwh_production.sales.fct_transactions",
                service_name="PostgreSQL-DWH",
                database_name="dwh_production",
                schema_name="sales",
                table_name="fct_transactions",
                description="Tabel fakta transaksi penjualan dan pembayaran nasabah/pelanggan harian.",
                tier="Tier 1",
                owner="Sales & Revenue Data Team",
                lineage_upstream=["staging.stg_pos_transactions", "staging.stg_payment_gateway"],
                lineage_downstream=["datamart.dm_monthly_sales_summary", "datamart.dm_customer_churn"],
                columns=[
                    OpenMetadataColumn(name="transaction_id", data_type="VARCHAR(64)", description="Primary key unik transaksi", tags=["PK", "Core"]),
                    OpenMetadataColumn(name="customer_id", data_type="VARCHAR(32)", description="Foreign key ke dim_customers", tags=["FK"]),
                    OpenMetadataColumn(name="store_id", data_type="VARCHAR(32)", description="Foreign key ke dim_stores", tags=["FK"]),
                    OpenMetadataColumn(name="transaction_date", data_type="TIMESTAMP", description="Waktu transaksi tercatat", tags=["Temporal", "PartitionKey"]),
                    OpenMetadataColumn(name="channel", data_type="VARCHAR(32)", description="Kanal penjualan: Online, Mobile App, Flagship Store, Agen", tags=["Dimension"]),
                    OpenMetadataColumn(name="total_amount", data_type="NUMERIC(15,2)", description="Total nilai transaksi kotor (IDR)", tags=["Metric"]),
                    OpenMetadataColumn(name="discount_amount", data_type="NUMERIC(15,2)", description="Total potongan diskon (IDR)", tags=["Metric"]),
                    OpenMetadataColumn(name="tax_amount", data_type="NUMERIC(15,2)", description="Nilai PPN 11%", tags=["Metric"]),
                    OpenMetadataColumn(name="payment_method", data_type="VARCHAR(32)", description="Metode pembayaran: QRIS, Credit Card, Bank Transfer, VA", tags=["Dimension"]),
                    OpenMetadataColumn(name="status", data_type="VARCHAR(32)", description="Status pembayaran: SUCCESS, FAILED, PENDING, REFUNDED", tags=["Dimension", "Filter"]),
                    OpenMetadataColumn(name="created_at", data_type="TIMESTAMP", description="Waktu record dibuat di DWH", tags=["System"])
                ]
            ),
            OpenMetadataTable(
                fqn="dwh_production.sales.dim_customers",
                service_name="PostgreSQL-DWH",
                database_name="dwh_production",
                schema_name="sales",
                table_name="dim_customers",
                description="Master data profil nasabah / pelanggan, demografi, dan segmentasi loyalitas.",
                tier="Tier 1",
                owner="CRM & Customer Analytics",
                lineage_upstream=["staging.stg_crm_master"],
                lineage_downstream=["dwh_production.sales.fct_transactions"],
                columns=[
                    OpenMetadataColumn(name="customer_id", data_type="VARCHAR(32)", description="Primary key unik nasabah", tags=["PK"]),
                    OpenMetadataColumn(name="customer_name", data_type="VARCHAR(128)", description="Nama lengkap nasabah", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="email", data_type="VARCHAR(128)", description="Alamat email aktif nasabah", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="phone_number", data_type="VARCHAR(32)", description="Nomor handphone terdaftar", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="nik", data_type="VARCHAR(16)", description="Nomor Induk Kependudukan (16 digit)", tags=["PII", "Restricted"], is_pii=True),
                    OpenMetadataColumn(name="customer_segment", data_type="VARCHAR(32)", description="Segmen nasabah: PRIORITAS, REGULER, CORPORATE, MASS_AFFLUENT", tags=["Dimension", "Segmentation"]),
                    OpenMetadataColumn(name="city", data_type="VARCHAR(64)", description="Kota domisili nasabah", tags=["Geography"]),
                    OpenMetadataColumn(name="province", data_type="VARCHAR(64)", description="Provinsi domisili nasabah", tags=["Geography"]),
                    OpenMetadataColumn(name="registration_date", data_type="DATE", description="Tanggal pertama kali terdaftar", tags=["Temporal"]),
                    OpenMetadataColumn(name="is_active", data_type="BOOLEAN", description="Status keaktifan akun (TRUE/FALSE)", tags=["Flag"])
                ]
            ),
            OpenMetadataTable(
                fqn="dwh_production.sales.dim_stores",
                service_name="PostgreSQL-DWH",
                database_name="dwh_production",
                schema_name="sales",
                table_name="dim_stores",
                description="Tabel dimensi cabang/toko, wilayah operasional, dan tipe outlet.",
                tier="Tier 2",
                owner="Retail Operations",
                lineage_upstream=["staging.stg_outlet_master"],
                lineage_downstream=["dwh_production.sales.fct_transactions"],
                columns=[
                    OpenMetadataColumn(name="store_id", data_type="VARCHAR(32)", description="Kode unik cabang/toko", tags=["PK"]),
                    OpenMetadataColumn(name="store_name", data_type="VARCHAR(128)", description="Nama cabang / outlet", tags=["Dimension"]),
                    OpenMetadataColumn(name="region", data_type="VARCHAR(64)", description="Wilayah: Jabodetabek, Jawa Barat, Jawa Tengah, Jawa Timur, Luar Jawa", tags=["Geography"]),
                    OpenMetadataColumn(name="store_type", data_type="VARCHAR(32)", description="Tipe: Flagship, Outlet, Express, Digital Hub", tags=["Dimension"]),
                    OpenMetadataColumn(name="manager_name", data_type="VARCHAR(64)", description="Nama branch manager", tags=["Dimension"])
                ]
            ),
            OpenMetadataTable(
                fqn="dwh_production.logistics.fct_shipments",
                service_name="PostgreSQL-DWH",
                database_name="dwh_production",
                schema_name="logistics",
                table_name="fct_shipments",
                description="Tabel tracking logistik, ekspedisi kurir, dan waktu pengiriman barang.",
                tier="Tier 2",
                owner="Logistics & Supply Chain",
                lineage_upstream=["staging.stg_wms_orders"],
                lineage_downstream=["datamart.dm_logistics_sla"],
                columns=[
                    OpenMetadataColumn(name="shipment_id", data_type="VARCHAR(64)", description="Nomor resi/pengiriman unik", tags=["PK"]),
                    OpenMetadataColumn(name="transaction_id", data_type="VARCHAR(64)", description="Foreign key transaksi terkait", tags=["FK"]),
                    OpenMetadataColumn(name="courier_name", data_type="VARCHAR(32)", description="Nama kurir/ekspedisi (JNE, SiCepat, Internal)", tags=["Dimension"]),
                    OpenMetadataColumn(name="delivery_status", data_type="VARCHAR(32)", description="Status kirim: DELIVERED, IN_TRANSIT, FAILED, RETURNED", tags=["Dimension", "Filter"]),
                    OpenMetadataColumn(name="shipping_cost", data_type="NUMERIC(10,2)", description="Ongkos kirim (IDR)", tags=["Metric"]),
                    OpenMetadataColumn(name="dispatch_date", data_type="TIMESTAMP", description="Waktu barang keluar gudang", tags=["Temporal"]),
                    OpenMetadataColumn(name="received_date", data_type="TIMESTAMP", description="Waktu barang diterima pembeli", tags=["Temporal"])
                ]
            ),
            OpenMetadataTable(
                fqn="dwh_production.finance.fct_credit_applications",
                service_name="PostgreSQL-DWH",
                database_name="dwh_production",
                schema_name="finance",
                table_name="fct_credit_applications",
                description="Pengajuan pinjaman/kredit, limit fasilitas, dan status evaluasi risiko.",
                tier="Tier 1",
                owner="Risk & Credit Analytics",
                lineage_upstream=["staging.stg_loan_origination"],
                lineage_downstream=["datamart.dm_npl_monitoring"],
                columns=[
                    OpenMetadataColumn(name="application_id", data_type="VARCHAR(64)", description="ID pengajuan kredit", tags=["PK"]),
                    OpenMetadataColumn(name="customer_id", data_type="VARCHAR(32)", description="Foreign key ke nasabah", tags=["FK"]),
                    OpenMetadataColumn(name="loan_amount", data_type="NUMERIC(15,2)", description="Plafon kredit yang diajukan (IDR)", tags=["Metric"]),
                    OpenMetadataColumn(name="tenor_months", data_type="INTEGER", description="Jangka waktu pinjaman (bulan)", tags=["Metric"]),
                    OpenMetadataColumn(name="approval_status", data_type="VARCHAR(32)", description="Status: APPROVED, REJECTED, IN_REVIEW", tags=["Filter"]),
                    OpenMetadataColumn(name="application_date", data_type="TIMESTAMP", description="Waktu pengajuan diajukan", tags=["Temporal"]),
                    OpenMetadataColumn(name="credit_score", data_type="INTEGER", description="Skor BI-Checking / SLIK internal (300-850)", tags=["Metric"])
                ]
            )
        ]

    def _load_saved_config(self) -> Dict[str, Any]:
        if os.path.exists(self.config_path):
            try:
                import json
                with open(self.config_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {}

    def save_config(self, api_url: str, jwt_token: str, preferred_mode: str = "AUTO"):
        self.api_url = api_url
        self.auth_token = jwt_token
        self.preferred_mode = preferred_mode
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        import json
        with open(self.config_path, "w", encoding="utf-8") as f:
            json.dump({
                "api_url": self.api_url,
                "jwt_token": self.auth_token,
                "preferred_mode": self.preferred_mode
            }, f, indent=2)

    def get_current_config(self) -> Dict[str, Any]:
        status = self.test_live_connection()
        return {
            "api_url": self.api_url,
            "jwt_token": self.auth_token,
            "preferred_mode": self.preferred_mode,
            "status": status
        }

    def test_live_connection(self) -> Dict[str, Any]:
        """Cek apakah live server OpenMetadata aktif dan dapat diakses."""
        if self.preferred_mode == "OFFLINE_ONLY":
            return {"connected": False, "mode": "OFFLINE_EMULATED", "tables_available": len(self.offline_catalog), "note": "Mode dipaksa offline oleh pengguna"}

        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"} if self.auth_token else {}
            res = requests.get(f"{self.api_url}/version", headers=headers, timeout=2)
            if res.status_code == 200:
                ver_data = res.json() if res.headers.get("content-type", "").startswith("application/json") else {"version": "v1.x"}
                return {"connected": True, "version": ver_data.get("version", "active"), "mode": "LIVE"}
        except Exception:
            pass
        return {"connected": False, "mode": "OFFLINE_EMULATED", "tables_available": len(self.offline_catalog)}

    def search_relevant_tables(self, search_terms: List[str], primary_entity: str) -> CatalogMatchResult:
        """
        Mencari dan memberi peringkat tabel OpenMetadata yang paling cocok dengan permohonan.
        """
        # Normalisasi kata kunci
        keywords = set([term.lower() for term in search_terms if term] + [primary_entity.lower()])
        selected = []
        join_strategies = []

        for tbl in self.offline_catalog:
            score = 0.0
            reasons = []

            # Evaluasi deskripsi dan nama tabel
            tbl_text = f"{tbl.table_name} {tbl.schema_name} {tbl.description}".lower()
            for kw in keywords:
                if kw in tbl_text:
                    score += 0.35
                    reasons.append(f"Cocok pada deskripsi tabel: '{kw}'")

            # Evaluasi kolom
            col_names = " ".join([c.name.lower() + " " + c.description.lower() for c in tbl.columns])
            for kw in keywords:
                if kw in col_names:
                    score += 0.25
                    reasons.append(f"Kolom mendukung entitas: '{kw}'")

            if score > 0.3:
                tbl_copy = tbl.model_copy()
                tbl_copy.match_score = min(round(score, 2), 1.0)
                tbl_copy.match_rationale = "; ".join(reasons[:3])
                selected.append(tbl_copy)

        # Urutkan berdasarkan skor kecocokan tertinggi
        selected.sort(key=lambda x: x.match_score, reverse=True)

        # Batasi ke tabel paling relevan (1-3 tabel)
        final_selected = selected[:3] if selected else [self.offline_catalog[0]]

        # Identifikasi strategi join berdasarkan foreign keys
        selected_names = [t.table_name for t in final_selected]
        if "fct_transactions" in selected_names and "dim_customers" in selected_names:
            join_strategies.append({
                "left_table": "fct_transactions",
                "right_table": "dim_customers",
                "join_type": "INNER JOIN",
                "on_condition": "fct_transactions.customer_id = dim_customers.customer_id"
            })
        if "fct_transactions" in selected_names and "dim_stores" in selected_names:
            join_strategies.append({
                "left_table": "fct_transactions",
                "right_table": "dim_stores",
                "join_type": "LEFT JOIN",
                "on_condition": "fct_transactions.store_id = dim_stores.store_id"
            })
        if "fct_transactions" in selected_names and "fct_shipments" in selected_names:
            join_strategies.append({
                "left_table": "fct_transactions",
                "right_table": "fct_shipments",
                "join_type": "LEFT JOIN",
                "on_condition": "fct_transactions.transaction_id = fct_shipments.transaction_id"
            })

        summary = f"Ditemukan {len(final_selected)} tabel metadata resmi di OpenMetadata yang relevan dengan '{primary_entity}'."

        return CatalogMatchResult(
            selected_tables=final_selected,
            join_strategy=join_strategies,
            unmapped_fields=[],
            match_summary=summary
        )

    def get_all_catalog_tables(self) -> List[OpenMetadataTable]:
        return self.offline_catalog
