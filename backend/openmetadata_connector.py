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
        """Built-in Enterprise DWH Catalog for DJBC Customs, Excise, Facility, Revenue, and Disputes."""
        return [
            # 1. TABEL UTAMA KEPABEANAN: fct_peb_ekspor (Fakta Dokumen Ekspor PEB)
            OpenMetadataTable(
                fqn="dwh_ceisa.ekspor.fct_peb_ekspor",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="ekspor",
                table_name="fct_peb_ekspor",
                description="Tabel fakta transaksi ekspor barang, devisa hasil ekspor, dan dokumen PEB (Pemberitahuan Ekspor Barang BC 3.0).",
                tier="Tier 1 - Mission Critical",
                owner="Direktorat Teknis Kepabeanan & Subdit Ekspor",
                lineage_upstream=["staging_ceisa.stg_peb_header", "staging_ceisa.stg_nopen_online"],
                lineage_downstream=["datamart_ceisa.dm_kinerja_ekspor_bulanan", "datamart_ceisa.dm_devisa_ekspor"],
                columns=[
                    OpenMetadataColumn(name="nomor_aju", data_type="VARCHAR(32)", description="Nomor Pengajuan 26-digit Dokumen PEB BC 3.0", tags=["PK", "Core"]),
                    OpenMetadataColumn(name="nomor_daftar", data_type="VARCHAR(16)", description="Nomor Pendaftaran PEB / Nopen 6 digit", tags=["Core"]),
                    OpenMetadataColumn(name="nomor_peb", data_type="VARCHAR(32)", description="Nomor Pendaftaran PEB (nopen)", tags=["Core"]),
                    OpenMetadataColumn(name="tanggal_daftar", data_type="TIMESTAMP", description="Tanggal pendaftaran dokumen ekspor PEB", tags=["Temporal", "PartitionKey"]),
                    OpenMetadataColumn(name="tanggal_peb", data_type="TIMESTAMP", description="Tanggal pendaftaran dokumen ekspor", tags=["Temporal"]),
                    OpenMetadataColumn(name="kantor_ekspor", data_type="VARCHAR(64)", description="Kantor pabean pendaftaran ekspor (contoh: KPPBC TMP TANJUNG PERAK)", tags=["Dimension"]),
                    OpenMetadataColumn(name="kantor_muat", data_type="VARCHAR(64)", description="Kantor pabean pemuatan barang ekspor", tags=["Dimension"]),
                    OpenMetadataColumn(name="kode_kantor", data_type="VARCHAR(8)", description="Kode kantor pabean pemuatan (contoh: 040300 - Tanjung Priok)", tags=["Dimension"]),
                    OpenMetadataColumn(name="npwp_eksportir", data_type="VARCHAR(20)", description="NPWP 15/16 digit perusahaan eksportir", tags=["FK", "PII", "Restricted"], is_pii=True),
                    OpenMetadataColumn(name="nama_eksportir", data_type="VARCHAR(128)", description="Nama entitas badan usaha eksportir", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="alamat_eksportir", data_type="VARCHAR(256)", description="Alamat domisili eksportir", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="npwp_ppjk", data_type="VARCHAR(20)", description="NPWP Perusahaan Pengurusan Jasa Kepabeanan", tags=["PII", "Restricted"], is_pii=True),
                    OpenMetadataColumn(name="nama_ppjk", data_type="VARCHAR(128)", description="Nama entitas PPJK pengurus dokumen", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="nama_penerima", data_type="VARCHAR(128)", description="Nama entitas penerima barang di luar negeri (Consignee)", tags=["Dimension"]),
                    OpenMetadataColumn(name="negara_penerima", data_type="VARCHAR(64)", description="Negara domisili penerima barang", tags=["Geography"]),
                    OpenMetadataColumn(name="nama_pembeli", data_type="VARCHAR(128)", description="Nama entitas pembeli di luar negeri (Buyer)", tags=["Dimension"]),
                    OpenMetadataColumn(name="negara_pembeli", data_type="VARCHAR(64)", description="Negara domisili pembeli", tags=["Geography"]),
                    OpenMetadataColumn(name="negara_tujuan", data_type="VARCHAR(64)", description="Negara tujuan akhir ekspor barang", tags=["Dimension", "Geography"]),
                    OpenMetadataColumn(name="seri_barang", data_type="INTEGER", description="Nomor urut seri barang ekspor", tags=["Dimension"]),
                    OpenMetadataColumn(name="kode_hs", data_type="VARCHAR(16)", description="Klasifikasi pos tarif 8/10 digit HS Code (contoh: 7112999000)", tags=["Dimension", "Classification"]),
                    OpenMetadataColumn(name="uraian_barang", data_type="VARCHAR(500)", description="Uraian jenis dan spesifikasi komoditas barang ekspor", tags=["Dimension"]),
                    OpenMetadataColumn(name="jumlah_satuan", data_type="NUMERIC(18,4)", description="Jumlah kuantitas barang ekspor", tags=["Metric"]),
                    OpenMetadataColumn(name="jenis_satuan", data_type="VARCHAR(16)", description="Satuan barang (KGM, PCS, TNE, dsb.)", tags=["Dimension"]),
                    OpenMetadataColumn(name="netto_barang", data_type="NUMERIC(18,4)", description="Berat bersih (Net Weight) barang (Kg)", tags=["Metric"]),
                    OpenMetadataColumn(name="valuta", data_type="VARCHAR(8)", description="Kode valuta transaksi (USD, IDR, JPY, EUR)", tags=["Dimension"]),
                    OpenMetadataColumn(name="kurs", data_type="NUMERIC(18,4)", description="Nilai kurs Keputusan Menteri Keuangan (KMK)", tags=["Metric"]),
                    OpenMetadataColumn(name="fob_barang", data_type="NUMERIC(18,2)", description="Nilai Free On Board (FOB) barang dalam valuta", tags=["Metric"]),
                    OpenMetadataColumn(name="nilai_fob_usd", data_type="NUMERIC(18,2)", description="Nilai Free on Board dalam valuta USD", tags=["Metric"]),
                    OpenMetadataColumn(name="nilai_devisa_idr", data_type="NUMERIC(20,2)", description="Nilai devisa hasil ekspor ekuivalen Rupiah", tags=["Metric"]),
                    OpenMetadataColumn(name="tarif_bea_keluar", data_type="NUMERIC(8,4)", description="Tarif pungutan Bea Keluar ekspor (Advalorem % atau spesifik)", tags=["Metric"]),
                    OpenMetadataColumn(name="bea_keluar_barang", data_type="NUMERIC(18,2)", description="Nominal pungutan Bea Keluar ekspor barang (Rupiah)", tags=["Metric"]),
                    OpenMetadataColumn(name="pph_ekspor_peb", data_type="NUMERIC(18,2)", description="Pajak Penghasilan (PPh Pasal 22) Ekspor (Rupiah)", tags=["Metric"]),
                    OpenMetadataColumn(name="jalur", data_type="VARCHAR(8)", description="Jalur pelayanan pabean: H (Hijau), K (Kuning), M (Merah)", tags=["Dimension", "Filter"]),
                    OpenMetadataColumn(name="status_pabean", data_type="VARCHAR(32)", description="Status persetujuan pabean: NPE, PERIKSA_FISIK, REVISI, BATAL", tags=["Dimension", "Filter"]),
                    OpenMetadataColumn(name="created_at", data_type="TIMESTAMP", description="Waktu data tersinkronisasi ke DWH CEISA", tags=["System"])
                ]
            ),
            # 2. TABEL UTAMA KEPABEANAN: fct_pib_impor (Fakta Dokumen Impor PIB)
            OpenMetadataTable(
                fqn="dwh_ceisa.impor.fct_pib_impor",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="impor",
                table_name="fct_pib_impor",
                description="Tabel fakta arus barang impor, nilai pabean CIF, pungutan bea masuk, dan jalur pelayanan PIB (BC 2.0).",
                tier="Tier 1 - Mission Critical",
                owner="Direktorat Teknis Kepabeanan & Subdit Impor",
                lineage_upstream=["staging_ceisa.stg_pib_header", "staging_ceisa.stg_billing_mpn"],
                lineage_downstream=["datamart_ceisa.dm_penerimaan_pabean", "datamart_ceisa.dm_profiling_komoditas"],
                columns=[
                    OpenMetadataColumn(name="nomor_pib", data_type="VARCHAR(32)", description="Nomor pendaftaran PIB resmi", tags=["PK", "Core"]),
                    OpenMetadataColumn(name="tanggal_pib", data_type="TIMESTAMP", description="Tanggal pendaftaran dokumen PIB", tags=["Temporal", "PartitionKey"]),
                    OpenMetadataColumn(name="npwp_importir", data_type="VARCHAR(20)", description="NPWP perusahaan importir", tags=["FK", "PII", "Restricted"], is_pii=True),
                    OpenMetadataColumn(name="nama_importir", data_type="VARCHAR(128)", description="Nama entitas importir", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="kode_kantor", data_type="VARCHAR(8)", description="Kode kantor pabean kedatangan", tags=["Dimension"]),
                    OpenMetadataColumn(name="negara_asal", data_type="VARCHAR(64)", description="Negara asal pengiriman barang", tags=["Dimension", "Geography"]),
                    OpenMetadataColumn(name="nilai_cif_usd", data_type="NUMERIC(18,2)", description="Nilai CIF (Cost, Insurance, Freight) USD", tags=["Metric"]),
                    OpenMetadataColumn(name="bea_masuk_idr", data_type="NUMERIC(18,2)", description="Nominal pungutan Bea Masuk (Rupiah)", tags=["Metric"]),
                    OpenMetadataColumn(name="ppn_impor_idr", data_type="NUMERIC(18,2)", description="Nilai PPN Impor (Rupiah)", tags=["Metric"]),
                    OpenMetadataColumn(name="status_jalur", data_type="VARCHAR(32)", description="Jalur pelayanan: HIJAU, KUNING, MERAH, MITA, AEO", tags=["Dimension", "Filter"]),
                    OpenMetadataColumn(name="created_at", data_type="TIMESTAMP", description="Waktu sinkronisasi DWH", tags=["System"])
                ]
            ),
            # 3. TABEL UTAMA CUKAI: fct_billing_cukai (Fakta Penerimaan Cukai)
            OpenMetadataTable(
                fqn="dwh_ceisa.cukai.fct_billing_cukai",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="cukai",
                table_name="fct_billing_cukai",
                description="Tabel fakta penagihan, billing MPN, dan pelunasan cukai hasil tembakau (HT), MMEA, serta etil alkohol.",
                tier="Tier 1 - Mission Critical",
                owner="Direktorat Teknis dan Fasilitas Cukai",
                lineage_upstream=["staging_ceisa.stg_billing_cukai", "staging_ceisa.stg_pesanan_pita_cukai"],
                lineage_downstream=["datamart_ceisa.dm_target_realisasi_cukai"],
                columns=[
                    OpenMetadataColumn(name="billing_id", data_type="VARCHAR(32)", description="Kode billing MPN G2/G3 perbendaharaan", tags=["PK", "Core"]),
                    OpenMetadataColumn(name="nomor_dokumen_cukai", data_type="VARCHAR(32)", description="Nomor dokumen pemesanan pita cukai (CK-1)", tags=["FK"]),
                    OpenMetadataColumn(name="tanggal_billing", data_type="TIMESTAMP", description="Waktu penerbitan billing cukai", tags=["Temporal", "PartitionKey"]),
                    OpenMetadataColumn(name="npwp_pengusaha_cukai", data_type="VARCHAR(20)", description="NPWP pabrik/pengusaha BKC", tags=["FK", "PII", "Restricted"], is_pii=True),
                    OpenMetadataColumn(name="nama_pabrik", data_type="VARCHAR(128)", description="Nama pabrik / entitas wajib cukai", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="jenis_hasil_tembakau", data_type="VARCHAR(32)", description="Kategori komoditas: SKT, SKM, SPM, MMEA, EA", tags=["Dimension"]),
                    OpenMetadataColumn(name="jumlah_tarif_spesifik", data_type="NUMERIC(15,2)", description="Tarif cukai per batang/liter", tags=["Metric"]),
                    OpenMetadataColumn(name="nilai_penerimaan_cukai", data_type="NUMERIC(20,2)", description="Total penerimaan cukai disetor (Rupiah)", tags=["Metric"]),
                    OpenMetadataColumn(name="status_pelunasan", data_type="VARCHAR(32)", description="Status pembayaran: LUNAS, MENUNGGU_BAYAR, KEDALUWARSA", tags=["Dimension", "Filter"])
                ]
            ),
            # 4. TABEL MANIFEST: fct_manifest_bc11 (Fakta Manifest Kedatangan/Keberangkatan)
            OpenMetadataTable(
                fqn="dwh_ceisa.manifest.fct_manifest_bc11",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="manifest",
                table_name="fct_manifest_bc11",
                description="Tabel pengawasan sarana pengangkut, manifest inward/outward kapal dan pesawat (BC 1.1).",
                tier="Tier 2",
                owner="Direktorat Penindakan dan Penyidikan (P2)",
                lineage_upstream=["staging_ceisa.stg_manifest_inward_outward"],
                lineage_downstream=["datamart_ceisa.dm_pengawasan_manifest"],
                columns=[
                    OpenMetadataColumn(name="nomor_bc11", data_type="VARCHAR(32)", description="Nomor registrasi manifest BC 1.1", tags=["PK", "Core"]),
                    OpenMetadataColumn(name="tanggal_bc11", data_type="TIMESTAMP", description="Tanggal pendaftaran manifest", tags=["Temporal", "PartitionKey"]),
                    OpenMetadataColumn(name="nomor_pos", data_type="VARCHAR(16)", description="Nomor pos manifest kedatangan", tags=["Dimension"]),
                    OpenMetadataColumn(name="nama_sarana_pengangkut", data_type="VARCHAR(128)", description="Nama kapal atau nomor penerbangan pesawat", tags=["Dimension"]),
                    OpenMetadataColumn(name="nama_nahkoda_pilot", data_type="VARCHAR(128)", description="Nama nahkoda atau pilot penanggung jawab", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="pelabuhan_muat", data_type="VARCHAR(64)", description="Pelabuhan keberangkatan/asal muat", tags=["Geography"]),
                    OpenMetadataColumn(name="pelabuhan_tujuan", data_type="VARCHAR(64)", description="Pelabuhan tujuan pembongkaran", tags=["Geography"]),
                    OpenMetadataColumn(name="jumlah_kemasan", data_type="INTEGER", description="Jumlah koli kemasan barang kargo", tags=["Metric"]),
                    OpenMetadataColumn(name="berat_kotor_kg", data_type="NUMERIC(15,2)", description="Berat kotor / gross weight (Kg)", tags=["Metric"]),
                    OpenMetadataColumn(name="status_segel", data_type="VARCHAR(32)", description="Status segel bea cukai: AMAN, DIPERIKSA, DIBONGKAR", tags=["Dimension", "Filter"])
                ]
            ),
            # 5. TABEL DIMENSI PERUSAHAAN KEPABEANAN & CUKAI: dim_perusahaan
            OpenMetadataTable(
                fqn="dwh_ceisa.master.dim_perusahaan",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="master",
                table_name="dim_perusahaan",
                description="Master data profil eksportir, importir, PPJK, dan pengusaha barang kena cukai terdaftar di CEISA & DJP.",
                tier="Tier 1 - Master Data",
                owner="Subdit Pengelolaan Data & Layanan Informasi",
                lineage_upstream=["staging_ceisa.stg_profil_perusahaan_kemenkeu"],
                lineage_downstream=["dwh_ceisa.ekspor.fct_peb_ekspor", "dwh_ceisa.impor.fct_pib_impor", "dwh_ceisa.cukai.fct_billing_cukai"],
                columns=[
                    OpenMetadataColumn(name="npwp_perusahaan", data_type="VARCHAR(20)", description="Nomor Pokok Wajib Pajak 16 digit", tags=["PK", "PII", "Restricted"], is_pii=True),
                    OpenMetadataColumn(name="nama_perusahaan", data_type="VARCHAR(128)", description="Nama resmi badan hukum perusahaan", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="alamat_domisili", data_type="VARCHAR(256)", description="Alamat kantor pusat", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="nik_penanggung_jawab", data_type="VARCHAR(16)", description="NIK pimpinan/penanggung jawab", tags=["PII", "Restricted"], is_pii=True),
                    OpenMetadataColumn(name="email_korespondensi", data_type="VARCHAR(128)", description="Email resmi perusahaan", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="nomor_telepon", data_type="VARCHAR(32)", description="Nomor kontak telepon", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="status_registrasi", data_type="VARCHAR(32)", description="Status registrasi kepabeanan: AKTIF, BLOKIR, DIBEKUKAN", tags=["Dimension", "Filter"]),
                    OpenMetadataColumn(name="kategori_layanan_aeo", data_type="VARCHAR(32)", description="Kategori fasilitas: AEO, MITA_PRIORITAS, REGULER", tags=["Dimension", "Classification"]),
                    OpenMetadataColumn(name="tanggal_terdaftar", data_type="DATE", description="Tanggal perolehan NIB/Akses Kepabeanan", tags=["Temporal"])
                ]
            ),
            # 6. TABEL FAKTA FASILITAS KEPABEANAN & TRANSAKSI: fct_transactions
            OpenMetadataTable(
                fqn="dwh_ceisa.fasilitas.fct_transactions",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="fasilitas",
                table_name="fct_transactions",
                description="Tabel fakta transaksi fasilitas kepabeanan (KITE, Kawasan Berikat, Kemudahan Ekspor/Impor) dan transaksi pabean terintegrasi, memuat tarif pembebasan, bea keluar/masuk, devisa, dan kelengkapan dokumen.",
                tier="Tier 1 - Mission Critical",
                owner="Direktorat Fasilitas Kepabeanan",
                lineage_upstream=["staging_ceisa.stg_peb_header", "staging_ceisa.stg_peb_barang", "staging_ceisa.stg_fasilitas_kite"],
                lineage_downstream=["datamart_ceisa.dm_kinerja_ekspor_bulanan", "datamart_ceisa.dm_fasilitas_tpb"],
                columns=[
                    OpenMetadataColumn(name="nomor_aju", data_type="VARCHAR(32)", description="Nomor Pengajuan 26-digit Dokumen PEB BC 3.0", tags=["PK", "Core"]),
                    OpenMetadataColumn(name="nomor_daftar", data_type="VARCHAR(16)", description="Nomor Pendaftaran PEB / Nopen resmi 6 digit", tags=["Core"]),
                    OpenMetadataColumn(name="tanggal_daftar", data_type="TIMESTAMP", description="Tanggal pendaftaran dokumen ekspor PEB", tags=["Temporal", "PartitionKey"]),
                    OpenMetadataColumn(name="kantor_ekspor", data_type="VARCHAR(64)", description="Kantor pabean pendaftaran ekspor (contoh: KPPBC TMP TANJUNG PERAK)", tags=["Dimension"]),
                    OpenMetadataColumn(name="kantor_muat", data_type="VARCHAR(64)", description="Kantor pabean pemuatan barang ekspor", tags=["Dimension"]),
                    OpenMetadataColumn(name="npwp_eksportir", data_type="VARCHAR(20)", description="NPWP 15/16 digit perusahaan eksportir", tags=["FK", "PII", "Restricted"], is_pii=True),
                    OpenMetadataColumn(name="nama_eksportir", data_type="VARCHAR(128)", description="Nama entitas badan usaha eksportir", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="alamat_eksportir", data_type="VARCHAR(256)", description="Alamat domisili eksportir", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="npwp_ppjk", data_type="VARCHAR(20)", description="NPWP Perusahaan Pengurusan Jasa Kepabeanan (PPJK)", tags=["PII", "Restricted"], is_pii=True),
                    OpenMetadataColumn(name="nama_ppjk", data_type="VARCHAR(128)", description="Nama entitas PPJK pengurus dokumen", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="nama_penerima", data_type="VARCHAR(128)", description="Nama entitas penerima barang di luar negeri (Consignee)", tags=["Dimension"]),
                    OpenMetadataColumn(name="negara_penerima", data_type="VARCHAR(64)", description="Negara domisili penerima barang", tags=["Geography"]),
                    OpenMetadataColumn(name="nama_pembeli", data_type="VARCHAR(128)", description="Nama entitas pembeli di luar negeri (Buyer)", tags=["Dimension"]),
                    OpenMetadataColumn(name="negara_pembeli", data_type="VARCHAR(64)", description="Negara domisili pembeli", tags=["Geography"]),
                    OpenMetadataColumn(name="negara_tujuan", data_type="VARCHAR(64)", description="Negara tujuan akhir ekspor barang", tags=["Dimension", "Geography"]),
                    OpenMetadataColumn(name="seri_barang", data_type="INTEGER", description="Nomor urut seri barang ekspor dalam PEB", tags=["Dimension"]),
                    OpenMetadataColumn(name="kode_hs", data_type="VARCHAR(16)", description="Klasifikasi pos tarif 8/10 digit HS Code (contoh: 7112999000)", tags=["Dimension", "Classification"]),
                    OpenMetadataColumn(name="uraian_barang", data_type="VARCHAR(500)", description="Uraian jenis dan spesifikasi komoditas barang ekspor", tags=["Dimension"]),
                    OpenMetadataColumn(name="jumlah_satuan", data_type="NUMERIC(18,4)", description="Jumlah kuantitas barang ekspor", tags=["Metric"]),
                    OpenMetadataColumn(name="jenis_satuan", data_type="VARCHAR(16)", description="Satuan barang (KGM, PCS, TNE, dsb.)", tags=["Dimension"]),
                    OpenMetadataColumn(name="netto_barang", data_type="NUMERIC(18,4)", description="Berat bersih (Net Weight) barang (Kg)", tags=["Metric"]),
                    OpenMetadataColumn(name="valuta", data_type="VARCHAR(8)", description="Kode valuta transaksi (USD, IDR, JPY, EUR)", tags=["Dimension"]),
                    OpenMetadataColumn(name="kurs", data_type="NUMERIC(18,4)", description="Nilai kurs Keputusan Menteri Keuangan (KMK)", tags=["Metric"]),
                    OpenMetadataColumn(name="fob_barang", data_type="NUMERIC(18,2)", description="Nilai Free On Board (FOB) barang dalam valuta", tags=["Metric"]),
                    OpenMetadataColumn(name="tarif_bea_keluar", data_type="NUMERIC(8,4)", description="Tarif pungutan Bea Keluar ekspor (Advalorem % atau spesifik)", tags=["Metric"]),
                    OpenMetadataColumn(name="bea_keluar_barang", data_type="NUMERIC(18,2)", description="Nominal pungutan Bea Keluar ekspor barang (Rupiah)", tags=["Metric"]),
                    OpenMetadataColumn(name="pph_ekspor_peb", data_type="NUMERIC(18,2)", description="Pajak Penghasilan (PPh Pasal 22) Ekspor (Rupiah)", tags=["Metric"]),
                    OpenMetadataColumn(name="jalur", data_type="VARCHAR(8)", description="Jalur pelayanan pabean: H (Hijau), K (Kuning), M (Merah)", tags=["Dimension", "Filter"]),
                    OpenMetadataColumn(name="status_pabean", data_type="VARCHAR(32)", description="Status persetujuan pabean: NPE, PERIKSA_FISIK, REVISI, BATAL", tags=["Dimension", "Filter"]),
                    # Kolom kompatibilitas pipeline analitik
                    OpenMetadataColumn(name="transaction_id", data_type="VARCHAR(64)", description="Alias ID transaksi unik (sesuai nomor_aju)", tags=["PK", "Core"]),
                    OpenMetadataColumn(name="customer_id", data_type="VARCHAR(32)", description="Alias ID entitas (sesuai npwp_eksportir)", tags=["FK"]),
                    OpenMetadataColumn(name="transaction_date", data_type="TIMESTAMP", description="Alias waktu transaksi (sesuai tanggal_daftar)", tags=["Temporal"]),
                    OpenMetadataColumn(name="total_amount", data_type="NUMERIC(18,2)", description="Alias total nilai transaksi (sesuai fob_barang / devisa)", tags=["Metric"]),
                    OpenMetadataColumn(name="status", data_type="VARCHAR(32)", description="Alias status dokumen transaksi (sesuai status_pabean)", tags=["Dimension", "Filter"]),
                    OpenMetadataColumn(name="created_at", data_type="TIMESTAMP", description="Waktu record dibuat di DWH", tags=["System"])
                ]
            ),
            # 7. TABEL DOKUMEN PELENGKAP PABEAN EKSPOR: dim_dokumen_pelengkap
            OpenMetadataTable(
                fqn="dwh_ceisa.ekspor.dim_dokumen_pelengkap",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="ekspor",
                table_name="dim_dokumen_pelengkap",
                description="Tabel dokumen pelengkap pabean ekspor BC 3.0 (Invoice, Packing List, Certificate of Origin / COO, Bill of Lading, L/C).",
                tier="Tier 2",
                owner="Direktorat Teknis Kepabeanan",
                lineage_upstream=["staging_ceisa.stg_dokumen_pelengkap"],
                lineage_downstream=["dwh_ceisa.ekspor.fct_peb_ekspor", "dwh_ceisa.fasilitas.fct_transactions"],
                columns=[
                    OpenMetadataColumn(name="nomor_aju", data_type="VARCHAR(32)", description="Nomor Pengajuan 26-digit Dokumen PEB (FK)", tags=["PK", "FK"]),
                    OpenMetadataColumn(name="nomor_peb", data_type="VARCHAR(16)", description="Nomor Pendaftaran PEB (Nopen)", tags=["FK"]),
                    OpenMetadataColumn(name="tanggal_peb", data_type="TIMESTAMP", description="Tanggal Pendaftaran PEB", tags=["Temporal"]),
                    OpenMetadataColumn(name="nama_dokumen", data_type="VARCHAR(64)", description="Jenis Dokumen Pelengkap: INVOICE, PACKING LIST, COO, BL", tags=["Dimension"]),
                    OpenMetadataColumn(name="nomor_dokumen", data_type="VARCHAR(128)", description="Nomor resmi dokumen pelengkap", tags=["Core"]),
                    OpenMetadataColumn(name="tanggal_dokumen", data_type="DATE", description="Tanggal penerbitan dokumen pelengkap", tags=["Temporal"])
                ]
            ),
            OpenMetadataTable(
                fqn="dwh_ceisa.fasilitas.dim_customers",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="fasilitas",
                table_name="dim_customers",
                description="Master data profil perusahaan penerima fasilitas kepabeanan, importir produsen KITE/TPB, dan segmentasi kepatuhan.",
                tier="Tier 1",
                owner="Direktorat Fasilitas Kepabeanan",
                lineage_upstream=["staging_ceisa.stg_profil_perusahaan_kemenkeu"],
                lineage_downstream=["dwh_ceisa.fasilitas.fct_transactions"],
                columns=[
                    OpenMetadataColumn(name="customer_id", data_type="VARCHAR(32)", description="Primary key unik nasabah/perusahaan", tags=["PK"]),
                    OpenMetadataColumn(name="customer_name", data_type="VARCHAR(128)", description="Nama lengkap badan usaha/nasabah", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="email", data_type="VARCHAR(128)", description="Alamat email aktif perusahaan", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="phone_number", data_type="VARCHAR(32)", description="Nomor handphone/kontak terdaftar", tags=["PII"], is_pii=True),
                    OpenMetadataColumn(name="nik", data_type="VARCHAR(16)", description="Nomor Induk Kependudukan (16 digit)", tags=["PII", "Restricted"], is_pii=True),
                    OpenMetadataColumn(name="customer_segment", data_type="VARCHAR(32)", description="Segmen fasilitas: PRIORITAS, KITE_INDUSTRI, TPB_BERIKAT, REGULER", tags=["Dimension", "Segmentation"]),
                    OpenMetadataColumn(name="city", data_type="VARCHAR(64)", description="Kota domisili perusahaan", tags=["Geography"]),
                    OpenMetadataColumn(name="province", data_type="VARCHAR(64)", description="Provinsi domisili perusahaan", tags=["Geography"]),
                    OpenMetadataColumn(name="registration_date", data_type="DATE", description="Tanggal pertama kali terdaftar fasilitas", tags=["Temporal"]),
                    OpenMetadataColumn(name="is_active", data_type="BOOLEAN", description="Status keaktifan fasilitas akun (TRUE/FALSE)", tags=["Flag"])
                ]
            ),
            OpenMetadataTable(
                fqn="dwh_ceisa.fasilitas.dim_stores",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="fasilitas",
                table_name="dim_stores",
                description="Tabel dimensi kantor wilayah pengawas fasilitas, lokasi gudang berikat/kawasan industri, dan tipe tempat penimbunan berikat (TPB).",
                tier="Tier 2",
                owner="Direktorat Fasilitas Kepabeanan",
                lineage_upstream=["staging_ceisa.stg_lokasi_tpb"],
                lineage_downstream=["dwh_ceisa.fasilitas.fct_transactions"],
                columns=[
                    OpenMetadataColumn(name="store_id", data_type="VARCHAR(32)", description="Kode unik pos/lokasi fasilitas", tags=["PK"]),
                    OpenMetadataColumn(name="store_name", data_type="VARCHAR(128)", description="Nama kawasan berikat / unit pengawas", tags=["Dimension"]),
                    OpenMetadataColumn(name="region", data_type="VARCHAR(64)", description="Wilayah: Jabodetabek, Jawa Barat, Jawa Tengah, Jawa Timur, Luar Jawa", tags=["Geography"]),
                    OpenMetadataColumn(name="store_type", data_type="VARCHAR(32)", description="Tipe fasilitas: Kawasan Berikat, Gudang Berikat, KITE, Pusat Logistik Berikat", tags=["Dimension"]),
                    OpenMetadataColumn(name="manager_name", data_type="VARCHAR(64)", description="Nama kepala seksi / penanggung jawab pengawas", tags=["Dimension"])
                ]
            ),
            OpenMetadataTable(
                fqn="dwh_ceisa.keberatan.fct_shipments",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="keberatan",
                table_name="fct_shipments",
                description="Tabel pelacakan berkas perkara permohonan keberatan penetapan bea masuk/keluar, sanksi administrasi, pengiriman dokumen keputusan, dan proses banding Pengadilan Pajak.",
                tier="Tier 2",
                owner="Direktorat Keberatan dan Banding",
                lineage_upstream=["staging_ceisa.stg_permohonan_keberatan"],
                lineage_downstream=["datamart_ceisa.dm_kinerja_keberatan_banding"],
                columns=[
                    OpenMetadataColumn(name="shipment_id", data_type="VARCHAR(64)", description="Nomor resi/berkas perkara unik", tags=["PK"]),
                    OpenMetadataColumn(name="transaction_id", data_type="VARCHAR(64)", description="Foreign key dokumen pabean terkait", tags=["FK"]),
                    OpenMetadataColumn(name="courier_name", data_type="VARCHAR(32)", description="Nama ekspedisi/kurir kedinasan dokumen", tags=["Dimension"]),
                    OpenMetadataColumn(name="delivery_status", data_type="VARCHAR(32)", description="Status kirim/sidang: DELIVERED, IN_TRANSIT, FAILED, SIDANG_BANDING", tags=["Dimension", "Filter"]),
                    OpenMetadataColumn(name="shipping_cost", data_type="NUMERIC(10,2)", description="Biaya penanganan administrasi (IDR)", tags=["Metric"]),
                    OpenMetadataColumn(name="dispatch_date", data_type="TIMESTAMP", description="Waktu dokumen dikirimkan ke pemohon", tags=["Temporal"]),
                    OpenMetadataColumn(name="received_date", data_type="TIMESTAMP", description="Waktu tanda terima keputusan oleh pemohon", tags=["Temporal"])
                ]
            ),
            OpenMetadataTable(
                fqn="dwh_ceisa.penerimaan.fct_credit_applications",
                service_name="CEISA40-PostgreSQL-DWH",
                database_name="dwh_ceisa",
                schema_name="penerimaan",
                table_name="fct_credit_applications",
                description="Tabel fakta monitoring target dan realisasi penerimaan negara (Bea Masuk, Bea Keluar, Cukai, dan Pajak Dalam Rangka Impor/PDRI), penetapan piutang, dan evaluasi kepatuhan fiskal.",
                tier="Tier 1",
                owner="Direktorat Penerimaan dan Perencanaan Strategis",
                lineage_upstream=["staging_ceisa.stg_billing_mpn_penerimaan"],
                lineage_downstream=["datamart_ceisa.dm_realisasi_penerimaan_fiskal"],
                columns=[
                    OpenMetadataColumn(name="application_id", data_type="VARCHAR(64)", description="ID pengajuan penetapan piutang/anggaran", tags=["PK"]),
                    OpenMetadataColumn(name="customer_id", data_type="VARCHAR(32)", description="Foreign key wajib pajak/wajib bayar", tags=["FK"]),
                    OpenMetadataColumn(name="loan_amount", data_type="NUMERIC(15,2)", description="Nominal target/ketetapan penerimaan (IDR)", tags=["Metric"]),
                    OpenMetadataColumn(name="tenor_months", data_type="INTEGER", description="Jangka waktu pelunasan (bulan)", tags=["Metric"]),
                    OpenMetadataColumn(name="approval_status", data_type="VARCHAR(32)", description="Status: APPROVED, REJECTED, IN_REVIEW, LUNAS", tags=["Filter"]),
                    OpenMetadataColumn(name="application_date", data_type="TIMESTAMP", description="Waktu ketetapan diterbitkan", tags=["Temporal"]),
                    OpenMetadataColumn(name="credit_score", data_type="INTEGER", description="Skor profil risiko kepatuhan fiskal (300-850)", tags=["Metric"])
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

            # 1. Evaluasi kesesuaian domain entitas utama (Bobot Utama)
            p_low = primary_entity.lower().strip()
            if p_low and (p_low in tbl.table_name.lower() or p_low in tbl.schema_name.lower()):
                score += 0.50
                reasons.append(f"Kesesuaian domain entitas permohonan: '{primary_entity}'")

            # 2. Evaluasi deskripsi dan nama tabel
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

        # Identifikasi strategi join berdasarkan foreign keys resmi katalog
        selected_names = [t.table_name for t in final_selected]
        if "fct_peb_ekspor" in selected_names and "dim_perusahaan" in selected_names:
            join_strategies.append({
                "left_table": "fct_peb_ekspor",
                "right_table": "dim_perusahaan",
                "join_type": "INNER JOIN",
                "on_condition": "fct_peb_ekspor.npwp_eksportir = dim_perusahaan.npwp_perusahaan"
            })
        if "fct_pib_impor" in selected_names and "dim_perusahaan" in selected_names:
            join_strategies.append({
                "left_table": "fct_pib_impor",
                "right_table": "dim_perusahaan",
                "join_type": "INNER JOIN",
                "on_condition": "fct_pib_impor.npwp_importir = dim_perusahaan.npwp_perusahaan"
            })
        if "fct_billing_cukai" in selected_names and "dim_perusahaan" in selected_names:
            join_strategies.append({
                "left_table": "fct_billing_cukai",
                "right_table": "dim_perusahaan",
                "join_type": "INNER JOIN",
                "on_condition": "fct_billing_cukai.npwp_pengusaha_cukai = dim_perusahaan.npwp_perusahaan"
            })
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
        if "fct_transactions" in selected_names and "dim_perusahaan" in selected_names:
            join_strategies.append({
                "left_table": "fct_transactions",
                "right_table": "dim_perusahaan",
                "join_type": "INNER JOIN",
                "on_condition": "fct_transactions.npwp_eksportir = dim_perusahaan.npwp_perusahaan"
            })
        if "fct_peb_ekspor" in selected_names and "dim_dokumen_pelengkap" in selected_names:
            join_strategies.append({
                "left_table": "fct_peb_ekspor",
                "right_table": "dim_dokumen_pelengkap",
                "join_type": "LEFT JOIN",
                "on_condition": "fct_peb_ekspor.nomor_aju = dim_dokumen_pelengkap.nomor_aju"
            })
        if "fct_transactions" in selected_names and "dim_dokumen_pelengkap" in selected_names:
            join_strategies.append({
                "left_table": "fct_transactions",
                "right_table": "dim_dokumen_pelengkap",
                "join_type": "LEFT JOIN",
                "on_condition": "fct_transactions.nomor_aju = dim_dokumen_pelengkap.nomor_aju"
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
