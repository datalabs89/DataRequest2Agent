window.MOCK_DATA = {
  "samples": [
    {
      "filename": "Permohonan_Data_Internal_Bea_dan_Cukai.pdf",
      "title": "Permohonan Data Internal Bea dan Cukai (PEB BC 3.0)",
      "size_bytes": 3350
    },
    {
      "filename": "Permohonan_Data_Internal_Kemenkeu.pdf",
      "title": "Permohonan Data Internal Kemenkeu (PIB BC 2.0)",
      "size_bytes": 3109
    },
    {
      "filename": "Permohonan_Data_Eksternal_Kemenkeu.pdf",
      "title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "size_bytes": 3122
    }
  ],
  "catalog": {
    "total_tables": 11,
    "tables": [
      {
        "fqn": "dwh_ceisa.ekspor.fct_peb_ekspor",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "ekspor",
        "table_name": "fct_peb_ekspor",
        "description": "Tabel fakta transaksi ekspor barang, devisa hasil ekspor, dan dokumen PEB (Pemberitahuan Ekspor Barang BC 3.0).",
        "columns": [
          {
            "name": "nomor_aju",
            "data_type": "VARCHAR(32)",
            "description": "Nomor Pengajuan 26-digit Dokumen PEB BC 3.0",
            "tags": [
              "PK",
              "Core"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nomor_daftar",
            "data_type": "VARCHAR(16)",
            "description": "Nomor Pendaftaran PEB / Nopen 6 digit",
            "tags": [
              "Core"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nomor_peb",
            "data_type": "VARCHAR(32)",
            "description": "Nomor Pendaftaran PEB (nopen)",
            "tags": [
              "Core"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tanggal_daftar",
            "data_type": "TIMESTAMP",
            "description": "Tanggal pendaftaran dokumen ekspor PEB",
            "tags": [
              "Temporal",
              "PartitionKey"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tanggal_peb",
            "data_type": "TIMESTAMP",
            "description": "Tanggal pendaftaran dokumen ekspor",
            "tags": [
              "Temporal"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "kantor_ekspor",
            "data_type": "VARCHAR(64)",
            "description": "Kantor pabean pendaftaran ekspor (contoh: KPPBC TMP TANJUNG PERAK)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "kantor_muat",
            "data_type": "VARCHAR(64)",
            "description": "Kantor pabean pemuatan barang ekspor",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "kode_kantor",
            "data_type": "VARCHAR(8)",
            "description": "Kode kantor pabean pemuatan (contoh: 040300 - Tanjung Priok)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "npwp_eksportir",
            "data_type": "VARCHAR(20)",
            "description": "NPWP 15/16 digit perusahaan eksportir",
            "tags": [
              "FK",
              "PII",
              "Restricted"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nama_eksportir",
            "data_type": "VARCHAR(128)",
            "description": "Nama entitas badan usaha eksportir",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "alamat_eksportir",
            "data_type": "VARCHAR(256)",
            "description": "Alamat domisili eksportir",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "npwp_ppjk",
            "data_type": "VARCHAR(20)",
            "description": "NPWP Perusahaan Pengurusan Jasa Kepabeanan",
            "tags": [
              "PII",
              "Restricted"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nama_ppjk",
            "data_type": "VARCHAR(128)",
            "description": "Nama entitas PPJK pengurus dokumen",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nama_penerima",
            "data_type": "VARCHAR(128)",
            "description": "Nama entitas penerima barang di luar negeri (Consignee)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "negara_penerima",
            "data_type": "VARCHAR(64)",
            "description": "Negara domisili penerima barang",
            "tags": [
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nama_pembeli",
            "data_type": "VARCHAR(128)",
            "description": "Nama entitas pembeli di luar negeri (Buyer)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "negara_pembeli",
            "data_type": "VARCHAR(64)",
            "description": "Negara domisili pembeli",
            "tags": [
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "negara_tujuan",
            "data_type": "VARCHAR(64)",
            "description": "Negara tujuan akhir ekspor barang",
            "tags": [
              "Dimension",
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "seri_barang",
            "data_type": "INTEGER",
            "description": "Nomor urut seri barang ekspor",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "kode_hs",
            "data_type": "VARCHAR(16)",
            "description": "Klasifikasi pos tarif 8/10 digit HS Code (contoh: 7112999000)",
            "tags": [
              "Dimension",
              "Classification"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "uraian_barang",
            "data_type": "VARCHAR(500)",
            "description": "Uraian jenis dan spesifikasi komoditas barang ekspor",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "jumlah_satuan",
            "data_type": "NUMERIC(18,4)",
            "description": "Jumlah kuantitas barang ekspor",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "jenis_satuan",
            "data_type": "VARCHAR(16)",
            "description": "Satuan barang (KGM, PCS, TNE, dsb.)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "netto_barang",
            "data_type": "NUMERIC(18,4)",
            "description": "Berat bersih (Net Weight) barang (Kg)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "valuta",
            "data_type": "VARCHAR(8)",
            "description": "Kode valuta transaksi (USD, IDR, JPY, EUR)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "kurs",
            "data_type": "NUMERIC(18,4)",
            "description": "Nilai kurs Keputusan Menteri Keuangan (KMK)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "fob_barang",
            "data_type": "NUMERIC(18,2)",
            "description": "Nilai Free On Board (FOB) barang dalam valuta",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nilai_fob_usd",
            "data_type": "NUMERIC(18,2)",
            "description": "Nilai Free on Board dalam valuta USD",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nilai_devisa_idr",
            "data_type": "NUMERIC(20,2)",
            "description": "Nilai devisa hasil ekspor ekuivalen Rupiah",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tarif_bea_keluar",
            "data_type": "NUMERIC(8,4)",
            "description": "Tarif pungutan Bea Keluar ekspor (Advalorem % atau spesifik)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "bea_keluar_barang",
            "data_type": "NUMERIC(18,2)",
            "description": "Nominal pungutan Bea Keluar ekspor barang (Rupiah)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "pph_ekspor_peb",
            "data_type": "NUMERIC(18,2)",
            "description": "Pajak Penghasilan (PPh Pasal 22) Ekspor (Rupiah)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "jalur",
            "data_type": "VARCHAR(8)",
            "description": "Jalur pelayanan pabean: H (Hijau), K (Kuning), M (Merah)",
            "tags": [
              "Dimension",
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "status_pabean",
            "data_type": "VARCHAR(32)",
            "description": "Status persetujuan pabean: NPE, PERIKSA_FISIK, REVISI, BATAL",
            "tags": [
              "Dimension",
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "created_at",
            "data_type": "TIMESTAMP",
            "description": "Waktu data tersinkronisasi ke DWH CEISA",
            "tags": [
              "System"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 1 - Mission Critical",
        "owner": "Direktorat Teknis Kepabeanan & Subdit Ekspor",
        "lineage_upstream": [
          "staging_ceisa.stg_peb_header",
          "staging_ceisa.stg_nopen_online"
        ],
        "lineage_downstream": [
          "datamart_ceisa.dm_kinerja_ekspor_bulanan",
          "datamart_ceisa.dm_devisa_ekspor"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      },
      {
        "fqn": "dwh_ceisa.impor.fct_pib_impor",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "impor",
        "table_name": "fct_pib_impor",
        "description": "Tabel fakta arus barang impor, nilai pabean CIF, pungutan bea masuk, dan jalur pelayanan PIB (BC 2.0).",
        "columns": [
          {
            "name": "nomor_pib",
            "data_type": "VARCHAR(32)",
            "description": "Nomor pendaftaran PIB resmi",
            "tags": [
              "PK",
              "Core"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tanggal_pib",
            "data_type": "TIMESTAMP",
            "description": "Tanggal pendaftaran dokumen PIB",
            "tags": [
              "Temporal",
              "PartitionKey"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "npwp_importir",
            "data_type": "VARCHAR(20)",
            "description": "NPWP perusahaan importir",
            "tags": [
              "FK",
              "PII",
              "Restricted"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nama_importir",
            "data_type": "VARCHAR(128)",
            "description": "Nama entitas importir",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "kode_kantor",
            "data_type": "VARCHAR(8)",
            "description": "Kode kantor pabean kedatangan",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "negara_asal",
            "data_type": "VARCHAR(64)",
            "description": "Negara asal pengiriman barang",
            "tags": [
              "Dimension",
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nilai_cif_usd",
            "data_type": "NUMERIC(18,2)",
            "description": "Nilai CIF (Cost, Insurance, Freight) USD",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "bea_masuk_idr",
            "data_type": "NUMERIC(18,2)",
            "description": "Nominal pungutan Bea Masuk (Rupiah)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "ppn_impor_idr",
            "data_type": "NUMERIC(18,2)",
            "description": "Nilai PPN Impor (Rupiah)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "status_jalur",
            "data_type": "VARCHAR(32)",
            "description": "Jalur pelayanan: HIJAU, KUNING, MERAH, MITA, AEO",
            "tags": [
              "Dimension",
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "created_at",
            "data_type": "TIMESTAMP",
            "description": "Waktu sinkronisasi DWH",
            "tags": [
              "System"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 1 - Mission Critical",
        "owner": "Direktorat Teknis Kepabeanan & Subdit Impor",
        "lineage_upstream": [
          "staging_ceisa.stg_pib_header",
          "staging_ceisa.stg_billing_mpn"
        ],
        "lineage_downstream": [
          "datamart_ceisa.dm_penerimaan_pabean",
          "datamart_ceisa.dm_profiling_komoditas"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      },
      {
        "fqn": "dwh_ceisa.cukai.fct_billing_cukai",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "cukai",
        "table_name": "fct_billing_cukai",
        "description": "Tabel fakta penagihan, billing MPN, dan pelunasan cukai hasil tembakau (HT), MMEA, serta etil alkohol.",
        "columns": [
          {
            "name": "billing_id",
            "data_type": "VARCHAR(32)",
            "description": "Kode billing MPN G2/G3 perbendaharaan",
            "tags": [
              "PK",
              "Core"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nomor_dokumen_cukai",
            "data_type": "VARCHAR(32)",
            "description": "Nomor dokumen pemesanan pita cukai (CK-1)",
            "tags": [
              "FK"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tanggal_billing",
            "data_type": "TIMESTAMP",
            "description": "Waktu penerbitan billing cukai",
            "tags": [
              "Temporal",
              "PartitionKey"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "npwp_pengusaha_cukai",
            "data_type": "VARCHAR(20)",
            "description": "NPWP pabrik/pengusaha BKC",
            "tags": [
              "FK",
              "PII",
              "Restricted"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nama_pabrik",
            "data_type": "VARCHAR(128)",
            "description": "Nama pabrik / entitas wajib cukai",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "jenis_hasil_tembakau",
            "data_type": "VARCHAR(32)",
            "description": "Kategori komoditas: SKT, SKM, SPM, MMEA, EA",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "jumlah_tarif_spesifik",
            "data_type": "NUMERIC(15,2)",
            "description": "Tarif cukai per batang/liter",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nilai_penerimaan_cukai",
            "data_type": "NUMERIC(20,2)",
            "description": "Total penerimaan cukai disetor (Rupiah)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "status_pelunasan",
            "data_type": "VARCHAR(32)",
            "description": "Status pembayaran: LUNAS, MENUNGGU_BAYAR, KEDALUWARSA",
            "tags": [
              "Dimension",
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 1 - Mission Critical",
        "owner": "Direktorat Teknis dan Fasilitas Cukai",
        "lineage_upstream": [
          "staging_ceisa.stg_billing_cukai",
          "staging_ceisa.stg_pesanan_pita_cukai"
        ],
        "lineage_downstream": [
          "datamart_ceisa.dm_target_realisasi_cukai"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      },
      {
        "fqn": "dwh_ceisa.manifest.fct_manifest_bc11",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "manifest",
        "table_name": "fct_manifest_bc11",
        "description": "Tabel pengawasan sarana pengangkut, manifest inward/outward kapal dan pesawat (BC 1.1).",
        "columns": [
          {
            "name": "nomor_bc11",
            "data_type": "VARCHAR(32)",
            "description": "Nomor registrasi manifest BC 1.1",
            "tags": [
              "PK",
              "Core"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tanggal_bc11",
            "data_type": "TIMESTAMP",
            "description": "Tanggal pendaftaran manifest",
            "tags": [
              "Temporal",
              "PartitionKey"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nomor_pos",
            "data_type": "VARCHAR(16)",
            "description": "Nomor pos manifest kedatangan",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nama_sarana_pengangkut",
            "data_type": "VARCHAR(128)",
            "description": "Nama kapal atau nomor penerbangan pesawat",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nama_nahkoda_pilot",
            "data_type": "VARCHAR(128)",
            "description": "Nama nahkoda atau pilot penanggung jawab",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "pelabuhan_muat",
            "data_type": "VARCHAR(64)",
            "description": "Pelabuhan keberangkatan/asal muat",
            "tags": [
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "pelabuhan_tujuan",
            "data_type": "VARCHAR(64)",
            "description": "Pelabuhan tujuan pembongkaran",
            "tags": [
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "jumlah_kemasan",
            "data_type": "INTEGER",
            "description": "Jumlah koli kemasan barang kargo",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "berat_kotor_kg",
            "data_type": "NUMERIC(15,2)",
            "description": "Berat kotor / gross weight (Kg)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "status_segel",
            "data_type": "VARCHAR(32)",
            "description": "Status segel bea cukai: AMAN, DIPERIKSA, DIBONGKAR",
            "tags": [
              "Dimension",
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 2",
        "owner": "Direktorat Penindakan dan Penyidikan (P2)",
        "lineage_upstream": [
          "staging_ceisa.stg_manifest_inward_outward"
        ],
        "lineage_downstream": [
          "datamart_ceisa.dm_pengawasan_manifest"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      },
      {
        "fqn": "dwh_ceisa.master.dim_perusahaan",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "master",
        "table_name": "dim_perusahaan",
        "description": "Master data profil eksportir, importir, PPJK, dan pengusaha barang kena cukai terdaftar di CEISA & DJP.",
        "columns": [
          {
            "name": "npwp_perusahaan",
            "data_type": "VARCHAR(20)",
            "description": "Nomor Pokok Wajib Pajak 16 digit",
            "tags": [
              "PK",
              "PII",
              "Restricted"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nama_perusahaan",
            "data_type": "VARCHAR(128)",
            "description": "Nama resmi badan hukum perusahaan",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "alamat_domisili",
            "data_type": "VARCHAR(256)",
            "description": "Alamat kantor pusat",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nik_penanggung_jawab",
            "data_type": "VARCHAR(16)",
            "description": "NIK pimpinan/penanggung jawab",
            "tags": [
              "PII",
              "Restricted"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "email_korespondensi",
            "data_type": "VARCHAR(128)",
            "description": "Email resmi perusahaan",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nomor_telepon",
            "data_type": "VARCHAR(32)",
            "description": "Nomor kontak telepon",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "status_registrasi",
            "data_type": "VARCHAR(32)",
            "description": "Status registrasi kepabeanan: AKTIF, BLOKIR, DIBEKUKAN",
            "tags": [
              "Dimension",
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "kategori_layanan_aeo",
            "data_type": "VARCHAR(32)",
            "description": "Kategori fasilitas: AEO, MITA_PRIORITAS, REGULER",
            "tags": [
              "Dimension",
              "Classification"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tanggal_terdaftar",
            "data_type": "DATE",
            "description": "Tanggal perolehan NIB/Akses Kepabeanan",
            "tags": [
              "Temporal"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 1 - Master Data",
        "owner": "Subdit Pengelolaan Data & Layanan Informasi",
        "lineage_upstream": [
          "staging_ceisa.stg_profil_perusahaan_kemenkeu"
        ],
        "lineage_downstream": [
          "dwh_ceisa.ekspor.fct_peb_ekspor",
          "dwh_ceisa.impor.fct_pib_impor",
          "dwh_ceisa.cukai.fct_billing_cukai"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      },
      {
        "fqn": "dwh_ceisa.fasilitas.fct_transactions",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "fasilitas",
        "table_name": "fct_transactions",
        "description": "Tabel fakta transaksi fasilitas kepabeanan (KITE, Kawasan Berikat, Kemudahan Ekspor/Impor) dan transaksi pabean terintegrasi, memuat tarif pembebasan, bea keluar/masuk, devisa, dan kelengkapan dokumen.",
        "columns": [
          {
            "name": "nomor_aju",
            "data_type": "VARCHAR(32)",
            "description": "Nomor Pengajuan 26-digit Dokumen PEB BC 3.0",
            "tags": [
              "PK",
              "Core"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nomor_daftar",
            "data_type": "VARCHAR(16)",
            "description": "Nomor Pendaftaran PEB / Nopen resmi 6 digit",
            "tags": [
              "Core"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tanggal_daftar",
            "data_type": "TIMESTAMP",
            "description": "Tanggal pendaftaran dokumen ekspor PEB",
            "tags": [
              "Temporal",
              "PartitionKey"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "kantor_ekspor",
            "data_type": "VARCHAR(64)",
            "description": "Kantor pabean pendaftaran ekspor (contoh: KPPBC TMP TANJUNG PERAK)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "kantor_muat",
            "data_type": "VARCHAR(64)",
            "description": "Kantor pabean pemuatan barang ekspor",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "npwp_eksportir",
            "data_type": "VARCHAR(20)",
            "description": "NPWP 15/16 digit perusahaan eksportir",
            "tags": [
              "FK",
              "PII",
              "Restricted"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nama_eksportir",
            "data_type": "VARCHAR(128)",
            "description": "Nama entitas badan usaha eksportir",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "alamat_eksportir",
            "data_type": "VARCHAR(256)",
            "description": "Alamat domisili eksportir",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "npwp_ppjk",
            "data_type": "VARCHAR(20)",
            "description": "NPWP Perusahaan Pengurusan Jasa Kepabeanan (PPJK)",
            "tags": [
              "PII",
              "Restricted"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nama_ppjk",
            "data_type": "VARCHAR(128)",
            "description": "Nama entitas PPJK pengurus dokumen",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nama_penerima",
            "data_type": "VARCHAR(128)",
            "description": "Nama entitas penerima barang di luar negeri (Consignee)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "negara_penerima",
            "data_type": "VARCHAR(64)",
            "description": "Negara domisili penerima barang",
            "tags": [
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nama_pembeli",
            "data_type": "VARCHAR(128)",
            "description": "Nama entitas pembeli di luar negeri (Buyer)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "negara_pembeli",
            "data_type": "VARCHAR(64)",
            "description": "Negara domisili pembeli",
            "tags": [
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "negara_tujuan",
            "data_type": "VARCHAR(64)",
            "description": "Negara tujuan akhir ekspor barang",
            "tags": [
              "Dimension",
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "seri_barang",
            "data_type": "INTEGER",
            "description": "Nomor urut seri barang ekspor dalam PEB",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "kode_hs",
            "data_type": "VARCHAR(16)",
            "description": "Klasifikasi pos tarif 8/10 digit HS Code (contoh: 7112999000)",
            "tags": [
              "Dimension",
              "Classification"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "uraian_barang",
            "data_type": "VARCHAR(500)",
            "description": "Uraian jenis dan spesifikasi komoditas barang ekspor",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "jumlah_satuan",
            "data_type": "NUMERIC(18,4)",
            "description": "Jumlah kuantitas barang ekspor",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "jenis_satuan",
            "data_type": "VARCHAR(16)",
            "description": "Satuan barang (KGM, PCS, TNE, dsb.)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "netto_barang",
            "data_type": "NUMERIC(18,4)",
            "description": "Berat bersih (Net Weight) barang (Kg)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "valuta",
            "data_type": "VARCHAR(8)",
            "description": "Kode valuta transaksi (USD, IDR, JPY, EUR)",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "kurs",
            "data_type": "NUMERIC(18,4)",
            "description": "Nilai kurs Keputusan Menteri Keuangan (KMK)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "fob_barang",
            "data_type": "NUMERIC(18,2)",
            "description": "Nilai Free On Board (FOB) barang dalam valuta",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tarif_bea_keluar",
            "data_type": "NUMERIC(8,4)",
            "description": "Tarif pungutan Bea Keluar ekspor (Advalorem % atau spesifik)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "bea_keluar_barang",
            "data_type": "NUMERIC(18,2)",
            "description": "Nominal pungutan Bea Keluar ekspor barang (Rupiah)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "pph_ekspor_peb",
            "data_type": "NUMERIC(18,2)",
            "description": "Pajak Penghasilan (PPh Pasal 22) Ekspor (Rupiah)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "jalur",
            "data_type": "VARCHAR(8)",
            "description": "Jalur pelayanan pabean: H (Hijau), K (Kuning), M (Merah)",
            "tags": [
              "Dimension",
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "status_pabean",
            "data_type": "VARCHAR(32)",
            "description": "Status persetujuan pabean: NPE, PERIKSA_FISIK, REVISI, BATAL",
            "tags": [
              "Dimension",
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "transaction_id",
            "data_type": "VARCHAR(64)",
            "description": "Alias ID transaksi unik (sesuai nomor_aju)",
            "tags": [
              "PK",
              "Core"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "customer_id",
            "data_type": "VARCHAR(32)",
            "description": "Alias ID entitas (sesuai npwp_eksportir)",
            "tags": [
              "FK"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "transaction_date",
            "data_type": "TIMESTAMP",
            "description": "Alias waktu transaksi (sesuai tanggal_daftar)",
            "tags": [
              "Temporal"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "total_amount",
            "data_type": "NUMERIC(18,2)",
            "description": "Alias total nilai transaksi (sesuai fob_barang / devisa)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "status",
            "data_type": "VARCHAR(32)",
            "description": "Alias status dokumen transaksi (sesuai status_pabean)",
            "tags": [
              "Dimension",
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "created_at",
            "data_type": "TIMESTAMP",
            "description": "Waktu record dibuat di DWH",
            "tags": [
              "System"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 1 - Mission Critical",
        "owner": "Direktorat Fasilitas Kepabeanan",
        "lineage_upstream": [
          "staging_ceisa.stg_peb_header",
          "staging_ceisa.stg_peb_barang",
          "staging_ceisa.stg_fasilitas_kite"
        ],
        "lineage_downstream": [
          "datamart_ceisa.dm_kinerja_ekspor_bulanan",
          "datamart_ceisa.dm_fasilitas_tpb"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      },
      {
        "fqn": "dwh_ceisa.ekspor.dim_dokumen_pelengkap",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "ekspor",
        "table_name": "dim_dokumen_pelengkap",
        "description": "Tabel dokumen pelengkap pabean ekspor BC 3.0 (Invoice, Packing List, Certificate of Origin / COO, Bill of Lading, L/C).",
        "columns": [
          {
            "name": "nomor_aju",
            "data_type": "VARCHAR(32)",
            "description": "Nomor Pengajuan 26-digit Dokumen PEB (FK)",
            "tags": [
              "PK",
              "FK"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nomor_peb",
            "data_type": "VARCHAR(16)",
            "description": "Nomor Pendaftaran PEB (Nopen)",
            "tags": [
              "FK"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tanggal_peb",
            "data_type": "TIMESTAMP",
            "description": "Tanggal Pendaftaran PEB",
            "tags": [
              "Temporal"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nama_dokumen",
            "data_type": "VARCHAR(64)",
            "description": "Jenis Dokumen Pelengkap: INVOICE, PACKING LIST, COO, BL",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "nomor_dokumen",
            "data_type": "VARCHAR(128)",
            "description": "Nomor resmi dokumen pelengkap",
            "tags": [
              "Core"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tanggal_dokumen",
            "data_type": "DATE",
            "description": "Tanggal penerbitan dokumen pelengkap",
            "tags": [
              "Temporal"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 2",
        "owner": "Direktorat Teknis Kepabeanan",
        "lineage_upstream": [
          "staging_ceisa.stg_dokumen_pelengkap"
        ],
        "lineage_downstream": [
          "dwh_ceisa.ekspor.fct_peb_ekspor",
          "dwh_ceisa.fasilitas.fct_transactions"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      },
      {
        "fqn": "dwh_ceisa.fasilitas.dim_customers",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "fasilitas",
        "table_name": "dim_customers",
        "description": "Master data profil perusahaan penerima fasilitas kepabeanan, importir produsen KITE/TPB, dan segmentasi kepatuhan.",
        "columns": [
          {
            "name": "customer_id",
            "data_type": "VARCHAR(32)",
            "description": "Primary key unik nasabah/perusahaan",
            "tags": [
              "PK"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "customer_name",
            "data_type": "VARCHAR(128)",
            "description": "Nama lengkap badan usaha/nasabah",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "email",
            "data_type": "VARCHAR(128)",
            "description": "Alamat email aktif perusahaan",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "phone_number",
            "data_type": "VARCHAR(32)",
            "description": "Nomor handphone/kontak terdaftar",
            "tags": [
              "PII"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "nik",
            "data_type": "VARCHAR(16)",
            "description": "Nomor Induk Kependudukan (16 digit)",
            "tags": [
              "PII",
              "Restricted"
            ],
            "is_pii": true,
            "glossary_terms": []
          },
          {
            "name": "customer_segment",
            "data_type": "VARCHAR(32)",
            "description": "Segmen fasilitas: PRIORITAS, KITE_INDUSTRI, TPB_BERIKAT, REGULER",
            "tags": [
              "Dimension",
              "Segmentation"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "city",
            "data_type": "VARCHAR(64)",
            "description": "Kota domisili perusahaan",
            "tags": [
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "province",
            "data_type": "VARCHAR(64)",
            "description": "Provinsi domisili perusahaan",
            "tags": [
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "registration_date",
            "data_type": "DATE",
            "description": "Tanggal pertama kali terdaftar fasilitas",
            "tags": [
              "Temporal"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "is_active",
            "data_type": "BOOLEAN",
            "description": "Status keaktifan fasilitas akun (TRUE/FALSE)",
            "tags": [
              "Flag"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 1",
        "owner": "Direktorat Fasilitas Kepabeanan",
        "lineage_upstream": [
          "staging_ceisa.stg_profil_perusahaan_kemenkeu"
        ],
        "lineage_downstream": [
          "dwh_ceisa.fasilitas.fct_transactions"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      },
      {
        "fqn": "dwh_ceisa.fasilitas.dim_stores",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "fasilitas",
        "table_name": "dim_stores",
        "description": "Tabel dimensi kantor wilayah pengawas fasilitas, lokasi gudang berikat/kawasan industri, dan tipe tempat penimbunan berikat (TPB).",
        "columns": [
          {
            "name": "store_id",
            "data_type": "VARCHAR(32)",
            "description": "Kode unik pos/lokasi fasilitas",
            "tags": [
              "PK"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "store_name",
            "data_type": "VARCHAR(128)",
            "description": "Nama kawasan berikat / unit pengawas",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "region",
            "data_type": "VARCHAR(64)",
            "description": "Wilayah: Jabodetabek, Jawa Barat, Jawa Tengah, Jawa Timur, Luar Jawa",
            "tags": [
              "Geography"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "store_type",
            "data_type": "VARCHAR(32)",
            "description": "Tipe fasilitas: Kawasan Berikat, Gudang Berikat, KITE, Pusat Logistik Berikat",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "manager_name",
            "data_type": "VARCHAR(64)",
            "description": "Nama kepala seksi / penanggung jawab pengawas",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 2",
        "owner": "Direktorat Fasilitas Kepabeanan",
        "lineage_upstream": [
          "staging_ceisa.stg_lokasi_tpb"
        ],
        "lineage_downstream": [
          "dwh_ceisa.fasilitas.fct_transactions"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      },
      {
        "fqn": "dwh_ceisa.keberatan.fct_shipments",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "keberatan",
        "table_name": "fct_shipments",
        "description": "Tabel pelacakan berkas perkara permohonan keberatan penetapan bea masuk/keluar, sanksi administrasi, pengiriman dokumen keputusan, dan proses banding Pengadilan Pajak.",
        "columns": [
          {
            "name": "shipment_id",
            "data_type": "VARCHAR(64)",
            "description": "Nomor resi/berkas perkara unik",
            "tags": [
              "PK"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "transaction_id",
            "data_type": "VARCHAR(64)",
            "description": "Foreign key dokumen pabean terkait",
            "tags": [
              "FK"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "courier_name",
            "data_type": "VARCHAR(32)",
            "description": "Nama ekspedisi/kurir kedinasan dokumen",
            "tags": [
              "Dimension"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "delivery_status",
            "data_type": "VARCHAR(32)",
            "description": "Status kirim/sidang: DELIVERED, IN_TRANSIT, FAILED, SIDANG_BANDING",
            "tags": [
              "Dimension",
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "shipping_cost",
            "data_type": "NUMERIC(10,2)",
            "description": "Biaya penanganan administrasi (IDR)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "dispatch_date",
            "data_type": "TIMESTAMP",
            "description": "Waktu dokumen dikirimkan ke pemohon",
            "tags": [
              "Temporal"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "received_date",
            "data_type": "TIMESTAMP",
            "description": "Waktu tanda terima keputusan oleh pemohon",
            "tags": [
              "Temporal"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 2",
        "owner": "Direktorat Keberatan Banding dan Peraturan",
        "lineage_upstream": [
          "staging_ceisa.stg_permohonan_keberatan"
        ],
        "lineage_downstream": [
          "datamart_ceisa.dm_kinerja_keberatan_banding"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      },
      {
        "fqn": "dwh_ceisa.penerimaan.fct_credit_applications",
        "service_name": "CEISA40-PostgreSQL-DWH",
        "database_name": "dwh_ceisa",
        "schema_name": "penerimaan",
        "table_name": "fct_credit_applications",
        "description": "Tabel fakta monitoring target dan realisasi penerimaan negara (Bea Masuk, Bea Keluar, Cukai, dan Pajak Dalam Rangka Impor/PDRI), penetapan piutang, dan evaluasi kepatuhan fiskal.",
        "columns": [
          {
            "name": "application_id",
            "data_type": "VARCHAR(64)",
            "description": "ID pengajuan penetapan piutang/anggaran",
            "tags": [
              "PK"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "customer_id",
            "data_type": "VARCHAR(32)",
            "description": "Foreign key wajib pajak/wajib bayar",
            "tags": [
              "FK"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "loan_amount",
            "data_type": "NUMERIC(15,2)",
            "description": "Nominal target/ketetapan penerimaan (IDR)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "tenor_months",
            "data_type": "INTEGER",
            "description": "Jangka waktu pelunasan (bulan)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "approval_status",
            "data_type": "VARCHAR(32)",
            "description": "Status: APPROVED, REJECTED, IN_REVIEW, LUNAS",
            "tags": [
              "Filter"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "application_date",
            "data_type": "TIMESTAMP",
            "description": "Waktu ketetapan diterbitkan",
            "tags": [
              "Temporal"
            ],
            "is_pii": false,
            "glossary_terms": []
          },
          {
            "name": "credit_score",
            "data_type": "INTEGER",
            "description": "Skor profil risiko kepatuhan fiskal (300-850)",
            "tags": [
              "Metric"
            ],
            "is_pii": false,
            "glossary_terms": []
          }
        ],
        "tier": "Tier 1",
        "owner": "Direktorat Penerimaan dan Perencanaan Strategis",
        "lineage_upstream": [
          "staging_ceisa.stg_billing_mpn_penerimaan"
        ],
        "lineage_downstream": [
          "datamart_ceisa.dm_realisasi_penerimaan_fiskal"
        ],
        "match_score": 0.0,
        "match_rationale": ""
      }
    ]
  },
  "history": [
    {
      "id": "REQ-1791731466",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 22:11:06",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 119.1,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "f8c5fd6a16cf5bdfe120d2d4f044c10df37e093ce7dfd30651ce041fb816166f",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_221106.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_221106.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791731466",
      "request_id": "REQ-2026-KMK-114",
      "document_title": "FORMULIR PERMOHONAN REKONSILIASI DATA TRANSAKSI PENERIMAAN NEGARA",
      "requester_name": "Siti Sarah, S.T.",
      "department": "Internal Kemenkeu",
      "business_process": "Penerimaan",
      "created_at": "2026-10-11 22:11:06",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 92.5,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "cccc228d088f9d4ab571f032e489e06182efd62470796942a949ef04c7ae031b",
      "excel_filename": "DataExport_REQ_2026_KMK_114_20261011_221106.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_KMK_114_20261011_221106.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791731466",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-11 22:11:06",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 155.6,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "a055d33cceb447143bec638e6c12f91713aed0dbfd2bc0e41ace9a03bb213cab",
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_221106.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_221106.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791731033",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 22:03:53",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 102.2,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "c86347de26b8911f99e38b9607b07b24582e3cedec0338aeb7b5c82d56f3cc82",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_220353.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_220353.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791730521",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 21:55:21",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 106.9,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "3eb4ee3432cb96dee5a3bfac620f6788bba1f452ffb65e62c0e5a54512f14085",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_215521.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_215521.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791730095",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 21:48:15",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 106.4,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "18258293e92ff91357ffca33e1ea266c7dd0fb96c17b8c9fe1020007425506c8",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_214815.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_214815.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791729404",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 21:36:44",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 104.0,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "ff15bc0c76430dbd8907899561c2ebe3327c44b52136d727324563a9e895c2a3",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_213644.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_213644.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791728945",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-11 21:29:05",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 133.9,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "a860c27bb2d15c84485e9ae6d5ecc98344c02edbe1ae42f11746a94486248fe1",
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_212905.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_212905.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791728686",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-11 21:24:46",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 160.4,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "b9bc5954bbee7e0dfeae4653c6c5357ff1f79f79b893a99c9a4c65d9852780eb",
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_212446.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_212446.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791725450",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-11 20:30:00",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 32.0,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "76b896847890575d61b24904506d27160a4c0f1026391ae28843e11d33956fe7",
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_203050.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_203050.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791724338",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-11 18:23:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_201218.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_201218.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 33.8
    },
    {
      "id": "REQ-1791724231",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-11 16:16:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_201030.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_201030.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 35.6
    },
    {
      "id": "REQ-1791723328",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Impor",
      "created_at": "2026-10-11 14:09:00",
      "status": "MEMBUTUHKAN_REVISI",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_195528.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_195528.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 37.4
    },
    {
      "id": "REQ-1791723247",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-11 12:02:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_195407.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_195407.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 39.2
    },
    {
      "id": "REQ-1791722983",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Cukai",
      "created_at": "2026-10-11 09:55:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_194943.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_194943.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 41.0
    },
    {
      "id": "REQ-1791722870",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-11 07:48:00",
      "status": "REJECTED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_194750.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_194750.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 42.8
    },
    {
      "id": "REQ-1791722777",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Manifest",
      "created_at": "2026-10-11 05:41:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_194617.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_194617.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 44.6
    },
    {
      "id": "REQ-1791721953",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-10 19:34:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_193233.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_193233.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 46.4
    },
    {
      "id": "REQ-1791721792",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Impor",
      "created_at": "2026-10-10 18:27:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_192952.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_192952.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 48.2
    },
    {
      "id": "REQ-1791720287",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-09 16:20:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_190447.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_190447.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 50.0
    },
    {
      "id": "REQ-1791720200",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-09 14:13:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_190319.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_190319.zip",
      "reviewer_name": "Hendra Gunawan, S.Kom",
      "comments": "Disetujui penuh untuk analisis internal.",
      "reviewer_role": "Kepala Seksi Analisa dan Layanan Data",
      "signed_at": "2026-10-11 19:03:20",
      "execution_time_ms": 51.8
    },
    {
      "id": "REQ-1791720191",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Cukai",
      "created_at": "2026-10-08 12:06:00",
      "status": "MEMBUTUHKAN_REVISI",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_190311.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_190311.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 53.6
    },
    {
      "id": "REQ-1791719429",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-08 09:59:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_185029.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_185029.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 55.4
    },
    {
      "id": "REQ-1791719288",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-08 07:52:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_184808.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_184808.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 57.2
    },
    {
      "id": "REQ-1791719238",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Impor",
      "created_at": "2026-10-07 05:45:00",
      "status": "REJECTED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_184718.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_184718.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 32.0
    },
    {
      "id": "REQ-1791718405",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-07 19:38:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_183325.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_183325.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 33.8
    },
    {
      "id": "REQ-1791718152",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Manifest",
      "created_at": "2026-10-06 17:31:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_182912.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_182912.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 35.6
    },
    {
      "id": "REQ-1791717971",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-06 16:24:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_182611.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_182611.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 37.4
    },
    {
      "id": "REQ-1791717482",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-05 14:17:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_181802.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_181802.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 39.2
    },
    {
      "id": "REQ-1791717288",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Impor",
      "created_at": "2026-10-05 12:10:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_181448.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_181448.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 41.0
    },
    {
      "id": "REQ-1791717264",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-05 10:03:00",
      "status": "MEMBUTUHKAN_REVISI",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_181424.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_181424.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 42.8
    },
    {
      "id": "REQ-1791716663",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-03 07:56:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_180422.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_180422.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 44.6
    },
    {
      "id": "REQ-1791716067",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "created_at": "2026-10-02 05:49:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_175427.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_175427.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 46.4
    },
    {
      "id": "REQ-1791716067",
      "request_id": "REQ-2026-KMK-114",
      "document_title": "FORMULIR PERMOHONAN REKONSILIASI DATA TRANSAKSI PENERIMAAN NEGARA",
      "requester_name": "Siti Sarah, S.T.",
      "department": "Internal Kemenkeu",
      "created_at": "2026-09-30 19:42:00",
      "status": "REJECTED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_KMK_114_20261011_175427.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_KMK_114_20261011_175427.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 48.2
    },
    {
      "id": "REQ-1791716067",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "created_at": "2026-09-29 17:35:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_175427.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_175427.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 50.0
    },
    {
      "id": "REQ-1791715568",
      "request_id": "REQ-2026-LOG-114",
      "document_title": "FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI",
      "requester_name": "Siti Sarah, S.T.",
      "department": "Internal Kemenkeu",
      "created_at": "2026-09-27 16:28:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_LOG_114_20261011_174607.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_LOG_114_20261011_174607.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 51.8
    },
    {
      "id": "REQ-1791715144",
      "request_id": "REQ-2026-LOG-114",
      "document_title": "FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI",
      "requester_name": "Siti Sarah, S.T.",
      "department": "Internal Kemenkeu",
      "created_at": "2026-09-26 14:21:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_LOG_114_20261011_173904.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_LOG_114_20261011_173904.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 53.6
    },
    {
      "id": "REQ-1791714432",
      "request_id": "REQ-2026-BDN-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "created_at": "2026-09-24 12:14:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BDN_089_20261011_172712.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BDN_089_20261011_172712.zip",
      "reviewer_name": "Hendra Gunawan, S.Kom",
      "comments": "Disetujui untuk analisis retensi nasabah Q3. Dilarang mendistribusikan ke pihak ketiga.",
      "reviewer_role": "Head of Data Governance & Compliance",
      "signed_at": "2026-10-11 17:27:12",
      "execution_time_ms": 55.4
    },
    {
      "id": "REQ-1791713535",
      "request_id": "REQ-2026-LOG-114",
      "document_title": "FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI",
      "requester_name": "Siti Sarah, S.T.",
      "department": "Internal Kemenkeu",
      "created_at": "2026-09-22 10:07:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_LOG_114_20261011_171215.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_LOG_114_20261011_171215.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 57.2
    },
    {
      "id": "REQ-1791712780",
      "request_id": "REQ-2026-LOG-114",
      "document_title": "FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI",
      "requester_name": "Siti Sarah, S.T.",
      "department": "Internal Kemenkeu",
      "created_at": "2026-09-20 08:00:00",
      "status": "MEMBUTUHKAN_REVISI",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_LOG_114_20261011_165940.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_LOG_114_20261011_165940.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 32.0
    },
    {
      "id": "REQ-1791701430",
      "request_id": "REQ-2026-BDN-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "created_at": "2026-09-18 05:53:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BDN_089_20261011_135030.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BDN_089_20261011_135030.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 33.8
    },
    {
      "id": "REQ-1791701378",
      "request_id": "REQ-2026-BDN-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "created_at": "2026-09-16 19:46:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BDN_089_20261011_134938.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BDN_089_20261011_134938.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 35.6
    },
    {
      "id": "REQ-1791701272",
      "request_id": "REQ-2026-BDN-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "created_at": "2026-09-15 17:39:00",
      "status": "REJECTED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BDN_089_20261011_134752.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BDN_089_20261011_134752.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 37.4
    },
    {
      "id": "REQ-1791700527",
      "request_id": "REQ-2026-LOG-114",
      "document_title": "FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI",
      "requester_name": "Siti Sarah, S.T.",
      "department": "Internal Kemenkeu",
      "created_at": "2026-09-13 15:32:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_LOG_114_20261011_133527.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_LOG_114_20261011_133527.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 39.2
    },
    {
      "id": "REQ-1791698028",
      "request_id": "REQ-2026-BDN-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "created_at": "2026-09-12 14:25:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BDN_089_20261011_125348.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BDN_089_20261011_125348.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 41.0
    },
    {
      "id": "REQ-1791698008",
      "request_id": "REQ-2026-BDN-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "created_at": "2026-09-09 12:18:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BDN_089_20261011_125328.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BDN_089_20261011_125328.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 42.8
    },
    {
      "id": "REQ-1791697758",
      "request_id": "REQ-2026-LOG-114",
      "document_title": "FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI",
      "requester_name": "Siti Sarah, S.T.",
      "department": "Internal Kemenkeu",
      "created_at": "2026-09-06 10:11:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_LOG_114_20261011_124918.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_LOG_114_20261011_124918.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 44.6
    },
    {
      "id": "REQ-1791697311",
      "request_id": "REQ-F02F-SCAN",
      "document_title": "Permohonan Scan Fisik",
      "requester_name": "Data Requester (Pemohon Dokumen Fisik/Scan)",
      "department": "Eksternal Kemenkeu",
      "created_at": "2026-09-03 08:04:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_F02F_SCAN_20261011_124151.xlsx",
      "zip_filename": "DataFulfillment_REQ_F02F_SCAN_20261011_124151.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 46.4
    },
    {
      "id": "REQ-1791697275",
      "request_id": "REQ-2026-BDN-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "created_at": "2026-09-01 05:57:00",
      "status": "MEMBUTUHKAN_REVISI",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BDN_089_20261011_124115.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BDN_089_20261011_124115.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 48.2
    },
    {
      "id": "REQ-1791697270",
      "request_id": "REQ-2026-BDN-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "created_at": "2026-08-30 19:50:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_REQ_2026_BDN_089_20261011_124110.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BDN_089_20261011_124110.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 50.0
    },
    {
      "id": "REQ-1791695751",
      "request_id": "Permohonan",
      "document_title": "FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI",
      "requester_name": "(PIC)",
      "department": "Internal Kemenkeu",
      "created_at": "2026-08-27 17:43:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_Permohonan_20261011_121550.xlsx",
      "zip_filename": "DataFulfillment_Permohonan_20261011_121550.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 51.8
    },
    {
      "id": "REQ-1791695549",
      "request_id": "Permohonan",
      "document_title": "FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI",
      "requester_name": "(PIC)",
      "department": "Internal Kemenkeu",
      "created_at": "2026-08-24 15:36:00",
      "status": "REJECTED",
      "row_count": 35,
      "excel_filename": "DataExport_Permohonan_20261011_121229.xlsx",
      "zip_filename": "DataFulfillment_Permohonan_20261011_121229.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 53.6
    },
    {
      "id": "REQ-1791695544",
      "request_id": "Permohonan",
      "document_title": "FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI",
      "requester_name": "(PIC)",
      "department": "Internal Kemenkeu",
      "created_at": "2026-08-22 14:29:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_Permohonan_20261011_121224.xlsx",
      "zip_filename": "DataFulfillment_Permohonan_20261011_121224.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 55.4
    },
    {
      "id": "REQ-1791695528",
      "request_id": "Permohonan",
      "document_title": "FORMULIR PERMOHONAN DATA PENGIRIMAN & EKSPEDISI",
      "requester_name": "(PIC)",
      "department": "Internal Kemenkeu",
      "created_at": "2026-08-18 12:22:00",
      "status": "APPROVED",
      "row_count": 35,
      "excel_filename": "DataExport_Permohonan_20261011_121208.xlsx",
      "zip_filename": "DataFulfillment_Permohonan_20261011_121208.zip",
      "reviewer_name": null,
      "comments": "Menunggu review verifikator",
      "execution_time_ms": 57.2
    }
  ],
  "analytics": {
    "total_requests": 54,
    "approved_count": 44,
    "revision_count": 5,
    "rejected_count": 5,
    "compliance_rate_pct": 81.5,
    "total_rows_delivered": 1890,
    "avg_latency_ms": 57.2,
    "digital_seal_count": 44,
    "digital_seal_pct": 81.5,
    "pii_columns_protected_count": 324,
    "pii_breakdown": {
      "npwp_masked": 108,
      "nik_masked": 54,
      "nama_masked": 108,
      "phone_masked": 54
    },
    "pdp_compliance_pct": 100.0,
    "department_distribution": {
      "Internal Bea dan Cukai": 35,
      "Internal Kemenkeu": 12,
      "Eksternal Kemenkeu": 7
    },
    "status_distribution": {
      "Disetujui Resmi": 44,
      "Membutuhkan Revisi": 5,
      "Ditolak / Disangkal": 5
    },
    "business_process_distribution": {
      "Ekspor (PEB BC 3.0)": 46,
      "Impor (PIB BC 2.0)": 4,
      "Cukai (BKC)": 2,
      "Manifest (BC 1.1)": 2,
      "TPB / Fasilitas Berikat": 0
    },
    "dialect_distribution": {
      "PostgreSQL": 54,
      "Oracle": 0,
      "SQLite": 0
    },
    "timeline_trends": [
      {
        "date": "2026-10-05",
        "total": 3,
        "approved": 2,
        "rows": 105
      },
      {
        "date": "2026-10-06",
        "total": 2,
        "approved": 2,
        "rows": 70
      },
      {
        "date": "2026-10-07",
        "total": 2,
        "approved": 1,
        "rows": 70
      },
      {
        "date": "2026-10-08",
        "total": 3,
        "approved": 2,
        "rows": 105
      },
      {
        "date": "2026-10-09",
        "total": 2,
        "approved": 2,
        "rows": 70
      },
      {
        "date": "2026-10-10",
        "total": 2,
        "approved": 2,
        "rows": 70
      },
      {
        "date": "2026-10-11",
        "total": 17,
        "approved": 15,
        "rows": 595
      }
    ],
    "period": "all",
    "comparison_label": "vs Periode Historis Sebelumnya",
    "deltas": {
      "total_requests": {
        "value": 100.0,
        "formatted": "+100.0%",
        "direction": "up"
      },
      "compliance_rate": {
        "value": 3.7,
        "formatted": "+3.7%",
        "direction": "up"
      },
      "total_rows": {
        "value": 100.0,
        "formatted": "+100.0%",
        "direction": "up"
      },
      "pii_protected": {
        "value": 100.0,
        "formatted": "+100.0%",
        "direction": "up"
      },
      "avg_latency": {
        "value": 24.9,
        "formatted": "+24.9%",
        "direction": "up"
      },
      "digital_seal": {
        "value": 3.7,
        "formatted": "+3.7%",
        "direction": "up"
      }
    }
  },
  "pipeline_results": {
    "Permohonan_Data_Internal_Bea_dan_Cukai.pdf": {
      "success": true,
      "message": "Pemenuhan permohonan data berhasil diproses.",
      "spec": {
        "request_id": "REQ-2026-BC-089",
        "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
        "requester_name": "Ahmad Fauzi, S.Kom",
        "requester_department": "Internal Bea dan Cukai",
        "business_process": "Ekspor",
        "request_date": "10 Oktober 2026",
        "business_purpose": "Data",
        "primary_entity": "ekspor",
        "time_range_start": "01 Juli 2026",
        "time_range_end": "30 September 2026",
        "requested_fields": [
          {
            "name": "transaction_id",
            "description": "ID Transaksi",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          },
          {
            "name": "transaction_date",
            "description": "Tanggal Transaksi",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          },
          {
            "name": "customer_name",
            "description": "Nama Nasabah",
            "business_term": null,
            "pii_sensitive": true,
            "masking_rule": "MASK_PARTIAL"
          },
          {
            "name": "phone_number",
            "description": "Nomor HP",
            "business_term": null,
            "pii_sensitive": true,
            "masking_rule": "MASK_PARTIAL"
          },
          {
            "name": "nik",
            "description": "NIK",
            "business_term": null,
            "pii_sensitive": true,
            "masking_rule": "MASK_PARTIAL"
          },
          {
            "name": "city",
            "description": "Kota",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          },
          {
            "name": "total_amount",
            "description": "Total Nominal",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          },
          {
            "name": "status",
            "description": "Status",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          }
        ],
        "filters": [
          {
            "field_description": "Status persetujuan pabean",
            "target_column": "status_pabean",
            "operator": "=",
            "value": "NPE",
            "rationale": "Dokumen ekspor yang selesai dan disetujui berstatus resmi NPE (Nota Pelayanan Ekspor)."
          },
          {
            "field_description": "Segmentasi nasabah",
            "target_column": "customer_segment",
            "operator": "=",
            "value": "PRIORITAS",
            "rationale": "Kebutuhan analisis fokus pada segmen nasabah prioritas."
          },
          {
            "field_description": "Periode Transaksi",
            "target_column": "transaction_date",
            "operator": "BETWEEN",
            "value": [
              "01 Juli 2026",
              "30 September 2026"
            ],
            "rationale": "Filter rentang waktu 01 Juli 2026 s/d 30 September 2026"
          }
        ],
        "aggregation_level": "detail",
        "compliance_notes": "Data bersifat internal rahasia. Kolom PII (Nama, NIK, No HP) wajib dimasking untuk kepatuhan PDP/GDPR.",
        "raw_text_summary": "KEMENTERIAN KEUANGAN REPUBLIK INDONESIA\n DIREKTORAT JENDERAL BEA DAN CUKAI\n FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN\nNomor Permohonan\n: REQ-2026-BC-089\nTanggal Pengajuan\n: 10 Oktober 2026\nNama Pemohon (PIC)\n: Ahmad Fauzi, S.Kom\nUnit Kerja / Divisi\n: Internal Bea dan Cukai\nSub-Unit / Direktorat\n: Direktorat Penindakan dan Penyidikan (P2)\nTipe Proses Bisnis\n: Ekspor\nTujuan Penggun..."
      },
      "catalog_match": {
        "selected_tables": [
          {
            "fqn": "dwh_ceisa.ekspor.fct_peb_ekspor",
            "service_name": "CEISA40-PostgreSQL-DWH",
            "database_name": "dwh_ceisa",
            "schema_name": "ekspor",
            "table_name": "fct_peb_ekspor",
            "description": "Tabel fakta transaksi ekspor barang, devisa hasil ekspor, dan dokumen PEB (Pemberitahuan Ekspor Barang BC 3.0).",
            "columns": [
              {
                "name": "nomor_aju",
                "data_type": "VARCHAR(32)",
                "description": "Nomor Pengajuan 26-digit Dokumen PEB BC 3.0",
                "tags": [
                  "PK",
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nomor_daftar",
                "data_type": "VARCHAR(16)",
                "description": "Nomor Pendaftaran PEB / Nopen 6 digit",
                "tags": [
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nomor_peb",
                "data_type": "VARCHAR(32)",
                "description": "Nomor Pendaftaran PEB (nopen)",
                "tags": [
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tanggal_daftar",
                "data_type": "TIMESTAMP",
                "description": "Tanggal pendaftaran dokumen ekspor PEB",
                "tags": [
                  "Temporal",
                  "PartitionKey"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tanggal_peb",
                "data_type": "TIMESTAMP",
                "description": "Tanggal pendaftaran dokumen ekspor",
                "tags": [
                  "Temporal"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kantor_ekspor",
                "data_type": "VARCHAR(64)",
                "description": "Kantor pabean pendaftaran ekspor (contoh: KPPBC TMP TANJUNG PERAK)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kantor_muat",
                "data_type": "VARCHAR(64)",
                "description": "Kantor pabean pemuatan barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kode_kantor",
                "data_type": "VARCHAR(8)",
                "description": "Kode kantor pabean pemuatan (contoh: 040300 - Tanjung Priok)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "npwp_eksportir",
                "data_type": "VARCHAR(20)",
                "description": "NPWP 15/16 digit perusahaan eksportir",
                "tags": [
                  "FK",
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_eksportir",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas badan usaha eksportir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "alamat_eksportir",
                "data_type": "VARCHAR(256)",
                "description": "Alamat domisili eksportir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "npwp_ppjk",
                "data_type": "VARCHAR(20)",
                "description": "NPWP Perusahaan Pengurusan Jasa Kepabeanan",
                "tags": [
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_ppjk",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas PPJK pengurus dokumen",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_penerima",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas penerima barang di luar negeri (Consignee)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_penerima",
                "data_type": "VARCHAR(64)",
                "description": "Negara domisili penerima barang",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nama_pembeli",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas pembeli di luar negeri (Buyer)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_pembeli",
                "data_type": "VARCHAR(64)",
                "description": "Negara domisili pembeli",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_tujuan",
                "data_type": "VARCHAR(64)",
                "description": "Negara tujuan akhir ekspor barang",
                "tags": [
                  "Dimension",
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "seri_barang",
                "data_type": "INTEGER",
                "description": "Nomor urut seri barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kode_hs",
                "data_type": "VARCHAR(16)",
                "description": "Klasifikasi pos tarif 8/10 digit HS Code (contoh: 7112999000)",
                "tags": [
                  "Dimension",
                  "Classification"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "uraian_barang",
                "data_type": "VARCHAR(500)",
                "description": "Uraian jenis dan spesifikasi komoditas barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jumlah_satuan",
                "data_type": "NUMERIC(18,4)",
                "description": "Jumlah kuantitas barang ekspor",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jenis_satuan",
                "data_type": "VARCHAR(16)",
                "description": "Satuan barang (KGM, PCS, TNE, dsb.)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "netto_barang",
                "data_type": "NUMERIC(18,4)",
                "description": "Berat bersih (Net Weight) barang (Kg)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "valuta",
                "data_type": "VARCHAR(8)",
                "description": "Kode valuta transaksi (USD, IDR, JPY, EUR)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kurs",
                "data_type": "NUMERIC(18,4)",
                "description": "Nilai kurs Keputusan Menteri Keuangan (KMK)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "fob_barang",
                "data_type": "NUMERIC(18,2)",
                "description": "Nilai Free On Board (FOB) barang dalam valuta",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nilai_fob_usd",
                "data_type": "NUMERIC(18,2)",
                "description": "Nilai Free on Board dalam valuta USD",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nilai_devisa_idr",
                "data_type": "NUMERIC(20,2)",
                "description": "Nilai devisa hasil ekspor ekuivalen Rupiah",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tarif_bea_keluar",
                "data_type": "NUMERIC(8,4)",
                "description": "Tarif pungutan Bea Keluar ekspor (Advalorem % atau spesifik)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "bea_keluar_barang",
                "data_type": "NUMERIC(18,2)",
                "description": "Nominal pungutan Bea Keluar ekspor barang (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "pph_ekspor_peb",
                "data_type": "NUMERIC(18,2)",
                "description": "Pajak Penghasilan (PPh Pasal 22) Ekspor (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jalur",
                "data_type": "VARCHAR(8)",
                "description": "Jalur pelayanan pabean: H (Hijau), K (Kuning), M (Merah)",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "status_pabean",
                "data_type": "VARCHAR(32)",
                "description": "Status persetujuan pabean: NPE, PERIKSA_FISIK, REVISI, BATAL",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "created_at",
                "data_type": "TIMESTAMP",
                "description": "Waktu data tersinkronisasi ke DWH CEISA",
                "tags": [
                  "System"
                ],
                "is_pii": false,
                "glossary_terms": []
              }
            ],
            "tier": "Tier 1 - Mission Critical",
            "owner": "Direktorat Teknis Kepabeanan & Subdit Ekspor",
            "lineage_upstream": [
              "staging_ceisa.stg_peb_header",
              "staging_ceisa.stg_nopen_online"
            ],
            "lineage_downstream": [
              "datamart_ceisa.dm_kinerja_ekspor_bulanan",
              "datamart_ceisa.dm_devisa_ekspor"
            ],
            "match_score": 1.0,
            "match_rationale": "Kesesuaian domain entitas permohonan: 'ekspor'; Cocok pada deskripsi tabel: 'ekspor'; Kolom mendukung entitas: 'ekspor'"
          },
          {
            "fqn": "dwh_ceisa.fasilitas.fct_transactions",
            "service_name": "CEISA40-PostgreSQL-DWH",
            "database_name": "dwh_ceisa",
            "schema_name": "fasilitas",
            "table_name": "fct_transactions",
            "description": "Tabel fakta transaksi fasilitas kepabeanan (KITE, Kawasan Berikat, Kemudahan Ekspor/Impor) dan transaksi pabean terintegrasi, memuat tarif pembebasan, bea keluar/masuk, devisa, dan kelengkapan dokumen.",
            "columns": [
              {
                "name": "nomor_aju",
                "data_type": "VARCHAR(32)",
                "description": "Nomor Pengajuan 26-digit Dokumen PEB BC 3.0",
                "tags": [
                  "PK",
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nomor_daftar",
                "data_type": "VARCHAR(16)",
                "description": "Nomor Pendaftaran PEB / Nopen resmi 6 digit",
                "tags": [
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tanggal_daftar",
                "data_type": "TIMESTAMP",
                "description": "Tanggal pendaftaran dokumen ekspor PEB",
                "tags": [
                  "Temporal",
                  "PartitionKey"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kantor_ekspor",
                "data_type": "VARCHAR(64)",
                "description": "Kantor pabean pendaftaran ekspor (contoh: KPPBC TMP TANJUNG PERAK)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kantor_muat",
                "data_type": "VARCHAR(64)",
                "description": "Kantor pabean pemuatan barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "npwp_eksportir",
                "data_type": "VARCHAR(20)",
                "description": "NPWP 15/16 digit perusahaan eksportir",
                "tags": [
                  "FK",
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_eksportir",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas badan usaha eksportir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "alamat_eksportir",
                "data_type": "VARCHAR(256)",
                "description": "Alamat domisili eksportir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "npwp_ppjk",
                "data_type": "VARCHAR(20)",
                "description": "NPWP Perusahaan Pengurusan Jasa Kepabeanan (PPJK)",
                "tags": [
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_ppjk",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas PPJK pengurus dokumen",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_penerima",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas penerima barang di luar negeri (Consignee)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_penerima",
                "data_type": "VARCHAR(64)",
                "description": "Negara domisili penerima barang",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nama_pembeli",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas pembeli di luar negeri (Buyer)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_pembeli",
                "data_type": "VARCHAR(64)",
                "description": "Negara domisili pembeli",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_tujuan",
                "data_type": "VARCHAR(64)",
                "description": "Negara tujuan akhir ekspor barang",
                "tags": [
                  "Dimension",
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "seri_barang",
                "data_type": "INTEGER",
                "description": "Nomor urut seri barang ekspor dalam PEB",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kode_hs",
                "data_type": "VARCHAR(16)",
                "description": "Klasifikasi pos tarif 8/10 digit HS Code (contoh: 7112999000)",
                "tags": [
                  "Dimension",
                  "Classification"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "uraian_barang",
                "data_type": "VARCHAR(500)",
                "description": "Uraian jenis dan spesifikasi komoditas barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jumlah_satuan",
                "data_type": "NUMERIC(18,4)",
                "description": "Jumlah kuantitas barang ekspor",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jenis_satuan",
                "data_type": "VARCHAR(16)",
                "description": "Satuan barang (KGM, PCS, TNE, dsb.)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "netto_barang",
                "data_type": "NUMERIC(18,4)",
                "description": "Berat bersih (Net Weight) barang (Kg)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "valuta",
                "data_type": "VARCHAR(8)",
                "description": "Kode valuta transaksi (USD, IDR, JPY, EUR)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kurs",
                "data_type": "NUMERIC(18,4)",
                "description": "Nilai kurs Keputusan Menteri Keuangan (KMK)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "fob_barang",
                "data_type": "NUMERIC(18,2)",
                "description": "Nilai Free On Board (FOB) barang dalam valuta",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tarif_bea_keluar",
                "data_type": "NUMERIC(8,4)",
                "description": "Tarif pungutan Bea Keluar ekspor (Advalorem % atau spesifik)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "bea_keluar_barang",
                "data_type": "NUMERIC(18,2)",
                "description": "Nominal pungutan Bea Keluar ekspor barang (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "pph_ekspor_peb",
                "data_type": "NUMERIC(18,2)",
                "description": "Pajak Penghasilan (PPh Pasal 22) Ekspor (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jalur",
                "data_type": "VARCHAR(8)",
                "description": "Jalur pelayanan pabean: H (Hijau), K (Kuning), M (Merah)",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "status_pabean",
                "data_type": "VARCHAR(32)",
                "description": "Status persetujuan pabean: NPE, PERIKSA_FISIK, REVISI, BATAL",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "transaction_id",
                "data_type": "VARCHAR(64)",
                "description": "Alias ID transaksi unik (sesuai nomor_aju)",
                "tags": [
                  "PK",
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "customer_id",
                "data_type": "VARCHAR(32)",
                "description": "Alias ID entitas (sesuai npwp_eksportir)",
                "tags": [
                  "FK"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "transaction_date",
                "data_type": "TIMESTAMP",
                "description": "Alias waktu transaksi (sesuai tanggal_daftar)",
                "tags": [
                  "Temporal"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "total_amount",
                "data_type": "NUMERIC(18,2)",
                "description": "Alias total nilai transaksi (sesuai fob_barang / devisa)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "status",
                "data_type": "VARCHAR(32)",
                "description": "Alias status dokumen transaksi (sesuai status_pabean)",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "created_at",
                "data_type": "TIMESTAMP",
                "description": "Waktu record dibuat di DWH",
                "tags": [
                  "System"
                ],
                "is_pii": false,
                "glossary_terms": []
              }
            ],
            "tier": "Tier 1 - Mission Critical",
            "owner": "Direktorat Fasilitas Kepabeanan",
            "lineage_upstream": [
              "staging_ceisa.stg_peb_header",
              "staging_ceisa.stg_peb_barang",
              "staging_ceisa.stg_fasilitas_kite"
            ],
            "lineage_downstream": [
              "datamart_ceisa.dm_kinerja_ekspor_bulanan",
              "datamart_ceisa.dm_fasilitas_tpb"
            ],
            "match_score": 1.0,
            "match_rationale": "Cocok pada deskripsi tabel: 'ekspor'; Kolom mendukung entitas: 'total_amount'; Kolom mendukung entitas: 'transaction_date'"
          },
          {
            "fqn": "dwh_ceisa.fasilitas.dim_customers",
            "service_name": "CEISA40-PostgreSQL-DWH",
            "database_name": "dwh_ceisa",
            "schema_name": "fasilitas",
            "table_name": "dim_customers",
            "description": "Master data profil perusahaan penerima fasilitas kepabeanan, importir produsen KITE/TPB, dan segmentasi kepatuhan.",
            "columns": [
              {
                "name": "customer_id",
                "data_type": "VARCHAR(32)",
                "description": "Primary key unik nasabah/perusahaan",
                "tags": [
                  "PK"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "customer_name",
                "data_type": "VARCHAR(128)",
                "description": "Nama lengkap badan usaha/nasabah",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "email",
                "data_type": "VARCHAR(128)",
                "description": "Alamat email aktif perusahaan",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "phone_number",
                "data_type": "VARCHAR(32)",
                "description": "Nomor handphone/kontak terdaftar",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nik",
                "data_type": "VARCHAR(16)",
                "description": "Nomor Induk Kependudukan (16 digit)",
                "tags": [
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "customer_segment",
                "data_type": "VARCHAR(32)",
                "description": "Segmen fasilitas: PRIORITAS, KITE_INDUSTRI, TPB_BERIKAT, REGULER",
                "tags": [
                  "Dimension",
                  "Segmentation"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "city",
                "data_type": "VARCHAR(64)",
                "description": "Kota domisili perusahaan",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "province",
                "data_type": "VARCHAR(64)",
                "description": "Provinsi domisili perusahaan",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "registration_date",
                "data_type": "DATE",
                "description": "Tanggal pertama kali terdaftar fasilitas",
                "tags": [
                  "Temporal"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "is_active",
                "data_type": "BOOLEAN",
                "description": "Status keaktifan fasilitas akun (TRUE/FALSE)",
                "tags": [
                  "Flag"
                ],
                "is_pii": false,
                "glossary_terms": []
              }
            ],
            "tier": "Tier 1",
            "owner": "Direktorat Fasilitas Kepabeanan",
            "lineage_upstream": [
              "staging_ceisa.stg_profil_perusahaan_kemenkeu"
            ],
            "lineage_downstream": [
              "dwh_ceisa.fasilitas.fct_transactions"
            ],
            "match_score": 1.0,
            "match_rationale": "Kolom mendukung entitas: 'phone_number'; Kolom mendukung entitas: 'customer_name'; Kolom mendukung entitas: 'city'"
          }
        ],
        "join_strategy": [
          {
            "left_table": "fct_transactions",
            "right_table": "dim_customers",
            "join_type": "INNER JOIN",
            "on_condition": "fct_transactions.customer_id = dim_customers.customer_id"
          }
        ],
        "unmapped_fields": [],
        "match_summary": "Ditemukan 3 tabel metadata resmi di OpenMetadata yang relevan dengan 'ekspor'."
      },
      "generated_sql": {
        "dialect": "PostgreSQL",
        "query": "-- ====================================================================\n-- Query Otomatis Dibuat oleh DataRequest2Agent\n-- Berdasarkan Dokumen: FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN (ID: REQ-2026-BC-089)\n-- Pemohon: Ahmad Fauzi, S.Kom (Internal Bea dan Cukai)\n-- Metadata Divalidasi via: OpenMetadata Service CEISA40-PostgreSQL-DWH\n-- Target Database: PostgreSQL\n-- ====================================================================\n\nSELECT\n    t.nomor_peb,\n    CONCAT(SUBSTRING(t.npwp_eksportir, 1, 6), '******', SUBSTRING(t.npwp_eksportir, LENGTH(t.npwp_eksportir)-3, 4)) AS npwp_eksportir_masked,\n    t.nilai_devisa_idr,\n    t.status_pabean\nFROM dwh_ceisa.ekspor.fct_peb_ekspor AS t\nINNER JOIN dwh_ceisa.fasilitas.dim_customers AS s\n    ON fct_transactions.customer_id = s.customer_id\nWHERE\n    t.tanggal_peb >= '01 Juli 2026 00:00:00'\n  AND t.tanggal_peb <= '30 September 2026 23:59:59'\n  AND t.status_pabean = 'NPE'\n  AND c.customer_segment = 'PRIORITAS'\nORDER BY\n    t.tanggal_peb DESC\nLIMIT 500;",
        "explanation": "Query disusun untuk database PostgreSQL dengan menggabungkan tabel fakta `fct_peb_ekspor` dan tabel dimensi `fct_transactions, dim_customers`. Filter diaplikasikan secara ketat sesuai spesifikasi dokumen permohonan. Atribut PII (Nama, NIK, NPWP, No Telepon) telah diproteksi dengan fungsi masking dinamis sesuai kepatuhan UU PDP & kerahasiaan data kepabeanan/perpajakan.",
        "selected_columns": [
          "nomor_peb",
          "npwp_eksportir_masked",
          "nilai_devisa_idr",
          "status_pabean"
        ],
        "applied_filters": [
          "Rentang Tanggal: 01 Juli 2026 s/d 30 September 2026",
          "status_pabean = 'NPE'",
          "Segmen Nasabah = 'PRIORITAS'"
        ],
        "tables_used": [
          "dwh_ceisa.ekspor.fct_peb_ekspor",
          "dwh_ceisa.fasilitas.fct_transactions",
          "dwh_ceisa.fasilitas.dim_customers"
        ]
      },
      "verification": {
        "status": "APPROVED",
        "checks": [
          {
            "category": "Safety",
            "item": "Destructive SQL Operations Guard",
            "passed": true,
            "details": "Query dijamin hanya bersifat Read-Only (SELECT). Tidak ada perintah destruktif.",
            "severity": "HIGH"
          },
          {
            "category": "Safety",
            "item": "Result Set Boundary (LIMIT / FETCH FIRST Clause)",
            "passed": true,
            "details": "Klausa pembatas baris (LIMIT / FETCH FIRST) disertakan untuk membatasi konsumsi memori dan beban komputasi database.",
            "severity": "MEDIUM"
          },
          {
            "category": "Safety",
            "item": "Cartesian Product Guard",
            "passed": true,
            "details": "Relasi antar-tabel menggunakan INNER/LEFT JOIN eksplisit dengan klausul ON yang tervalidasi.",
            "severity": "HIGH"
          },
          {
            "category": "Fidelity",
            "item": "Date Range Requirement Fidelity",
            "passed": true,
            "details": "Rentang waktu (01 Juli 2026 s/d 30 September 2026) tertera persis pada klausa WHERE.",
            "severity": "HIGH"
          },
          {
            "category": "Fidelity",
            "item": "Business Filter Criteria Fidelity",
            "passed": true,
            "details": "Semua kondisi filter spesifik dari dokumen permohonan telah diaplikasikan ke klausa WHERE.",
            "severity": "HIGH"
          },
          {
            "category": "PII/Governance",
            "item": "Data Privacy & Dynamic Masking Guard",
            "passed": true,
            "details": "Atribut PII (Nama, NIK, NPWP, No Telepon) telah diproteksi dengan masking dinamis/pseudonim.",
            "severity": "HIGH"
          },
          {
            "category": "Syntax/Schema",
            "item": "OpenMetadata Schema Grounding",
            "passed": true,
            "details": "Semua tabel yang digunakan terdaftar resmi di OpenMetadata Catalog.",
            "severity": "HIGH"
          }
        ],
        "verifier_id": "Agent-Independent-Auditor-v2",
        "verifier_timestamp": "2026-10-11T15:11:06.341382+00:00",
        "executive_summary": "Verifikasi independen selesai dengan status APPROVED. Total 7 parameter kepatuhan diuji (7/7 lolos - 100% kepatuhan). Query memenuhi standar fidelity permohonan data dan proteksi keamanan DWH.",
        "compliance_score": 100,
        "digital_fingerprint": "a055d33cceb447143bec638e6c12f91713aed0dbfd2bc0e41ace9a03bb213cab",
        "repair_actions_taken": [
          "Applied Dynamic String Concat Masking for NIK and Customer Name"
        ],
        "verifier_feedback": null
      },
      "execution": {
        "row_count": 35,
        "column_names": [
          "nomor_aju",
          "nomor_daftar",
          "tanggal_daftar",
          "kantor_ekspor",
          "kantor_muat",
          "nama_eksportir_masked",
          "npwp_eksportir_masked",
          "npwp_ppjk_masked",
          "nama_ppjk_masked",
          "nama_penerima",
          "negara_penerima",
          "nama_pembeli",
          "negara_pembeli",
          "negara_tujuan",
          "seri_barang",
          "kode_hs",
          "uraian_barang",
          "jumlah_satuan",
          "jenis_satuan",
          "netto_barang",
          "valuta",
          "kurs",
          "fob_barang",
          "tarif_bea_keluar",
          "bea_keluar_barang",
          "pph_ekspor_peb",
          "jalur",
          "status_jalur",
          "status_pabean",
          "status_dokumen",
          "dokumen_pelengkap"
        ],
        "preview_rows": [
          {
            "nomor_aju": "07000000022220260703100001",
            "nomor_daftar": "009923",
            "tanggal_daftar": "2026-07-03",
            "kantor_ekspor": "KPPBC TMP TANJUNG PERAK",
            "kantor_muat": "KPPBC TMP TANJUNG PERAK",
            "nama_eksportir_masked": "PT AST*** AGRO LESTARI",
            "npwp_eksportir_masked": "09.201.***.*-772.000",
            "npwp_ppjk_masked": "01.813.***.*-323.000",
            "nama_ppjk_masked": "PT CIP*** SEGARA INTERNASIONAL",
            "nama_penerima": "MITSUBISHI CORPORATION RTM JAPAN LTD.",
            "negara_penerima": "India",
            "nama_pembeli": "MITSUBISHI CORP BUYER INC.",
            "negara_pembeli": "India",
            "negara_tujuan": "India",
            "seri_barang": 1,
            "kode_hs": "7112300000",
            "uraian_barang": "ANODE SLIME (HASIL PEMURNIAN TEMBAGA)",
            "jumlah_satuan": 5200,
            "jenis_satuan": "KGM",
            "netto_barang": 5200,
            "valuta": "USD",
            "kurs": 15500,
            "fob_barang": 48000,
            "tarif_bea_keluar": 0.075,
            "bea_keluar_barang": 55800000,
            "pph_ekspor_peb": 11160000,
            "jalur": "M",
            "status_jalur": "MERAH",
            "status_pabean": "NPE",
            "status_dokumen": "SELESAI (NPE)",
            "dokumen_pelengkap": "INVOICE: SLMMMC2026-01 (Tgl: 2026-07-03)"
          },
          {
            "nomor_aju": "07000000022220260728100002",
            "nomor_daftar": "001294",
            "tanggal_daftar": "2026-07-28",
            "kantor_ekspor": "KPPBC TMP BELAWAN",
            "kantor_muat": "KPPBC TMP TANJUNG PRIOK",
            "nama_eksportir_masked": "PT KRA*** STEEL",
            "npwp_eksportir_masked": "08.191.***.*-402.000",
            "npwp_ppjk_masked": "01.813.***.*-673.000",
            "nama_ppjk_masked": "PT CIP*** SEGARA INTERNASIONAL",
            "nama_penerima": "MITSUBISHI CORPORATION RTM JAPAN LTD.",
            "negara_penerima": "Jepang",
            "nama_pembeli": "MITSUBISHI CORP BUYER INC.",
            "negara_pembeli": "Jepang",
            "negara_tujuan": "Jepang",
            "seri_barang": 1,
            "kode_hs": "7112999000",
            "uraian_barang": "ANODE SLIME (HASIL PEMURNIAN TEMBAGA)",
            "jumlah_satuan": 5200,
            "jenis_satuan": "KGM",
            "netto_barang": 5200,
            "valuta": "USD",
            "kurs": 15500,
            "fob_barang": 240000,
            "tarif_bea_keluar": 0.15,
            "bea_keluar_barang": 0,
            "pph_ekspor_peb": 0,
            "jalur": "H",
            "status_jalur": "HIJAU",
            "status_pabean": "NPE",
            "status_dokumen": "SELESAI (NPE)",
            "dokumen_pelengkap": "INVOICE: SLMMMC2026-01 (Tgl: 2026-07-28)"
          },
          {
            "nomor_aju": "07000000022220260703100003",
            "nomor_daftar": "005891",
            "tanggal_daftar": "2026-07-03",
            "kantor_ekspor": "KPPBC TMP SOEKARNO HATTA",
            "kantor_muat": "KPPBC TMP TANJUNG PRIOK",
            "nama_eksportir_masked": "PT AST*** AGRO LESTARI",
            "npwp_eksportir_masked": "07.940.***.*-637.000",
            "npwp_ppjk_masked": "01.813.***.*-772.000",
            "nama_ppjk_masked": "PT CIP*** SEGARA INTERNASIONAL",
            "nama_penerima": "MITSUBISHI CORPORATION RTM JAPAN LTD.",
            "negara_penerima": "Jepang",
            "nama_pembeli": "MITSUBISHI CORP BUYER INC.",
            "negara_pembeli": "Jepang",
            "negara_tujuan": "Jepang",
            "seri_barang": 1,
            "kode_hs": "7112991000",
            "uraian_barang": "WASTE AND SCRAP OF PRECIOUS METAL",
            "jumlah_satuan": 5200,
            "jenis_satuan": "KGM",
            "netto_barang": 5200,
            "valuta": "USD",
            "kurs": 15500,
            "fob_barang": 75000,
            "tarif_bea_keluar": 0.05,
            "bea_keluar_barang": 58125000,
            "pph_ekspor_peb": 17437500,
            "jalur": "M",
            "status_jalur": "MERAH",
            "status_pabean": "NPE",
            "status_dokumen": "SELESAI (NPE)",
            "dokumen_pelengkap": "INVOICE: SLMMMC2026-01 (Tgl: 2026-07-03)"
          },
          {
            "nomor_aju": "07000000022220260908100004",
            "nomor_daftar": "007723",
            "tanggal_daftar": "2026-09-08",
            "kantor_ekspor": "KPPBC TMP BELAWAN",
            "kantor_muat": "KPPBC TMP BELAWAN",
            "nama_eksportir_masked": "PT AST*** AGRO LESTARI",
            "npwp_eksportir_masked": "02.212.***.*-284.000",
            "npwp_ppjk_masked": "01.813.***.*-467.000",
            "nama_ppjk_masked": "PT CIP*** SEGARA INTERNASIONAL",
            "nama_penerima": "MITSUBISHI CORPORATION RTM JAPAN LTD.",
            "negara_penerima": "Australia",
            "nama_pembeli": "MITSUBISHI CORP BUYER INC.",
            "negara_pembeli": "Australia",
            "negara_tujuan": "Australia",
            "seri_barang": 1,
            "kode_hs": "7112300000",
            "uraian_barang": "WASTE AND SCRAP OF PRECIOUS METAL",
            "jumlah_satuan": 22000,
            "jenis_satuan": "KGM",
            "netto_barang": 22000,
            "valuta": "USD",
            "kurs": 15500,
            "fob_barang": 185000,
            "tarif_bea_keluar": 0.1,
            "bea_keluar_barang": 0,
            "pph_ekspor_peb": 0,
            "jalur": "K",
            "status_jalur": "KUNING",
            "status_pabean": "NPE",
            "status_dokumen": "SELESAI (NPE)",
            "dokumen_pelengkap": "INVOICE: SLMMMC2026-01 (Tgl: 2026-09-08)"
          },
          {
            "nomor_aju": "07000000022220260802100005",
            "nomor_daftar": "003144",
            "tanggal_daftar": "2026-08-02",
            "kantor_ekspor": "KPPBC TMP TANJUNG PERAK",
            "kantor_muat": "KPPBC TMP BELAWAN",
            "nama_eksportir_masked": "PT AST*** AGRO LESTARI",
            "npwp_eksportir_masked": "04.348.***.*-297.000",
            "npwp_ppjk_masked": "01.813.***.*-945.000",
            "nama_ppjk_masked": "PT CIP*** SEGARA INTERNASIONAL",
            "nama_penerima": "MITSUBISHI CORPORATION RTM JAPAN LTD.",
            "negara_penerima": "Singapura",
            "nama_pembeli": "MITSUBISHI CORP BUYER INC.",
            "negara_pembeli": "Singapura",
            "negara_tujuan": "Singapura",
            "seri_barang": 1,
            "kode_hs": "7112300000",
            "uraian_barang": "WASTE AND SCRAP OF PRECIOUS METAL",
            "jumlah_satuan": 5200,
            "jenis_satuan": "KGM",
            "netto_barang": 5200,
            "valuta": "USD",
            "kurs": 15500,
            "fob_barang": 185000,
            "tarif_bea_keluar": 0.05,
            "bea_keluar_barang": 0,
            "pph_ekspor_peb": 0,
            "jalur": "H",
            "status_jalur": "HIJAU",
            "status_pabean": "NPE",
            "status_dokumen": "SELESAI (NPE)",
            "dokumen_pelengkap": "INVOICE: SLMMMC2026-01 (Tgl: 2026-08-02)"
          },
          {
            "nomor_aju": "07000000022220260829100006",
            "nomor_daftar": "008559",
            "tanggal_daftar": "2026-08-29",
            "kantor_ekspor": "KPPBC TMP TANJUNG PERAK",
            "kantor_muat": "KPPBC TMP TANJUNG PRIOK",
            "nama_eksportir_masked": "PT IND*** CBP MAKMUR",
            "npwp_eksportir_masked": "08.375.***.*-347.000",
            "npwp_ppjk_masked": "01.813.***.*-968.000",
            "nama_ppjk_masked": "PT CIP*** SEGARA INTERNASIONAL",
            "nama_penerima": "MITSUBISHI CORPORATION RTM JAPAN LTD.",
            "negara_penerima": "Australia",
            "nama_pembeli": "MITSUBISHI CORP BUYER INC.",
            "negara_pembeli": "Australia",
            "negara_tujuan": "Australia",
            "seri_barang": 1,
            "kode_hs": "7112920000",
            "uraian_barang": "ELECTRONIC SCRAP CONTAINING GOLD",
            "jumlah_satuan": 10650,
            "jenis_satuan": "KGM",
            "netto_barang": 10650,
            "valuta": "USD",
            "kurs": 15500,
            "fob_barang": 520000,
            "tarif_bea_keluar": 0.05,
            "bea_keluar_barang": 403000000,
            "pph_ekspor_peb": 120900000,
            "jalur": "M",
            "status_jalur": "MERAH",
            "status_pabean": "NPE",
            "status_dokumen": "SELESAI (NPE)",
            "dokumen_pelengkap": "INVOICE: SLMMMC2026-01 (Tgl: 2026-08-29)"
          },
          {
            "nomor_aju": "07000000022220260728100007",
            "nomor_daftar": "006133",
            "tanggal_daftar": "2026-07-28",
            "kantor_ekspor": "KPPBC TMP TANJUNG PERAK",
            "kantor_muat": "KPPBC TMP TANJUNG PERAK",
            "nama_eksportir_masked": "PT KAL*** FARMA TBK",
            "npwp_eksportir_masked": "09.437.***.*-173.000",
            "npwp_ppjk_masked": "01.813.***.*-610.000",
            "nama_ppjk_masked": "PT CIP*** SEGARA INTERNASIONAL",
            "nama_penerima": "MITSUBISHI CORPORATION RTM JAPAN LTD.",
            "negara_penerima": "Tiongkok",
            "nama_pembeli": "MITSUBISHI CORP BUYER INC.",
            "negara_pembeli": "Tiongkok",
            "negara_tujuan": "Tiongkok",
            "seri_barang": 1,
            "kode_hs": "7112999000",
            "uraian_barang": "ANODE SLIME (HASIL PEMURNIAN TEMBAGA)",
            "jumlah_satuan": 10650,
            "jenis_satuan": "KGM",
            "netto_barang": 10650,
            "valuta": "USD",
            "kurs": 15500,
            "fob_barang": 120000,
            "tarif_bea_keluar": 0.075,
            "bea_keluar_barang": 139500000,
            "pph_ekspor_peb": 27900000,
            "jalur": "M",
            "status_jalur": "MERAH",
            "status_pabean": "NPE",
            "status_dokumen": "SELESAI (NPE)",
            "dokumen_pelengkap": "INVOICE: SLMMMC2026-01 (Tgl: 2026-07-28)"
          },
          {
            "nomor_aju": "07000000022220260711100008",
            "nomor_daftar": "003450",
            "tanggal_daftar": "2026-07-11",
            "kantor_ekspor": "KPPBC TMP BELAWAN",
            "kantor_muat": "KPPBC TMP TANJUNG PERAK",
            "nama_eksportir_masked": "PT MAY*** INDAH TBK",
            "npwp_eksportir_masked": "03.717.***.*-169.000",
            "npwp_ppjk_masked": "01.813.***.*-710.000",
            "nama_ppjk_masked": "PT CIP*** SEGARA INTERNASIONAL",
            "nama_penerima": "MITSUBISHI CORPORATION RTM JAPAN LTD.",
            "negara_penerima": "Singapura",
            "nama_pembeli": "MITSUBISHI CORP BUYER INC.",
            "negara_pembeli": "Singapura",
            "negara_tujuan": "Singapura",
            "seri_barang": 1,
            "kode_hs": "7112999000",
            "uraian_barang": "WASTE AND SCRAP OF PRECIOUS METAL",
            "jumlah_satuan": 5200,
            "jenis_satuan": "KGM",
            "netto_barang": 5200,
            "valuta": "USD",
            "kurs": 15500,
            "fob_barang": 240000,
            "tarif_bea_keluar": 0.075,
            "bea_keluar_barang": 279000000,
            "pph_ekspor_peb": 55800000,
            "jalur": "K",
            "status_jalur": "KUNING",
            "status_pabean": "NPE",
            "status_dokumen": "SELESAI (NPE)",
            "dokumen_pelengkap": "INVOICE: SLMMMC2026-01 (Tgl: 2026-07-11)"
          },
          {
            "nomor_aju": "07000000022220260703100009",
            "nomor_daftar": "006136",
            "tanggal_daftar": "2026-07-03",
            "kantor_ekspor": "KPPBC TMP BELAWAN",
            "kantor_muat": "KPPBC TMP TANJUNG PERAK",
            "nama_eksportir_masked": "PT AST*** AGRO LESTARI",
            "npwp_eksportir_masked": "01.449.***.*-673.000",
            "npwp_ppjk_masked": "01.813.***.*-476.000",
            "nama_ppjk_masked": "PT CIP*** SEGARA INTERNASIONAL",
            "nama_penerima": "MITSUBISHI CORPORATION RTM JAPAN LTD.",
            "negara_penerima": "Belanda",
            "nama_pembeli": "MITSUBISHI CORP BUYER INC.",
            "negara_pembeli": "Belanda",
            "negara_tujuan": "Belanda",
            "seri_barang": 1,
            "kode_hs": "7112991000",
            "uraian_barang": "ANODE SLIME (HASIL PEMURNIAN TEMBAGA)",
            "jumlah_satuan": 10650,
            "jenis_satuan": "KGM",
            "netto_barang": 10650,
            "valuta": "USD",
            "kurs": 15500,
            "fob_barang": 520000,
            "tarif_bea_keluar": 0.15,
            "bea_keluar_barang": 1209000000,
            "pph_ekspor_peb": 120900000,
            "jalur": "H",
            "status_jalur": "HIJAU",
            "status_pabean": "NPE",
            "status_dokumen": "SELESAI (NPE)",
            "dokumen_pelengkap": "INVOICE: SLMMMC2026-01 (Tgl: 2026-07-03)"
          },
          {
            "nomor_aju": "07000000022220260808100010",
            "nomor_daftar": "008332",
            "tanggal_daftar": "2026-08-08",
            "kantor_ekspor": "KPPBC TMP TANJUNG PRIOK",
            "kantor_muat": "KPPBC TMP TANJUNG PRIOK",
            "nama_eksportir_masked": "PT KRA*** STEEL",
            "npwp_eksportir_masked": "07.906.***.*-836.000",
            "npwp_ppjk_masked": "01.813.***.*-253.000",
            "nama_ppjk_masked": "PT CIP*** SEGARA INTERNASIONAL",
            "nama_penerima": "MITSUBISHI CORPORATION RTM JAPAN LTD.",
            "negara_penerima": "Singapura",
            "nama_pembeli": "MITSUBISHI CORP BUYER INC.",
            "negara_pembeli": "Singapura",
            "negara_tujuan": "Singapura",
            "seri_barang": 1,
            "kode_hs": "7112999000",
            "uraian_barang": "SILVER CHAIN SCRAPS",
            "jumlah_satuan": 15400,
            "jenis_satuan": "KGM",
            "netto_barang": 15400,
            "valuta": "USD",
            "kurs": 15500,
            "fob_barang": 48000,
            "tarif_bea_keluar": 0.15,
            "bea_keluar_barang": 111600000,
            "pph_ekspor_peb": 11160000,
            "jalur": "H",
            "status_jalur": "HIJAU",
            "status_pabean": "NPE",
            "status_dokumen": "SELESAI (NPE)",
            "dokumen_pelengkap": "INVOICE: SLMMMC2026-01 (Tgl: 2026-08-08)"
          }
        ],
        "excel_path": "outputs\\DataExport_REQ_2026_BC_089_20261011_221106.xlsx",
        "csv_path": "outputs\\DataExport_REQ_2026_BC_089_20261011_221106.csv",
        "json_path": "outputs\\DataExport_REQ_2026_BC_089_20261011_221106.json",
        "zip_path": "outputs\\DataFulfillment_REQ_2026_BC_089_20261011_221106.zip",
        "certificate_path": "outputs\\Sertifikat_Otorisasi_REQ_2026_BC_089_20261011_221106.pdf",
        "execution_time_ms": 155.58,
        "dialect": "PostgreSQL"
      }
    },
    "Permohonan_Data_Internal_Kemenkeu.pdf": {
      "success": true,
      "message": "Pemenuhan permohonan data berhasil diproses.",
      "spec": {
        "request_id": "REQ-2026-KMK-114",
        "document_title": "FORMULIR PERMOHONAN REKONSILIASI DATA TRANSAKSI PENERIMAAN NEGARA",
        "requester_name": "Siti Sarah, S.T.",
        "requester_department": "Internal Kemenkeu",
        "business_process": "Penerimaan",
        "request_date": "05 Oktober 2026",
        "business_purpose": "Data",
        "primary_entity": "pengiriman",
        "time_range_start": "2026-07-01",
        "time_range_end": "2026-09-30",
        "requested_fields": [
          {
            "name": "transaction_id",
            "description": "ID Transaksi",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          },
          {
            "name": "city",
            "description": "Kota",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          },
          {
            "name": "status",
            "description": "Status",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          }
        ],
        "filters": [
          {
            "field_description": "Periode Transaksi",
            "target_column": "transaction_date",
            "operator": "BETWEEN",
            "value": [
              "2026-07-01",
              "2026-09-30"
            ],
            "rationale": "Filter rentang waktu 2026-07-01 s/d 2026-09-30"
          }
        ],
        "aggregation_level": "detail",
        "compliance_notes": "Data bersifat internal rahasia. Kolom PII (Nama, NIK, No HP) wajib dimasking untuk kepatuhan PDP/GDPR.",
        "raw_text_summary": "KEMENTERIAN KEUANGAN REPUBLIK INDONESIA\n DIREKTORAT JENDERAL PAJAK & BADAN KEBIJAKAN FISKAL\n FORMULIR PERMOHONAN REKONSILIASI DATA TRANSAKSI PENERIMAAN NEGARA\nNomor Permohonan\n: REQ-2026-KMK-114\nTanggal Pengajuan\n: 05 Oktober 2026\nNama Pemohon (PIC)\n: Siti Sarah, S.T.\nUnit Kerja / Divisi\n: Internal Kemenkeu\nSub-Unit / Instansi\n: Direktorat Potensi, Kepatuhan dan Penerimaan\nTipe Proses Bisnis\n: Pen..."
      },
      "catalog_match": {
        "selected_tables": [
          {
            "fqn": "dwh_ceisa.keberatan.fct_shipments",
            "service_name": "CEISA40-PostgreSQL-DWH",
            "database_name": "dwh_ceisa",
            "schema_name": "keberatan",
            "table_name": "fct_shipments",
            "description": "Tabel pelacakan berkas perkara permohonan keberatan penetapan bea masuk/keluar, sanksi administrasi, pengiriman dokumen keputusan, dan proses banding Pengadilan Pajak.",
            "columns": [
              {
                "name": "shipment_id",
                "data_type": "VARCHAR(64)",
                "description": "Nomor resi/berkas perkara unik",
                "tags": [
                  "PK"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "transaction_id",
                "data_type": "VARCHAR(64)",
                "description": "Foreign key dokumen pabean terkait",
                "tags": [
                  "FK"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "courier_name",
                "data_type": "VARCHAR(32)",
                "description": "Nama ekspedisi/kurir kedinasan dokumen",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "delivery_status",
                "data_type": "VARCHAR(32)",
                "description": "Status kirim/sidang: DELIVERED, IN_TRANSIT, FAILED, SIDANG_BANDING",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "shipping_cost",
                "data_type": "NUMERIC(10,2)",
                "description": "Biaya penanganan administrasi (IDR)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "dispatch_date",
                "data_type": "TIMESTAMP",
                "description": "Waktu dokumen dikirimkan ke pemohon",
                "tags": [
                  "Temporal"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "received_date",
                "data_type": "TIMESTAMP",
                "description": "Waktu tanda terima keputusan oleh pemohon",
                "tags": [
                  "Temporal"
                ],
                "is_pii": false,
                "glossary_terms": []
              }
            ],
            "tier": "Tier 2",
            "owner": "Direktorat Keberatan Banding dan Peraturan",
            "lineage_upstream": [
              "staging_ceisa.stg_permohonan_keberatan"
            ],
            "lineage_downstream": [
              "datamart_ceisa.dm_kinerja_keberatan_banding"
            ],
            "match_score": 0.85,
            "match_rationale": "Cocok pada deskripsi tabel: 'pengiriman'; Kolom mendukung entitas: 'status'; Kolom mendukung entitas: 'transaction_id'"
          },
          {
            "fqn": "dwh_ceisa.impor.fct_pib_impor",
            "service_name": "CEISA40-PostgreSQL-DWH",
            "database_name": "dwh_ceisa",
            "schema_name": "impor",
            "table_name": "fct_pib_impor",
            "description": "Tabel fakta arus barang impor, nilai pabean CIF, pungutan bea masuk, dan jalur pelayanan PIB (BC 2.0).",
            "columns": [
              {
                "name": "nomor_pib",
                "data_type": "VARCHAR(32)",
                "description": "Nomor pendaftaran PIB resmi",
                "tags": [
                  "PK",
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tanggal_pib",
                "data_type": "TIMESTAMP",
                "description": "Tanggal pendaftaran dokumen PIB",
                "tags": [
                  "Temporal",
                  "PartitionKey"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "npwp_importir",
                "data_type": "VARCHAR(20)",
                "description": "NPWP perusahaan importir",
                "tags": [
                  "FK",
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_importir",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas importir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "kode_kantor",
                "data_type": "VARCHAR(8)",
                "description": "Kode kantor pabean kedatangan",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_asal",
                "data_type": "VARCHAR(64)",
                "description": "Negara asal pengiriman barang",
                "tags": [
                  "Dimension",
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nilai_cif_usd",
                "data_type": "NUMERIC(18,2)",
                "description": "Nilai CIF (Cost, Insurance, Freight) USD",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "bea_masuk_idr",
                "data_type": "NUMERIC(18,2)",
                "description": "Nominal pungutan Bea Masuk (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "ppn_impor_idr",
                "data_type": "NUMERIC(18,2)",
                "description": "Nilai PPN Impor (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "status_jalur",
                "data_type": "VARCHAR(32)",
                "description": "Jalur pelayanan: HIJAU, KUNING, MERAH, MITA, AEO",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "created_at",
                "data_type": "TIMESTAMP",
                "description": "Waktu sinkronisasi DWH",
                "tags": [
                  "System"
                ],
                "is_pii": false,
                "glossary_terms": []
              }
            ],
            "tier": "Tier 1 - Mission Critical",
            "owner": "Direktorat Teknis Kepabeanan & Subdit Impor",
            "lineage_upstream": [
              "staging_ceisa.stg_pib_header",
              "staging_ceisa.stg_billing_mpn"
            ],
            "lineage_downstream": [
              "datamart_ceisa.dm_penerimaan_pabean",
              "datamart_ceisa.dm_profiling_komoditas"
            ],
            "match_score": 0.5,
            "match_rationale": "Kolom mendukung entitas: 'status'; Kolom mendukung entitas: 'pengiriman'"
          },
          {
            "fqn": "dwh_ceisa.fasilitas.fct_transactions",
            "service_name": "CEISA40-PostgreSQL-DWH",
            "database_name": "dwh_ceisa",
            "schema_name": "fasilitas",
            "table_name": "fct_transactions",
            "description": "Tabel fakta transaksi fasilitas kepabeanan (KITE, Kawasan Berikat, Kemudahan Ekspor/Impor) dan transaksi pabean terintegrasi, memuat tarif pembebasan, bea keluar/masuk, devisa, dan kelengkapan dokumen.",
            "columns": [
              {
                "name": "nomor_aju",
                "data_type": "VARCHAR(32)",
                "description": "Nomor Pengajuan 26-digit Dokumen PEB BC 3.0",
                "tags": [
                  "PK",
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nomor_daftar",
                "data_type": "VARCHAR(16)",
                "description": "Nomor Pendaftaran PEB / Nopen resmi 6 digit",
                "tags": [
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tanggal_daftar",
                "data_type": "TIMESTAMP",
                "description": "Tanggal pendaftaran dokumen ekspor PEB",
                "tags": [
                  "Temporal",
                  "PartitionKey"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kantor_ekspor",
                "data_type": "VARCHAR(64)",
                "description": "Kantor pabean pendaftaran ekspor (contoh: KPPBC TMP TANJUNG PERAK)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kantor_muat",
                "data_type": "VARCHAR(64)",
                "description": "Kantor pabean pemuatan barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "npwp_eksportir",
                "data_type": "VARCHAR(20)",
                "description": "NPWP 15/16 digit perusahaan eksportir",
                "tags": [
                  "FK",
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_eksportir",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas badan usaha eksportir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "alamat_eksportir",
                "data_type": "VARCHAR(256)",
                "description": "Alamat domisili eksportir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "npwp_ppjk",
                "data_type": "VARCHAR(20)",
                "description": "NPWP Perusahaan Pengurusan Jasa Kepabeanan (PPJK)",
                "tags": [
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_ppjk",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas PPJK pengurus dokumen",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_penerima",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas penerima barang di luar negeri (Consignee)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_penerima",
                "data_type": "VARCHAR(64)",
                "description": "Negara domisili penerima barang",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nama_pembeli",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas pembeli di luar negeri (Buyer)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_pembeli",
                "data_type": "VARCHAR(64)",
                "description": "Negara domisili pembeli",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_tujuan",
                "data_type": "VARCHAR(64)",
                "description": "Negara tujuan akhir ekspor barang",
                "tags": [
                  "Dimension",
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "seri_barang",
                "data_type": "INTEGER",
                "description": "Nomor urut seri barang ekspor dalam PEB",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kode_hs",
                "data_type": "VARCHAR(16)",
                "description": "Klasifikasi pos tarif 8/10 digit HS Code (contoh: 7112999000)",
                "tags": [
                  "Dimension",
                  "Classification"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "uraian_barang",
                "data_type": "VARCHAR(500)",
                "description": "Uraian jenis dan spesifikasi komoditas barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jumlah_satuan",
                "data_type": "NUMERIC(18,4)",
                "description": "Jumlah kuantitas barang ekspor",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jenis_satuan",
                "data_type": "VARCHAR(16)",
                "description": "Satuan barang (KGM, PCS, TNE, dsb.)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "netto_barang",
                "data_type": "NUMERIC(18,4)",
                "description": "Berat bersih (Net Weight) barang (Kg)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "valuta",
                "data_type": "VARCHAR(8)",
                "description": "Kode valuta transaksi (USD, IDR, JPY, EUR)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kurs",
                "data_type": "NUMERIC(18,4)",
                "description": "Nilai kurs Keputusan Menteri Keuangan (KMK)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "fob_barang",
                "data_type": "NUMERIC(18,2)",
                "description": "Nilai Free On Board (FOB) barang dalam valuta",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tarif_bea_keluar",
                "data_type": "NUMERIC(8,4)",
                "description": "Tarif pungutan Bea Keluar ekspor (Advalorem % atau spesifik)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "bea_keluar_barang",
                "data_type": "NUMERIC(18,2)",
                "description": "Nominal pungutan Bea Keluar ekspor barang (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "pph_ekspor_peb",
                "data_type": "NUMERIC(18,2)",
                "description": "Pajak Penghasilan (PPh Pasal 22) Ekspor (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jalur",
                "data_type": "VARCHAR(8)",
                "description": "Jalur pelayanan pabean: H (Hijau), K (Kuning), M (Merah)",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "status_pabean",
                "data_type": "VARCHAR(32)",
                "description": "Status persetujuan pabean: NPE, PERIKSA_FISIK, REVISI, BATAL",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "transaction_id",
                "data_type": "VARCHAR(64)",
                "description": "Alias ID transaksi unik (sesuai nomor_aju)",
                "tags": [
                  "PK",
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "customer_id",
                "data_type": "VARCHAR(32)",
                "description": "Alias ID entitas (sesuai npwp_eksportir)",
                "tags": [
                  "FK"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "transaction_date",
                "data_type": "TIMESTAMP",
                "description": "Alias waktu transaksi (sesuai tanggal_daftar)",
                "tags": [
                  "Temporal"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "total_amount",
                "data_type": "NUMERIC(18,2)",
                "description": "Alias total nilai transaksi (sesuai fob_barang / devisa)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "status",
                "data_type": "VARCHAR(32)",
                "description": "Alias status dokumen transaksi (sesuai status_pabean)",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "created_at",
                "data_type": "TIMESTAMP",
                "description": "Waktu record dibuat di DWH",
                "tags": [
                  "System"
                ],
                "is_pii": false,
                "glossary_terms": []
              }
            ],
            "tier": "Tier 1 - Mission Critical",
            "owner": "Direktorat Fasilitas Kepabeanan",
            "lineage_upstream": [
              "staging_ceisa.stg_peb_header",
              "staging_ceisa.stg_peb_barang",
              "staging_ceisa.stg_fasilitas_kite"
            ],
            "lineage_downstream": [
              "datamart_ceisa.dm_kinerja_ekspor_bulanan",
              "datamart_ceisa.dm_fasilitas_tpb"
            ],
            "match_score": 0.5,
            "match_rationale": "Kolom mendukung entitas: 'status'; Kolom mendukung entitas: 'transaction_id'"
          }
        ],
        "join_strategy": [
          {
            "left_table": "fct_transactions",
            "right_table": "fct_shipments",
            "join_type": "LEFT JOIN",
            "on_condition": "fct_transactions.transaction_id = fct_shipments.transaction_id"
          }
        ],
        "unmapped_fields": [],
        "match_summary": "Ditemukan 3 tabel metadata resmi di OpenMetadata yang relevan dengan 'pengiriman'."
      },
      "generated_sql": {
        "dialect": "PostgreSQL",
        "query": "-- ====================================================================\n-- Query Otomatis Dibuat oleh DataRequest2Agent\n-- Berdasarkan Dokumen: FORMULIR PERMOHONAN REKONSILIASI DATA TRANSAKSI PENERIMAAN NEGARA (ID: REQ-2026-KMK-114)\n-- Pemohon: Siti Sarah, S.T. (Internal Kemenkeu)\n-- Metadata Divalidasi via: OpenMetadata Service CEISA40-PostgreSQL-DWH\n-- Target Database: PostgreSQL\n-- ====================================================================\n\nSELECT\n    t.transaction_id,\n    t.status\nFROM dwh_ceisa.keberatan.fct_shipments AS t\nLEFT JOIN dwh_ceisa.keberatan.fct_shipments AS t\n    ON fct_transactions.transaction_id = t.transaction_id\nWHERE\n    t.transaction_date >= '2026-07-01 00:00:00'\n  AND t.transaction_date <= '2026-09-30 23:59:59'\nORDER BY\n    t.transaction_date DESC\nLIMIT 500;",
        "explanation": "Query disusun untuk database PostgreSQL dengan menggabungkan tabel fakta `fct_shipments` dan tabel dimensi `fct_pib_impor, fct_transactions`. Filter diaplikasikan secara ketat sesuai spesifikasi dokumen permohonan. Atribut PII (Nama, NIK, NPWP, No Telepon) telah diproteksi dengan fungsi masking dinamis sesuai kepatuhan UU PDP & kerahasiaan data kepabeanan/perpajakan.",
        "selected_columns": [
          "transaction_id",
          "status"
        ],
        "applied_filters": [
          "Rentang Tanggal: 2026-07-01 s/d 2026-09-30"
        ],
        "tables_used": [
          "dwh_ceisa.keberatan.fct_shipments",
          "dwh_ceisa.impor.fct_pib_impor",
          "dwh_ceisa.fasilitas.fct_transactions"
        ]
      },
      "verification": {
        "status": "APPROVED",
        "checks": [
          {
            "category": "Safety",
            "item": "Destructive SQL Operations Guard",
            "passed": true,
            "details": "Query dijamin hanya bersifat Read-Only (SELECT). Tidak ada perintah destruktif.",
            "severity": "HIGH"
          },
          {
            "category": "Safety",
            "item": "Result Set Boundary (LIMIT / FETCH FIRST Clause)",
            "passed": true,
            "details": "Klausa pembatas baris (LIMIT / FETCH FIRST) disertakan untuk membatasi konsumsi memori dan beban komputasi database.",
            "severity": "MEDIUM"
          },
          {
            "category": "Safety",
            "item": "Cartesian Product Guard",
            "passed": true,
            "details": "Relasi antar-tabel menggunakan INNER/LEFT JOIN eksplisit dengan klausul ON yang tervalidasi.",
            "severity": "HIGH"
          },
          {
            "category": "Fidelity",
            "item": "Date Range Requirement Fidelity",
            "passed": true,
            "details": "Rentang waktu (2026-07-01 s/d 2026-09-30) tertera persis pada klausa WHERE.",
            "severity": "HIGH"
          },
          {
            "category": "Fidelity",
            "item": "Business Filter Criteria Fidelity",
            "passed": true,
            "details": "Semua kondisi filter spesifik dari dokumen permohonan telah diaplikasikan ke klausa WHERE.",
            "severity": "HIGH"
          },
          {
            "category": "PII/Governance",
            "item": "Data Privacy & Dynamic Masking Guard",
            "passed": true,
            "details": "Atribut PII (Nama, NIK, NPWP, No Telepon) telah diproteksi dengan masking dinamis/pseudonim.",
            "severity": "HIGH"
          },
          {
            "category": "Syntax/Schema",
            "item": "OpenMetadata Schema Grounding",
            "passed": true,
            "details": "Semua tabel yang digunakan terdaftar resmi di OpenMetadata Catalog.",
            "severity": "HIGH"
          }
        ],
        "verifier_id": "Agent-Independent-Auditor-v2",
        "verifier_timestamp": "2026-10-11T15:11:06.510612+00:00",
        "executive_summary": "Verifikasi independen selesai dengan status APPROVED. Total 7 parameter kepatuhan diuji (7/7 lolos - 100% kepatuhan). Query memenuhi standar fidelity permohonan data dan proteksi keamanan DWH.",
        "compliance_score": 100,
        "digital_fingerprint": "cccc228d088f9d4ab571f032e489e06182efd62470796942a949ef04c7ae031b",
        "repair_actions_taken": [
          "Applied Dynamic String Concat Masking for NIK and Customer Name"
        ],
        "verifier_feedback": null
      },
      "execution": {
        "row_count": 35,
        "column_names": [
          "transaction_id",
          "transaction_date",
          "total_amount",
          "payment_method",
          "status",
          "customer_id",
          "customer_name_masked",
          "nik_masked",
          "phone_masked",
          "customer_segment",
          "city"
        ],
        "preview_rows": [
          {
            "transaction_id": "TRX-20260929-10013",
            "transaction_date": "2026-09-29 20:09:05",
            "total_amount": 15000000,
            "payment_method": "Credit Card",
            "status": "SUCCESS",
            "customer_id": "CUST-1090",
            "customer_name_masked": "Eko*** tyo",
            "nik_masked": "317840******3182",
            "phone_masked": "0812****414",
            "customer_segment": "PRIORITAS",
            "city": "Medan"
          },
          {
            "transaction_id": "TRX-20260928-10004",
            "transaction_date": "2026-09-28 08:54:26",
            "total_amount": 2500000,
            "payment_method": "Bank Transfer",
            "status": "SUCCESS",
            "customer_id": "CUST-1080",
            "customer_name_masked": "May*** ini",
            "nik_masked": "317156******9266",
            "phone_masked": "0812****777",
            "customer_segment": "PRIORITAS",
            "city": "Medan"
          },
          {
            "transaction_id": "TRX-20260924-10027",
            "transaction_date": "2026-09-24 21:54:14",
            "total_amount": 8900000,
            "payment_method": "QRIS",
            "status": "SUCCESS",
            "customer_id": "CUST-1001",
            "customer_name_masked": "Bam*** nto",
            "nik_masked": "317401******2510",
            "phone_masked": "0812****632",
            "customer_segment": "PRIORITAS",
            "city": "Bandung"
          },
          {
            "transaction_id": "TRX-20260920-10017",
            "transaction_date": "2026-09-20 16:14:52",
            "total_amount": 42000000,
            "payment_method": "Bank Transfer",
            "status": "SUCCESS",
            "customer_id": "CUST-1085",
            "customer_name_masked": "Agu*** wan",
            "nik_masked": "317609******6294",
            "phone_masked": "0812****582",
            "customer_segment": "PRIORITAS",
            "city": "Jakarta Selatan"
          },
          {
            "transaction_id": "TRX-20260919-10023",
            "transaction_date": "2026-09-19 20:41:51",
            "total_amount": 15000000,
            "payment_method": "Bank Transfer",
            "status": "SUCCESS",
            "customer_id": "CUST-1007",
            "customer_name_masked": "Dew*** ari",
            "nik_masked": "317380******2816",
            "phone_masked": "0812****235",
            "customer_segment": "PRIORITAS",
            "city": "Jakarta Selatan"
          },
          {
            "transaction_id": "TRX-20260912-10035",
            "transaction_date": "2026-09-12 15:48:30",
            "total_amount": 15000000,
            "payment_method": "Credit Card",
            "status": "SUCCESS",
            "customer_id": "CUST-1006",
            "customer_name_masked": "Ind*** ata",
            "nik_masked": "317258******5415",
            "phone_masked": "0812****355",
            "customer_segment": "PRIORITAS",
            "city": "Tangerang"
          },
          {
            "transaction_id": "TRX-20260825-10010",
            "transaction_date": "2026-08-25 10:41:06",
            "total_amount": 42000000,
            "payment_method": "Credit Card",
            "status": "SUCCESS",
            "customer_id": "CUST-1050",
            "customer_name_masked": "Bud*** oso",
            "nik_masked": "317835******4742",
            "phone_masked": "0812****409",
            "customer_segment": "PRIORITAS",
            "city": "Jakarta Selatan"
          },
          {
            "transaction_id": "TRX-20260818-10007",
            "transaction_date": "2026-08-18 21:03:42",
            "total_amount": 4750000,
            "payment_method": "Credit Card",
            "status": "SUCCESS",
            "customer_id": "CUST-1074",
            "customer_name_masked": "May*** ini",
            "nik_masked": "317206******3536",
            "phone_masked": "0812****901",
            "customer_segment": "PRIORITAS",
            "city": "Medan"
          },
          {
            "transaction_id": "TRX-20260816-10018",
            "transaction_date": "2026-08-16 18:18:11",
            "total_amount": 2500000,
            "payment_method": "Bank Transfer",
            "status": "SUCCESS",
            "customer_id": "CUST-1060",
            "customer_name_masked": "Bud*** oso",
            "nik_masked": "317927******2255",
            "phone_masked": "0812****907",
            "customer_segment": "PRIORITAS",
            "city": "Jakarta Selatan"
          },
          {
            "transaction_id": "TRX-20260816-10014",
            "transaction_date": "2026-08-16 08:45:30",
            "total_amount": 42000000,
            "payment_method": "QRIS",
            "status": "SUCCESS",
            "customer_id": "CUST-1010",
            "customer_name_masked": "Bud*** oso",
            "nik_masked": "317653******8799",
            "phone_masked": "0812****381",
            "customer_segment": "PRIORITAS",
            "city": "Surabaya"
          }
        ],
        "excel_path": "outputs\\DataExport_REQ_2026_KMK_114_20261011_221106.xlsx",
        "csv_path": "outputs\\DataExport_REQ_2026_KMK_114_20261011_221106.csv",
        "json_path": "outputs\\DataExport_REQ_2026_KMK_114_20261011_221106.json",
        "zip_path": "outputs\\DataFulfillment_REQ_2026_KMK_114_20261011_221106.zip",
        "certificate_path": "outputs\\Sertifikat_Otorisasi_REQ_2026_KMK_114_20261011_221106.pdf",
        "execution_time_ms": 92.5,
        "dialect": "PostgreSQL"
      }
    },
    "Permohonan_Data_Eksternal_Kemenkeu.pdf": {
      "success": true,
      "message": "Pemenuhan permohonan data berhasil diproses.",
      "spec": {
        "request_id": "REQ-2026-EKS-042",
        "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
        "requester_name": "Bambang Pratama, S.H., M.H.",
        "requester_department": "Eksternal Kemenkeu",
        "business_process": "Keberatan & Banding",
        "request_date": "10 Oktober 2026",
        "business_purpose": "Data",
        "primary_entity": "ekspor",
        "time_range_start": "01 Juli 2026",
        "time_range_end": "30 September 2026",
        "requested_fields": [
          {
            "name": "transaction_id",
            "description": "ID Transaksi",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          },
          {
            "name": "transaction_date",
            "description": "Tanggal Transaksi",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          },
          {
            "name": "customer_name",
            "description": "Nama Nasabah",
            "business_term": null,
            "pii_sensitive": true,
            "masking_rule": "MASK_PARTIAL"
          },
          {
            "name": "nik",
            "description": "NIK",
            "business_term": null,
            "pii_sensitive": true,
            "masking_rule": "MASK_PARTIAL"
          },
          {
            "name": "channel",
            "description": "Kanal Pembayaran",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          },
          {
            "name": "total_amount",
            "description": "Total Nominal",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          },
          {
            "name": "status",
            "description": "Status",
            "business_term": null,
            "pii_sensitive": false,
            "masking_rule": null
          }
        ],
        "filters": [
          {
            "field_description": "Status persetujuan pabean",
            "target_column": "status_pabean",
            "operator": "=",
            "value": "NPE",
            "rationale": "Dokumen ekspor yang selesai dan disetujui berstatus resmi NPE (Nota Pelayanan Ekspor)."
          },
          {
            "field_description": "Periode Transaksi",
            "target_column": "transaction_date",
            "operator": "BETWEEN",
            "value": [
              "01 Juli 2026",
              "30 September 2026"
            ],
            "rationale": "Filter rentang waktu 01 Juli 2026 s/d 30 September 2026"
          }
        ],
        "aggregation_level": "detail",
        "compliance_notes": "Data bersifat internal rahasia. Kolom PII (Nama, NIK, No HP) wajib dimasking untuk kepatuhan PDP/GDPR.",
        "raw_text_summary": "REPUBLIK INDONESIA\nKEJAKSAAN AGUNG RI / BADAN PENGAWAS KEUANGAN (EKSTERNAL)\n SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA\nNomor Surat Permintaan\n: REQ-2026-EKS-042\nTanggal Surat\n: 08 Oktober 2026\nNama Pejabat Pemohon\n: Bambang Pratama, S.H., M.H.\nUnit Kerja / Divisi\n: Eksternal Kemenkeu\nInstansi Pemohon\n: Jaksa Agung Muda Tindak Pidana Khusus (Satgassus)\nTipe Proses Bisnis\n: Ke..."
      },
      "catalog_match": {
        "selected_tables": [
          {
            "fqn": "dwh_ceisa.ekspor.fct_peb_ekspor",
            "service_name": "CEISA40-PostgreSQL-DWH",
            "database_name": "dwh_ceisa",
            "schema_name": "ekspor",
            "table_name": "fct_peb_ekspor",
            "description": "Tabel fakta transaksi ekspor barang, devisa hasil ekspor, dan dokumen PEB (Pemberitahuan Ekspor Barang BC 3.0).",
            "columns": [
              {
                "name": "nomor_aju",
                "data_type": "VARCHAR(32)",
                "description": "Nomor Pengajuan 26-digit Dokumen PEB BC 3.0",
                "tags": [
                  "PK",
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nomor_daftar",
                "data_type": "VARCHAR(16)",
                "description": "Nomor Pendaftaran PEB / Nopen 6 digit",
                "tags": [
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nomor_peb",
                "data_type": "VARCHAR(32)",
                "description": "Nomor Pendaftaran PEB (nopen)",
                "tags": [
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tanggal_daftar",
                "data_type": "TIMESTAMP",
                "description": "Tanggal pendaftaran dokumen ekspor PEB",
                "tags": [
                  "Temporal",
                  "PartitionKey"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tanggal_peb",
                "data_type": "TIMESTAMP",
                "description": "Tanggal pendaftaran dokumen ekspor",
                "tags": [
                  "Temporal"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kantor_ekspor",
                "data_type": "VARCHAR(64)",
                "description": "Kantor pabean pendaftaran ekspor (contoh: KPPBC TMP TANJUNG PERAK)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kantor_muat",
                "data_type": "VARCHAR(64)",
                "description": "Kantor pabean pemuatan barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kode_kantor",
                "data_type": "VARCHAR(8)",
                "description": "Kode kantor pabean pemuatan (contoh: 040300 - Tanjung Priok)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "npwp_eksportir",
                "data_type": "VARCHAR(20)",
                "description": "NPWP 15/16 digit perusahaan eksportir",
                "tags": [
                  "FK",
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_eksportir",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas badan usaha eksportir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "alamat_eksportir",
                "data_type": "VARCHAR(256)",
                "description": "Alamat domisili eksportir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "npwp_ppjk",
                "data_type": "VARCHAR(20)",
                "description": "NPWP Perusahaan Pengurusan Jasa Kepabeanan",
                "tags": [
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_ppjk",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas PPJK pengurus dokumen",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_penerima",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas penerima barang di luar negeri (Consignee)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_penerima",
                "data_type": "VARCHAR(64)",
                "description": "Negara domisili penerima barang",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nama_pembeli",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas pembeli di luar negeri (Buyer)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_pembeli",
                "data_type": "VARCHAR(64)",
                "description": "Negara domisili pembeli",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_tujuan",
                "data_type": "VARCHAR(64)",
                "description": "Negara tujuan akhir ekspor barang",
                "tags": [
                  "Dimension",
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "seri_barang",
                "data_type": "INTEGER",
                "description": "Nomor urut seri barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kode_hs",
                "data_type": "VARCHAR(16)",
                "description": "Klasifikasi pos tarif 8/10 digit HS Code (contoh: 7112999000)",
                "tags": [
                  "Dimension",
                  "Classification"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "uraian_barang",
                "data_type": "VARCHAR(500)",
                "description": "Uraian jenis dan spesifikasi komoditas barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jumlah_satuan",
                "data_type": "NUMERIC(18,4)",
                "description": "Jumlah kuantitas barang ekspor",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jenis_satuan",
                "data_type": "VARCHAR(16)",
                "description": "Satuan barang (KGM, PCS, TNE, dsb.)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "netto_barang",
                "data_type": "NUMERIC(18,4)",
                "description": "Berat bersih (Net Weight) barang (Kg)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "valuta",
                "data_type": "VARCHAR(8)",
                "description": "Kode valuta transaksi (USD, IDR, JPY, EUR)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kurs",
                "data_type": "NUMERIC(18,4)",
                "description": "Nilai kurs Keputusan Menteri Keuangan (KMK)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "fob_barang",
                "data_type": "NUMERIC(18,2)",
                "description": "Nilai Free On Board (FOB) barang dalam valuta",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nilai_fob_usd",
                "data_type": "NUMERIC(18,2)",
                "description": "Nilai Free on Board dalam valuta USD",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nilai_devisa_idr",
                "data_type": "NUMERIC(20,2)",
                "description": "Nilai devisa hasil ekspor ekuivalen Rupiah",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tarif_bea_keluar",
                "data_type": "NUMERIC(8,4)",
                "description": "Tarif pungutan Bea Keluar ekspor (Advalorem % atau spesifik)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "bea_keluar_barang",
                "data_type": "NUMERIC(18,2)",
                "description": "Nominal pungutan Bea Keluar ekspor barang (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "pph_ekspor_peb",
                "data_type": "NUMERIC(18,2)",
                "description": "Pajak Penghasilan (PPh Pasal 22) Ekspor (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jalur",
                "data_type": "VARCHAR(8)",
                "description": "Jalur pelayanan pabean: H (Hijau), K (Kuning), M (Merah)",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "status_pabean",
                "data_type": "VARCHAR(32)",
                "description": "Status persetujuan pabean: NPE, PERIKSA_FISIK, REVISI, BATAL",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "created_at",
                "data_type": "TIMESTAMP",
                "description": "Waktu data tersinkronisasi ke DWH CEISA",
                "tags": [
                  "System"
                ],
                "is_pii": false,
                "glossary_terms": []
              }
            ],
            "tier": "Tier 1 - Mission Critical",
            "owner": "Direktorat Teknis Kepabeanan & Subdit Ekspor",
            "lineage_upstream": [
              "staging_ceisa.stg_peb_header",
              "staging_ceisa.stg_nopen_online"
            ],
            "lineage_downstream": [
              "datamart_ceisa.dm_kinerja_ekspor_bulanan",
              "datamart_ceisa.dm_devisa_ekspor"
            ],
            "match_score": 1.0,
            "match_rationale": "Kesesuaian domain entitas permohonan: 'ekspor'; Cocok pada deskripsi tabel: 'ekspor'; Kolom mendukung entitas: 'ekspor'"
          },
          {
            "fqn": "dwh_ceisa.fasilitas.fct_transactions",
            "service_name": "CEISA40-PostgreSQL-DWH",
            "database_name": "dwh_ceisa",
            "schema_name": "fasilitas",
            "table_name": "fct_transactions",
            "description": "Tabel fakta transaksi fasilitas kepabeanan (KITE, Kawasan Berikat, Kemudahan Ekspor/Impor) dan transaksi pabean terintegrasi, memuat tarif pembebasan, bea keluar/masuk, devisa, dan kelengkapan dokumen.",
            "columns": [
              {
                "name": "nomor_aju",
                "data_type": "VARCHAR(32)",
                "description": "Nomor Pengajuan 26-digit Dokumen PEB BC 3.0",
                "tags": [
                  "PK",
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nomor_daftar",
                "data_type": "VARCHAR(16)",
                "description": "Nomor Pendaftaran PEB / Nopen resmi 6 digit",
                "tags": [
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tanggal_daftar",
                "data_type": "TIMESTAMP",
                "description": "Tanggal pendaftaran dokumen ekspor PEB",
                "tags": [
                  "Temporal",
                  "PartitionKey"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kantor_ekspor",
                "data_type": "VARCHAR(64)",
                "description": "Kantor pabean pendaftaran ekspor (contoh: KPPBC TMP TANJUNG PERAK)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kantor_muat",
                "data_type": "VARCHAR(64)",
                "description": "Kantor pabean pemuatan barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "npwp_eksportir",
                "data_type": "VARCHAR(20)",
                "description": "NPWP 15/16 digit perusahaan eksportir",
                "tags": [
                  "FK",
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_eksportir",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas badan usaha eksportir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "alamat_eksportir",
                "data_type": "VARCHAR(256)",
                "description": "Alamat domisili eksportir",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "npwp_ppjk",
                "data_type": "VARCHAR(20)",
                "description": "NPWP Perusahaan Pengurusan Jasa Kepabeanan (PPJK)",
                "tags": [
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_ppjk",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas PPJK pengurus dokumen",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_penerima",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas penerima barang di luar negeri (Consignee)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_penerima",
                "data_type": "VARCHAR(64)",
                "description": "Negara domisili penerima barang",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "nama_pembeli",
                "data_type": "VARCHAR(128)",
                "description": "Nama entitas pembeli di luar negeri (Buyer)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_pembeli",
                "data_type": "VARCHAR(64)",
                "description": "Negara domisili pembeli",
                "tags": [
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "negara_tujuan",
                "data_type": "VARCHAR(64)",
                "description": "Negara tujuan akhir ekspor barang",
                "tags": [
                  "Dimension",
                  "Geography"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "seri_barang",
                "data_type": "INTEGER",
                "description": "Nomor urut seri barang ekspor dalam PEB",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kode_hs",
                "data_type": "VARCHAR(16)",
                "description": "Klasifikasi pos tarif 8/10 digit HS Code (contoh: 7112999000)",
                "tags": [
                  "Dimension",
                  "Classification"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "uraian_barang",
                "data_type": "VARCHAR(500)",
                "description": "Uraian jenis dan spesifikasi komoditas barang ekspor",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jumlah_satuan",
                "data_type": "NUMERIC(18,4)",
                "description": "Jumlah kuantitas barang ekspor",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jenis_satuan",
                "data_type": "VARCHAR(16)",
                "description": "Satuan barang (KGM, PCS, TNE, dsb.)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "netto_barang",
                "data_type": "NUMERIC(18,4)",
                "description": "Berat bersih (Net Weight) barang (Kg)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "valuta",
                "data_type": "VARCHAR(8)",
                "description": "Kode valuta transaksi (USD, IDR, JPY, EUR)",
                "tags": [
                  "Dimension"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kurs",
                "data_type": "NUMERIC(18,4)",
                "description": "Nilai kurs Keputusan Menteri Keuangan (KMK)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "fob_barang",
                "data_type": "NUMERIC(18,2)",
                "description": "Nilai Free On Board (FOB) barang dalam valuta",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tarif_bea_keluar",
                "data_type": "NUMERIC(8,4)",
                "description": "Tarif pungutan Bea Keluar ekspor (Advalorem % atau spesifik)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "bea_keluar_barang",
                "data_type": "NUMERIC(18,2)",
                "description": "Nominal pungutan Bea Keluar ekspor barang (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "pph_ekspor_peb",
                "data_type": "NUMERIC(18,2)",
                "description": "Pajak Penghasilan (PPh Pasal 22) Ekspor (Rupiah)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "jalur",
                "data_type": "VARCHAR(8)",
                "description": "Jalur pelayanan pabean: H (Hijau), K (Kuning), M (Merah)",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "status_pabean",
                "data_type": "VARCHAR(32)",
                "description": "Status persetujuan pabean: NPE, PERIKSA_FISIK, REVISI, BATAL",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "transaction_id",
                "data_type": "VARCHAR(64)",
                "description": "Alias ID transaksi unik (sesuai nomor_aju)",
                "tags": [
                  "PK",
                  "Core"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "customer_id",
                "data_type": "VARCHAR(32)",
                "description": "Alias ID entitas (sesuai npwp_eksportir)",
                "tags": [
                  "FK"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "transaction_date",
                "data_type": "TIMESTAMP",
                "description": "Alias waktu transaksi (sesuai tanggal_daftar)",
                "tags": [
                  "Temporal"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "total_amount",
                "data_type": "NUMERIC(18,2)",
                "description": "Alias total nilai transaksi (sesuai fob_barang / devisa)",
                "tags": [
                  "Metric"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "status",
                "data_type": "VARCHAR(32)",
                "description": "Alias status dokumen transaksi (sesuai status_pabean)",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "created_at",
                "data_type": "TIMESTAMP",
                "description": "Waktu record dibuat di DWH",
                "tags": [
                  "System"
                ],
                "is_pii": false,
                "glossary_terms": []
              }
            ],
            "tier": "Tier 1 - Mission Critical",
            "owner": "Direktorat Fasilitas Kepabeanan",
            "lineage_upstream": [
              "staging_ceisa.stg_peb_header",
              "staging_ceisa.stg_peb_barang",
              "staging_ceisa.stg_fasilitas_kite"
            ],
            "lineage_downstream": [
              "datamart_ceisa.dm_kinerja_ekspor_bulanan",
              "datamart_ceisa.dm_fasilitas_tpb"
            ],
            "match_score": 1.0,
            "match_rationale": "Cocok pada deskripsi tabel: 'ekspor'; Kolom mendukung entitas: 'total_amount'; Kolom mendukung entitas: 'transaction_date'"
          },
          {
            "fqn": "dwh_ceisa.master.dim_perusahaan",
            "service_name": "CEISA40-PostgreSQL-DWH",
            "database_name": "dwh_ceisa",
            "schema_name": "master",
            "table_name": "dim_perusahaan",
            "description": "Master data profil eksportir, importir, PPJK, dan pengusaha barang kena cukai terdaftar di CEISA & DJP.",
            "columns": [
              {
                "name": "npwp_perusahaan",
                "data_type": "VARCHAR(20)",
                "description": "Nomor Pokok Wajib Pajak 16 digit",
                "tags": [
                  "PK",
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nama_perusahaan",
                "data_type": "VARCHAR(128)",
                "description": "Nama resmi badan hukum perusahaan",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "alamat_domisili",
                "data_type": "VARCHAR(256)",
                "description": "Alamat kantor pusat",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nik_penanggung_jawab",
                "data_type": "VARCHAR(16)",
                "description": "NIK pimpinan/penanggung jawab",
                "tags": [
                  "PII",
                  "Restricted"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "email_korespondensi",
                "data_type": "VARCHAR(128)",
                "description": "Email resmi perusahaan",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "nomor_telepon",
                "data_type": "VARCHAR(32)",
                "description": "Nomor kontak telepon",
                "tags": [
                  "PII"
                ],
                "is_pii": true,
                "glossary_terms": []
              },
              {
                "name": "status_registrasi",
                "data_type": "VARCHAR(32)",
                "description": "Status registrasi kepabeanan: AKTIF, BLOKIR, DIBEKUKAN",
                "tags": [
                  "Dimension",
                  "Filter"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "kategori_layanan_aeo",
                "data_type": "VARCHAR(32)",
                "description": "Kategori fasilitas: AEO, MITA_PRIORITAS, REGULER",
                "tags": [
                  "Dimension",
                  "Classification"
                ],
                "is_pii": false,
                "glossary_terms": []
              },
              {
                "name": "tanggal_terdaftar",
                "data_type": "DATE",
                "description": "Tanggal perolehan NIB/Akses Kepabeanan",
                "tags": [
                  "Temporal"
                ],
                "is_pii": false,
                "glossary_terms": []
              }
            ],
            "tier": "Tier 1 - Master Data",
            "owner": "Subdit Pengelolaan Data & Layanan Informasi",
            "lineage_upstream": [
              "staging_ceisa.stg_profil_perusahaan_kemenkeu"
            ],
            "lineage_downstream": [
              "dwh_ceisa.ekspor.fct_peb_ekspor",
              "dwh_ceisa.impor.fct_pib_impor",
              "dwh_ceisa.cukai.fct_billing_cukai"
            ],
            "match_score": 0.85,
            "match_rationale": "Cocok pada deskripsi tabel: 'ekspor'; Kolom mendukung entitas: 'status'; Kolom mendukung entitas: 'nik'"
          }
        ],
        "join_strategy": [
          {
            "left_table": "fct_peb_ekspor",
            "right_table": "dim_perusahaan",
            "join_type": "INNER JOIN",
            "on_condition": "fct_peb_ekspor.npwp_eksportir = dim_perusahaan.npwp_perusahaan"
          },
          {
            "left_table": "fct_transactions",
            "right_table": "dim_perusahaan",
            "join_type": "INNER JOIN",
            "on_condition": "fct_transactions.npwp_eksportir = dim_perusahaan.npwp_perusahaan"
          }
        ],
        "unmapped_fields": [],
        "match_summary": "Ditemukan 3 tabel metadata resmi di OpenMetadata yang relevan dengan 'ekspor'."
      },
      "generated_sql": {
        "dialect": "PostgreSQL",
        "query": "-- ====================================================================\n-- Query Otomatis Dibuat oleh DataRequest2Agent\n-- Berdasarkan Dokumen: SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA (ID: REQ-2026-EKS-042)\n-- Pemohon: Bambang Pratama, S.H., M.H. (Eksternal Kemenkeu)\n-- Metadata Divalidasi via: OpenMetadata Service CEISA40-PostgreSQL-DWH\n-- Target Database: PostgreSQL\n-- ====================================================================\n\nSELECT\n    t.nomor_peb,\n    CONCAT(SUBSTRING(t.npwp_eksportir, 1, 6), '******', SUBSTRING(t.npwp_eksportir, LENGTH(t.npwp_eksportir)-3, 4)) AS npwp_eksportir_masked,\n    t.nilai_devisa_idr,\n    t.status_pabean,\n    c.kategori_layanan_aeo,\n    CONCAT(SUBSTRING(c.nik_penanggung_jawab, 1, 6), '******', SUBSTRING(c.nik_penanggung_jawab, 13, 4)) AS nik_penanggung_jawab_masked\nFROM dwh_ceisa.ekspor.fct_peb_ekspor AS t\nINNER JOIN dwh_ceisa.master.dim_perusahaan AS s\n    ON t.npwp_eksportir = s.npwp_perusahaan\nINNER JOIN dwh_ceisa.master.dim_perusahaan AS s\n    ON fct_transactions.npwp_eksportir = s.npwp_perusahaan\nWHERE\n    t.tanggal_peb >= '01 Juli 2026 00:00:00'\n  AND t.tanggal_peb <= '30 September 2026 23:59:59'\n  AND t.status_pabean = 'NPE'\nORDER BY\n    t.tanggal_peb DESC\nLIMIT 500;",
        "explanation": "Query disusun untuk database PostgreSQL dengan menggabungkan tabel fakta `fct_peb_ekspor` dan tabel dimensi `fct_transactions, dim_perusahaan`. Filter diaplikasikan secara ketat sesuai spesifikasi dokumen permohonan. Atribut PII (Nama, NIK, NPWP, No Telepon) telah diproteksi dengan fungsi masking dinamis sesuai kepatuhan UU PDP & kerahasiaan data kepabeanan/perpajakan.",
        "selected_columns": [
          "nomor_peb",
          "npwp_eksportir_masked",
          "nilai_devisa_idr",
          "status_pabean",
          "kategori_layanan_aeo",
          "nik_penanggung_jawab_masked"
        ],
        "applied_filters": [
          "Rentang Tanggal: 01 Juli 2026 s/d 30 September 2026",
          "status_pabean = 'NPE'"
        ],
        "tables_used": [
          "dwh_ceisa.ekspor.fct_peb_ekspor",
          "dwh_ceisa.fasilitas.fct_transactions",
          "dwh_ceisa.master.dim_perusahaan"
        ]
      },
      "verification": {
        "status": "APPROVED",
        "checks": [
          {
            "category": "Safety",
            "item": "Destructive SQL Operations Guard",
            "passed": true,
            "details": "Query dijamin hanya bersifat Read-Only (SELECT). Tidak ada perintah destruktif.",
            "severity": "HIGH"
          },
          {
            "category": "Safety",
            "item": "Result Set Boundary (LIMIT / FETCH FIRST Clause)",
            "passed": true,
            "details": "Klausa pembatas baris (LIMIT / FETCH FIRST) disertakan untuk membatasi konsumsi memori dan beban komputasi database.",
            "severity": "MEDIUM"
          },
          {
            "category": "Safety",
            "item": "Cartesian Product Guard",
            "passed": true,
            "details": "Relasi antar-tabel menggunakan INNER/LEFT JOIN eksplisit dengan klausul ON yang tervalidasi.",
            "severity": "HIGH"
          },
          {
            "category": "Fidelity",
            "item": "Date Range Requirement Fidelity",
            "passed": true,
            "details": "Rentang waktu (01 Juli 2026 s/d 30 September 2026) tertera persis pada klausa WHERE.",
            "severity": "HIGH"
          },
          {
            "category": "Fidelity",
            "item": "Business Filter Criteria Fidelity",
            "passed": true,
            "details": "Semua kondisi filter spesifik dari dokumen permohonan telah diaplikasikan ke klausa WHERE.",
            "severity": "HIGH"
          },
          {
            "category": "PII/Governance",
            "item": "Data Privacy & Dynamic Masking Guard",
            "passed": true,
            "details": "Atribut PII (Nama, NIK, NPWP, No Telepon) telah diproteksi dengan masking dinamis/pseudonim.",
            "severity": "HIGH"
          },
          {
            "category": "Syntax/Schema",
            "item": "OpenMetadata Schema Grounding",
            "passed": true,
            "details": "Semua tabel yang digunakan terdaftar resmi di OpenMetadata Catalog.",
            "severity": "HIGH"
          }
        ],
        "verifier_id": "Agent-Independent-Auditor-v2",
        "verifier_timestamp": "2026-10-11T15:11:06.617126+00:00",
        "executive_summary": "Verifikasi independen selesai dengan status APPROVED. Total 7 parameter kepatuhan diuji (7/7 lolos - 100% kepatuhan). Query memenuhi standar fidelity permohonan data dan proteksi keamanan DWH.",
        "compliance_score": 100,
        "digital_fingerprint": "f8c5fd6a16cf5bdfe120d2d4f044c10df37e093ce7dfd30651ce041fb816166f",
        "repair_actions_taken": [
          "Applied Dynamic String Concat Masking for NIK and Customer Name"
        ],
        "verifier_feedback": null
      },
      "execution": {
        "row_count": 35,
        "column_names": [
          "transaction_id",
          "transaction_date",
          "total_amount",
          "payment_method",
          "status",
          "customer_id",
          "customer_name_masked",
          "nik_masked",
          "phone_masked",
          "customer_segment",
          "city"
        ],
        "preview_rows": [
          {
            "transaction_id": "TRX-20260924-10009",
            "transaction_date": "2026-09-24 19:14:01",
            "total_amount": 65000000,
            "payment_method": "Credit Card",
            "status": "SUCCESS",
            "customer_id": "CUST-1001",
            "customer_name_masked": "Agu*** wan",
            "nik_masked": "317100******8832",
            "phone_masked": "0812****402",
            "customer_segment": "PRIORITAS",
            "city": "Bandung"
          },
          {
            "transaction_id": "TRX-20260922-10013",
            "transaction_date": "2026-09-22 16:00:52",
            "total_amount": 65000000,
            "payment_method": "Credit Card",
            "status": "SUCCESS",
            "customer_id": "CUST-1002",
            "customer_name_masked": "Hen*** aya",
            "nik_masked": "317151******1922",
            "phone_masked": "0812****136",
            "customer_segment": "PRIORITAS",
            "city": "Bandung"
          },
          {
            "transaction_id": "TRX-20260921-10006",
            "transaction_date": "2026-09-21 21:25:00",
            "total_amount": 27500000,
            "payment_method": "Bank Transfer",
            "status": "SUCCESS",
            "customer_id": "CUST-1072",
            "customer_name_masked": "Agu*** wan",
            "nik_masked": "317820******5853",
            "phone_masked": "0812****109",
            "customer_segment": "PRIORITAS",
            "city": "Medan"
          },
          {
            "transaction_id": "TRX-20260917-10004",
            "transaction_date": "2026-09-17 17:00:17",
            "total_amount": 2500000,
            "payment_method": "QRIS",
            "status": "SUCCESS",
            "customer_id": "CUST-1056",
            "customer_name_masked": "Eko*** tyo",
            "nik_masked": "317147******6994",
            "phone_masked": "0812****991",
            "customer_segment": "PRIORITAS",
            "city": "Semarang"
          },
          {
            "transaction_id": "TRX-20260916-10008",
            "transaction_date": "2026-09-16 12:31:19",
            "total_amount": 27500000,
            "payment_method": "QRIS",
            "status": "SUCCESS",
            "customer_id": "CUST-1094",
            "customer_name_masked": "Rin*** ina",
            "nik_masked": "317357******3425",
            "phone_masked": "0812****540",
            "customer_segment": "PRIORITAS",
            "city": "Surabaya"
          },
          {
            "transaction_id": "TRX-20260913-10002",
            "transaction_date": "2026-09-13 09:58:09",
            "total_amount": 42000000,
            "payment_method": "QRIS",
            "status": "SUCCESS",
            "customer_id": "CUST-1040",
            "customer_name_masked": "Bam*** nto",
            "nik_masked": "317735******1187",
            "phone_masked": "0812****533",
            "customer_segment": "PRIORITAS",
            "city": "Bandung"
          },
          {
            "transaction_id": "TRX-20260907-10027",
            "transaction_date": "2026-09-07 17:10:27",
            "total_amount": 8900000,
            "payment_method": "Bank Transfer",
            "status": "SUCCESS",
            "customer_id": "CUST-1069",
            "customer_name_masked": "Eko*** tyo",
            "nik_masked": "317616******2790",
            "phone_masked": "0812****240",
            "customer_segment": "PRIORITAS",
            "city": "Jakarta Selatan"
          },
          {
            "transaction_id": "TRX-20260904-10035",
            "transaction_date": "2026-09-04 10:46:23",
            "total_amount": 42000000,
            "payment_method": "QRIS",
            "status": "SUCCESS",
            "customer_id": "CUST-1011",
            "customer_name_masked": "Dew*** ari",
            "nik_masked": "317488******4592",
            "phone_masked": "0812****384",
            "customer_segment": "PRIORITAS",
            "city": "Semarang"
          },
          {
            "transaction_id": "TRX-20260831-10020",
            "transaction_date": "2026-08-31 11:18:58",
            "total_amount": 42000000,
            "payment_method": "QRIS",
            "status": "SUCCESS",
            "customer_id": "CUST-1098",
            "customer_name_masked": "May*** ini",
            "nik_masked": "317468******4200",
            "phone_masked": "0812****916",
            "customer_segment": "PRIORITAS",
            "city": "Semarang"
          },
          {
            "transaction_id": "TRX-20260821-10022",
            "transaction_date": "2026-08-21 21:58:53",
            "total_amount": 15000000,
            "payment_method": "Bank Transfer",
            "status": "SUCCESS",
            "customer_id": "CUST-1088",
            "customer_name_masked": "Bam*** nto",
            "nik_masked": "317410******7770",
            "phone_masked": "0812****454",
            "customer_segment": "PRIORITAS",
            "city": "Tangerang"
          }
        ],
        "excel_path": "outputs\\DataExport_REQ_2026_EKS_042_20261011_221106.xlsx",
        "csv_path": "outputs\\DataExport_REQ_2026_EKS_042_20261011_221106.csv",
        "json_path": "outputs\\DataExport_REQ_2026_EKS_042_20261011_221106.json",
        "zip_path": "outputs\\DataFulfillment_REQ_2026_EKS_042_20261011_221106.zip",
        "certificate_path": "outputs\\Sertifikat_Otorisasi_REQ_2026_EKS_042_20261011_221106.pdf",
        "execution_time_ms": 119.12,
        "dialect": "PostgreSQL"
      }
    }
  }
};
