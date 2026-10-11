window.MOCK_DATA = {
  "samples": [
    {
      "filename": "Permohonan_Data_Internal_Bea_dan_Cukai.pdf",
      "title": "Permohonan Data Internal Bea dan Cukai",
      "size_bytes": 3350
    },
    {
      "filename": "Permohonan_Data_Internal_Kemenkeu.pdf",
      "title": "Permohonan Data Internal Kemenkeu",
      "size_bytes": 3109
    },
    {
      "filename": "Permohonan_Data_Eksternal_Kemenkeu.pdf",
      "title": "Permohonan Data Eksternal Kemenkeu",
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
      "id": "REQ-1791737759",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-11 23:55:59",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 160.6,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "426a81f3e90c4707cd63f9cec429526a93dd87e3bdb5614ff287ca33b09a4979",
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_235558.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_235558.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791737315",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 23:48:35",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 125.6,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "4aed111c0b1bcaa276001c884e58ec354e138868f96226f585113edeb0c964db",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_234835.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_234835.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791736946",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 23:42:26",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 130.2,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "d6a76a5395b3c665d7609af68bd1fa5525191ddad0ef67c864168520c408619b",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_234226.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_234226.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791736533",
      "request_id": "REQ-2026-BC-089",
      "document_title": "FORMULIR RESMI PERMOHONAN AKSES & EKSTRAKSI DATA KEPABEANAN",
      "requester_name": "Ahmad Fauzi, S.Kom",
      "department": "Internal Bea dan Cukai",
      "business_process": "Ekspor",
      "created_at": "2026-10-11 23:35:33",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 178.7,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "7f0da83b97d1ddab27e8b123f0c4527a02d1424a4f27df4032a901ec9d39c69e",
      "excel_filename": "DataExport_REQ_2026_BC_089_20261011_233532.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_BC_089_20261011_233532.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791736080",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 23:28:00",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 176.8,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "94d6b2e8971a9a328bd2eaa1a1fccca025a6fcd3d93a14d79cc95fa23178f171",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_232759.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_232759.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791735005",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 23:10:05",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 101.9,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "94d9f68a15fc474aa1a1e189e8095355656b23302c6d527ff5780b6a9f190f9a",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_231005.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_231005.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791734969",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 23:09:29",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 108.7,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "6e9d3e4082d689ee4995b8f1ad1259c2f132181d677f879c9f5df9edaabddcea",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_230929.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_230929.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
    {
      "id": "REQ-1791732530",
      "request_id": "REQ-2026-EKS-042",
      "document_title": "SURAT PERMINTAAN DATA DUKUNG PENGAWASAN & AUDIT KEPATUHAN NEGARA",
      "requester_name": "Bambang Pratama, S.H., M.H.",
      "department": "Eksternal Kemenkeu",
      "business_process": "Keberatan & Banding",
      "created_at": "2026-10-11 22:28:50",
      "status": "APPROVED",
      "row_count": 35,
      "execution_time_ms": 95.4,
      "dialect": "PostgreSQL",
      "compliance_score": 100,
      "digital_fingerprint": "994cfba863f3665bde950c9a283dcb8088f7140590c383e090c35be147b4a4db",
      "excel_filename": "DataExport_REQ_2026_EKS_042_20261011_222850.xlsx",
      "zip_filename": "DataFulfillment_REQ_2026_EKS_042_20261011_222850.zip",
      "reviewer_name": null,
      "reviewer_role": null,
      "comments": "Menunggu review verifikator"
    },
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
    "total_requests": 62,
    "approved_count": 52,
    "revision_count": 5,
    "rejected_count": 5,
    "compliance_rate_pct": 83.9,
    "total_rows_delivered": 2170,
    "avg_latency_ms": 67.2,
    "digital_seal_count": 52,
    "digital_seal_pct": 83.9,
    "pii_columns_protected_count": 372,
    "pii_breakdown": {
      "npwp_masked": 124,
      "nik_masked": 62,
      "nama_masked": 124,
      "phone_masked": 62
    },
    "pdp_compliance_pct": 100.0,
    "department_distribution": {
      "Internal Bea dan Cukai": 37,
      "Internal Kemenkeu": 12,
      "Eksternal Kemenkeu": 13
    },
    "status_distribution": {
      "Disetujui Resmi": 52,
      "Membutuhkan Revisi": 5,
      "Ditolak / Disangkal": 5
    },
    "business_process_distribution": {
      "Ekspor (PEB BC 3.0)": 54,
      "Impor (PIB BC 2.0)": 4,
      "Cukai (BKC)": 2,
      "Manifest (BC 1.1)": 2,
      "TPB / Fasilitas Berikat": 0
    },
    "dialect_distribution": {
      "PostgreSQL": 62,
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
        "total": 25,
        "approved": 23,
        "rows": 875
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
        "value": 6.5,
        "formatted": "+6.5%",
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
        "value": 49.3,
        "formatted": "+49.3%",
        "direction": "up"
      },
      "digital_seal": {
        "value": 6.5,
        "formatted": "+6.5%",
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
  },
  "artifacts_base64": {
    "DataExport_REQ_2026_BC_089_20261011_221106.xlsx": "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",
    "Sertifikat_Otorisasi_REQ_2026_BC_089_20261011_221106.pdf": "JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIgL0Y0IDUgMCBSIC9GNSA2IDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQmFzZUZvbnQgL0NvdXJpZXIgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YzIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNSAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1PYmxpcXVlIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GNCAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0Jhc2VGb250IC9UaW1lcy1Sb21hbiAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjUgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago3IDAgb2JqCjw8Ci9Db250ZW50cyAxMSAwIFIgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXSAvUGFyZW50IDEwIDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgMTAgMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago5IDAgb2JqCjw8Ci9BdXRob3IgKFwoYW5vbnltb3VzXCkpIC9DcmVhdGlvbkRhdGUgKEQ6MjAyNjEwMTEyMzAzMzArMDcnMDAnKSAvQ3JlYXRvciAoXCh1bnNwZWNpZmllZFwpKSAvS2V5d29yZHMgKCkgL01vZERhdGUgKEQ6MjAyNjEwMTEyMzAzMzArMDcnMDAnKSAvUHJvZHVjZXIgKFJlcG9ydExhYiBQREYgTGlicmFyeSAtIFwob3BlbnNvdXJjZVwpKSAKICAvU3ViamVjdCAoXCh1bnNwZWNpZmllZFwpKSAvVGl0bGUgKFwoYW5vbnltb3VzXCkpIC9UcmFwcGVkIC9GYWxzZQo+PgplbmRvYmoKMTAgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA3IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKMTEgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggNDU3NAo+PgpzdHJlYW0KR2F1MEk+P0JRTSZxODAxa1ZFYHJSK11pYj5CZXFfMHU7ZmVnV1owTlJzYmlNIVFBL1FIcUApcWY1SihYWHU5Qi9NNWgxYFlSbzc3PFJrR15cZz1xUW5ESHI+aHNbRi8qMCVuUU0lV0Y9ZDNrVWgpMlFcTmtgK0hzckMzb20lJGNZSSElcyJJRTQmIjQ/XTprJE1fQl0yJWNRVHVcOlFgRSEpbkx0RmRyVEsnJTN1XyNvUC0rOCJsPS1NblFIdE11S1kmN1wqQ0hTRnQxMmM5KCU8KjwvWjomLExkIUw0LklhNExsQThec1ZVW29OQC5QJkdzY20iIj9JTWY1ak1gPChlXlMwTS1AL1VtSEJXTkooOC4mOjUhR2g0Vl4mTSYlU0IvPENcUFUuImooaDkrVFkyXTIzYHFJY0BdKSJgUCFJO3EtVSlZQWVTX1gkJkluKyxWSkYnND9bQFcoJlosXDMsZF0/TTU5K1JzczxTPGBKOkRVKSZTa048dTsjamczV10hc3JtRzpwS2pkQi5RVEciMC5TQHI9M1QvPnFJSmYlRD1PVjpYXVdTOkNRLilDXjdUYDcmXSsoV2BoRDkrOVtqLkJENCNFMT9aTidaMWBIIkhlTVcyN0kqN2xTKGtgOUc+YEpbSjxNJ0RtWlFRPCU6NiVKXzZyaGtNanI0RG5IRlBtYSRkLT9JYVVRTW5mcGxbVmluZ1daaHMpI20xIkhPOFVZKiJJOV5kZVdrJWFwRl4rLWZqInNXcTZLY3A5WDxjUjI8OihiUF1BQC0pRmMvT0EjSl4tOUtkMThvW2VaZkZFQjUjSUFkWzpcZClRKW1WR2tDNERHQG1mbEZKM0JESCcyL1hwOzRERGhDMls6aWdoOTsoSjYvcCJ1L0pKTiUhM3BtTipVUlYhOnJKKCUmX3VKJiRBPEs+IUhzYGBsMEVmbHRPXy0/Ty5ddT51WF83YkBMMkchckQ+QGhqQ2c5bTxvIzYjTGVML1RoVCUlYi5kWDolRzVILkdJY2g1QmolREVQPy09PjFNNl9GJUopIl1Kbmk5Q2w5InJDQD09LWtSLDtQU0cnTGpDM1ZcNzpXJS0ySXJCO0hlJ1JFQGU5YXEvbDxhLyRqOSpGK3ArTls8L1Q+THVdWk9ORWJjbEZuXTZhLnFtLTcobUtCXilRdDQkblNHTSJrMjAlXUNXYSUiQlQ5RV4lTjtdNWIqZlZeRjVBIj9vQDQkbTNiUUBlJjVrbWFDY0U/SyYsZVFQVChUNko4JWZDO25WU0srZlZfMGNDbW1YSz0xcC5LbVRvUyErK0pkaio4IyNsWTNuREdaYHVMMzxyV2tQYERFL05WUVZCY0hPTk8nUGY0N1pra29LSyVgRUFXVi0iRzhsQTFHLmYhL1I3bzZIYGVNUEU5SWovYHNOZUtpbypCSSNwKT5WUl8iRWNGNzcvYjRUVC5NY1UjR1pFIk1Ra1UnIkRtRlZWYyFPPmtPI1lXbUk5cUkyWU9oPmFJVDoiOyN0RVFYQ1RXVydBYks6LWleYVhtPWM6cm1ZTSclTShCNSoxakVqYF5WKDFVbmw8WlVoXz89JkkzI0UlXEsqKD1QUjg3Ym1IJC9mcVs1RWBqb0BZbWsvLipNNm5LZnVgck1LRy5sKWAiQ0FjaCc7IkxhNSkwZSg3bDBRaWRYTWhTXC1UPWtzZHBxPGZibzVaMFFZOFxabTZmQVRwRUM4W3I3LFE2JUNLJ1JYK0pgOEAqKTlvYkYiVEw0YSpmYVVrWzA/cm1mcl9mQi4sdCFvRVA+QFhhZ1xPWGwwOXAmPmpSTGZgSGFPKUk7RV5VKGkoWWRCIS1BUHJRU25OJnBdWVxfUVk/ajg6P11EZkZLN049MEVEcyw2bSwrbVE3SVo8VzZkNFlcSydpKS42SzdUSGpabyhKPWVXVU5gYDZTRlVPVF9xNFhnW2JuPG1vUlE1Wmh0LUwsbkpvcF9iISZKKkEyVT1mLW04QD1uO29OIydCPiE1c1UkTWFNdW5zXDpVPituZyw4Qy4uKkdAcV9UckFcYGdvVk8wZV5qKjdERmlEYm5SMHJCLEZRLi41JUNfbXFiTygoV1ZCZUNyTjwoJkdiJz9YTDYjNFJNPmQzXXVZdEZGLmByVzBjZEVXX1ZQLU5mUjFiWnAhUGIjXG5nWTFeI1sjJDxfcyE3KCRwUTlJc0k5Ny1iN0JBcUokZVwwSU5EJl03SzdZS2wnTnBaVCR1N2xBOHBeaWozK0tKNCRtRVRnU1xlOzBuW2s6OyJLXnFoZ2VyKVJEKTBwJEReVitgJTVqYDMzaik6WEY8TShWJmBgTyhfZ1dfRDRRb1kjc1ooQlQlZkFIaSMmSWU/Zz5iMls6NWdbO24mPlxQZCNpZUtQdWpmPHNJRFssNlpHcUBmPysxNE5aa1NZRFo1Rm0pdCMvWXI3MWJjKWMzQFtbR15wO2k1OS9FMD03bERIPTVAIiowZzlsa0ttPTBmRWdHKEkvRzFZU3IlYkdNVFpbMyRNYEE0ZT0zSF8+ST8oNUJcNCEmTDwjRyhZSXMxdTg5JFpoIlRjLi4xV2ZHVV88OVdFRnUlXCJAcTRnTlVRaD4rI3RAa1daX0c2I29kPGJlPTFOQWk0PyQuOStFYXVHWWAmNEpkOTNaMDFUMzIyXkJsK2k1LkllUzdBKlFeIStQL0xjUGAoc249WiZGcDYuTHJPRjlAIixZYyU7NSUtb1JbPkovKmdlPS5ZOk9ZWWxBOTVvT2ZQNzhUMmQpU3VbXC1RS20xKSpsRXQiTShuKm9hTW1DYUFrOWVtbjhwMlAhYzA1IyEsOz5oWj45bU84c1tJK11dL3E9cGJKOGQiQk9WcUI2NF5kW2s+MDdvZC0qYUVAYj04LEgrdFhWKHUsbnRoQSErRTFHRk4sI0kkL2p1JkxcV0ZjU24vYVFPLTZcLkgwJXIqaDcxcilROmxjY2M7VVVLMWYwVm5CVSQ2U1hnPSo8OVcjLkZoQy82SkY1XWl1cSI4VUM6ZFFrJnNPTiQzdStNKGgnSmBxLUoiJ01Tcl4/RytsPnQlZ0lkQlEiZGJJJWdpJVA2ZC5GPWNgQ29NMEs8NyRsJVY6YjxgRHFwXC5WYzltamctU2deSDorUiNGaytNamVdTCxdRUFLQGRFWTEwMmdqS11SOmFnaUgtYVo6Sy5RSG5sciZ1IWNDTSUjUmpVK2tDISQzUU87MURZazBCJ2NiVzY4PjhSM1lbVExrZEVnPVRoPytMUjBLcGcwTSRtXTZcZSI2ZSJJYzlYYHQ3cTd1MFNOTypgWEFyP3U2bj4sTVQ4LXAra01eaUlgPEo3V0xRIy04QENRU2FfKm0iUCpSIi4mT0kidFhqYzNwZHFmIjAnLW86LGlSbGArZ0NXPm85cU4qNERiVFxXQztlZ1k1QGUva10rYERAImxZMDRJLkwvO0I4KCEvMlNPTm9gUztoPU49LjFMT1hZVFFfVXI4OUFwYGlMbi5WbV49M2dAMjJOU2MpITBxLlotM2lZU3EmZjZAKEBvK2hdaz4vLUkiKi5gKydWKHJYOT8yQGBAMzNESlsvWFphYlFiQDJXPyQxdE4qJSghZWo9RV0oUD06P0VyIy5ZXlJrdV5KVjNnP0JoaC0+dT89Si4/RWVSQzhXN2tuRSlyNkdCKT1PMk1PWEpdUj0hNnAlSipiNWNlIVNVU1FMdDJLTU8vJl1xJz1CSW5FJiVeKChoU0M7WWpAUWwlT2JQXTExMyxCaWMoLEcmamUuKCknSzNwZW9SKWI7VzZZUiJ0VzhqWFJPdC8vSTgwQFMkcyVDTV4oRGkvR14iXiJ0M1JGZGBtS1phJ15OJDheT2BIUCtZME4hNiRCOzZJQlNsO1QqPi1OPlM2KWpNTEUxK0k8UGAjaD9YKUdMRmk8RkdcXlxbRWpkayNLSXNSSUdAO1liJnNIJzZrJEVUTHJCcEQmO3FeZzBaYEBxZW9XSGpFJ21eU2A+YFNPTCdKXVM3MzxbbDVoV0gkIVIlYWsqamtZYShGJ0tVP0leaT5mYmQjYSgtW09hXmlEaU4iJFZhYGFGSWlXZkYxa2ElX0NnQ21BSzk0b2xSX2FXQFNoJj5XKVsiYF4uMW5tXE1bIigvaVtHUnFQJD1BIlZbJSg0ZmYjTDFBImMjZmo6Ri5HSWxKJSEjZSFBcm1DITJNNTc6YCVjMzRCLF9fMWA2Zy1dNmtkUUcyWkdSQGcmLW4tKilyYm1LYl1yJDk4R2UhX0xSQDlUPj1oTiQ1cCdRLigmWVBIYCNOLlBSY2RWK1c4Rl81T2pTUmxScCxvNlxpTygjUmVVKk9MN3BQYTRLWGdPdElFNlEjbkZwY1pNSC0nVTpYKF8lOS9aO1c1dWshUXAvWDIlaj9ZSzhHakVQUkRrXFctJ3NoN3JmMytjNzVwcW5GYDpFWmN1I2tNYWArSF9CPi1QSHV1VnUuN3FSI1Y1MidTYmknXj5FTjRwWDUlaTZoJ3A8WzxFOXJKLitXLGVIQFBQTU5MZmIpV0pJSFMwUVdpVFRtWXQjUk5mTi1YPXRpKGZGWWVbOyRTQ0VCIXU7WlwoNWlgRE9DLmQvMm5hKj1kKl1QVzZKJ1Z1LnFsM0FeR0ZnSW5zRCVySzxXL3NCQi5dWSVOITQ/QitEO15gP0lNTDgjNWs4a2pHZnE4VS41aCgsa0M4bT1SUF8sOT1yZlVXIkRrVz5QIWRFXUhKNVooKlUqP3QmJmZAcCxQY0s0PV0zKUBUTVBzKTFEXnA/QE08JFI3KUBiO3BqUVBhcz03XnIhVztwUD5WbjJSQ1xiPUc0ND9sVGJrPlkiP3JqS0Y/MlNZb04jcWtgSzpXX3UyLm5ySyFda2pEa2BAWi5hdFphKlA9JU5xSUtGWDlVYmluOSVOYmBVSyQ0QE0ubGtqPzZkPWE4PCFVTDs4Lm9gUEhvND5XQlozXnIiI3VUYnBnUUBQQVQuTj5eZidqVVcyNCNDP1kjPlxmKzQvUCNaPlI8XGt1bS9bSVZsI1BiQGhuP1M6XmYzQFwubl5fYE9TKl1IYSpQPmEvYUY6OUNnR0E7al1LOV9HbUkpVF50THE9ZFFUY0w1VSNBRCg7a0s3JSEiQVY+OmZWWFtOXFt0cyQ+XFg7R20/SyxNWDVTb1txLTVLblxlTSdBPTgmKipBTTVnUlpdWyZlJjcuMUhjNCE+UCVnb1FNb09pOiEkbUlONDt1IyYhTygvPS0qL0VdazZjR2ZiXnRMODlwUiVkIyxjPkdyX0o2PylvYVhSWyhLJCxyV3JPNUEiQSxENkQ2Yig3KSx0KkJESFtBXkZdUlNlX2JjMzxTXmgoJzwrJVAzXHNbWDAlcW0/LGgmazM7cE5yYFhGJiVWbCVHUDI0UVB0ZVBObCc4ckojTTI6I0lcLz8hQ09tQUYtQVombGZVa1tEMHNHSjAnbkVHbz5bXEUhUyNyaHNvO0huMG9yamYjcFlsPElUZyM1dV9oaWhLWENJOiVibD5wbTU7TnBXNT86JFtwL29QPCRvQkUvQTtMJUlYSzhwOE9eOkA8YllsUXQkP0hAJUxvcXJwUEldPiVbdF1iOUQ2RmsmcUNMI0xcWW4qXWMkK0dhJVVocl0tRlRCK0NqZFtzRFAubU00dGhZP2ZuPVBxdFxIKF9JVDRPJCJncChqYFpRZWVDOTo9XmFMPExWKDRTWjBqLzMoNmEzbSNVPXE7PSFYLWpCWnRARCZsUVVrZkBXMkxWKC1TVSs/Rmw7KzlWZUA5LGxPUUgjYTpxLT0ycjBqRHIjZnM0XzlSO29LI1tJbGpUcC1KXVAuVU9hR0U0SGwnWl0wQTZBQDRHRHJPYWhCWDtCZUlCJkEtSiFqOCxFMVtGZWUpaFFrXWFYKT1gZyJzR1ArLzI5Kjp0QlhWPUhxaUdHbjNHa0duOVoxal5fW1shQVhZNjFcOlJaJylpckBIaiIjSC5mbEEvOERHLWQvdE0oVi9aPEJkYkZVdDlVWyRsU1onbEo8UlFrREZYJFVuXUwxNjYvYm5hbmVNYUBpMFlNZTBZTkJPaiZdcWxyLVBrLVBPJyw1QmEmJXFvPS0zfj5lbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCAxMgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwNjEgMDAwMDAgbiAKMDAwMDAwMDEzMiAwMDAwMCBuIAowMDAwMDAwMjM5IDAwMDAwIG4gCjAwMDAwMDAzNTEgMDAwMDAgbiAKMDAwMDAwMDQ1NiAwMDAwMCBuIAowMDAwMDAwNTcxIDAwMDAwIG4gCjAwMDAwMDA2ODAgMDAwMDAgbiAKMDAwMDAwMDg3NSAwMDAwMCBuIAowMDAwMDAwOTQ0IDAwMDAwIG4gCjAwMDAwMDEyMjQgMDAwMDAgbiAKMDAwMDAwMTI4NCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzxmZmFiZmI3ZDA1ZmQ3N2NiMGNlYTBjOTk5NjZiNzg3Nj48ZmZhYmZiN2QwNWZkNzdjYjBjZWEwYzk5OTY2Yjc4NzY+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDkgMCBSCi9Sb290IDggMCBSCi9TaXplIDEyCj4+CnN0YXJ0eHJlZgo1OTUwCiUlRU9GCg==",
    "DataFulfillment_REQ_2026_BC_089_20261011_221106.zip": "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",
    "DataExport_REQ_2026_KMK_114_20261011_221106.xlsx": "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",
    "Sertifikat_Otorisasi_REQ_2026_KMK_114_20261011_221106.pdf": "JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIgL0Y0IDUgMCBSIC9GNSA2IDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQmFzZUZvbnQgL0NvdXJpZXIgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YzIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNSAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1PYmxpcXVlIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GNCAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0Jhc2VGb250IC9UaW1lcy1Sb21hbiAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjUgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago3IDAgb2JqCjw8Ci9Db250ZW50cyAxMSAwIFIgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXSAvUGFyZW50IDEwIDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgMTAgMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago5IDAgb2JqCjw8Ci9BdXRob3IgKFwoYW5vbnltb3VzXCkpIC9DcmVhdGlvbkRhdGUgKEQ6MjAyNjEwMTEyMzAzMzArMDcnMDAnKSAvQ3JlYXRvciAoXCh1bnNwZWNpZmllZFwpKSAvS2V5d29yZHMgKCkgL01vZERhdGUgKEQ6MjAyNjEwMTEyMzAzMzArMDcnMDAnKSAvUHJvZHVjZXIgKFJlcG9ydExhYiBQREYgTGlicmFyeSAtIFwob3BlbnNvdXJjZVwpKSAKICAvU3ViamVjdCAoXCh1bnNwZWNpZmllZFwpKSAvVGl0bGUgKFwoYW5vbnltb3VzXCkpIC9UcmFwcGVkIC9GYWxzZQo+PgplbmRvYmoKMTAgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA3IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKMTEgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggNDU5NQo+PgpzdHJlYW0KR2F1MEk+PztiKCZxODAxZCRdWVBiXGR0RG9wclElUipZakJaLUNNR1plOipERFAuKj8pLiwtSHFzMWBARDNfVzwqVSdMSy1lTk9yVDtrTGo/KTNjNCxzOnQnbENWLGsrWzFrJ2hOOEZDTXBccS9KSUtLXDw6aVpLcmQoS25UKyUhQHI7XSJpZkFQKmIhSVFWal5iKjgvVSxbaGA4KWtOTVpqJzI1VCUlYG1wZSIpbHJaYnNIPCNnVSRJTnMjMmNIbCZZOlEyU1YtO0psYmtHT18tMiIxR2YvZEQrbmZlPTRmczYraUwjNEkhV1VNalc2OlUwZigwcChyXnItXiZvTUFmJ18oRkZ0S0tfLy88VjMtaWgkPVlaP1ZIXTs7NDQ2SExbMDcyPDVhNGZIWT9UWnRwJy47aS1wUGdDQGFIJ2NqbDFaMDUwL0xLX01kOFJZQ0NoZm9rVnJQYmZAMyUjb1RTXUFvaVxeOEdvcmRaYVNdO2psb1drSDN1dXVebEFaX0IsQElrZWomQVRLMTpXS0N0KmZCYmY8R2NiQHJzLGliQiliZFZKQTM+bFhGaylDXjdUYDcmXSsrLTluX1FQYip0Mm0lImZeaHI2LD80PEdgJmshb05mQSlPJ1hNWi5xMS8wa3FlYEphOl48cyo8OzVqaS8jQGFUPz9BZSZ1XkBRKXVWRVxpJ0haXVNZKEJmYzZacVVwLzpfZTdgOEonTlVJZEZpLTZzciNQPkAlJS9FTWwkamJpV0E6Y0JtKChGXVUtZ1hXXyVSOis9ZD1XKnRxXTFqN1QtYG1nM2w5UmxHRDpJZmJhaFdPJUdhaz1lLTtTZ0BSRmotV0RFKjRfbiRaVCkkKEkqZWhAXyxdPDVCLzduKzdnLS9xUE1SWTFMSk89aiZMbTFZVycva0ZJQlZGcEJnaElIUkciJmRidCRZb21lNlo8ZjAjJytgTUdHUCJFbjNHW29ybCJPcmBmcDwnLmsyI21DPDUsRl4ranFUUTdcQEg5Wm5ZMlg0KFg7OkJpb18oaSQ/VmFubCcubWZFW18zPHJyQEVlNklPZllyOm1yKS8xLmQ5Mm9NWS0mcU43T25OKTk5Xzd1NVolbD5qSmBDMmVaYlxoKEJAXzE3KV9UMiVkb1dOWktqZSRhVj9nV0dQbTtETUdCWyxTYW1hR3BgXGVnLi5dQEVfVE0wQGJBWzhWKFdINyFdPlQmdFtHSGwyS05jTVBMITs/RVlzM2FbZ009YXVnMGU9IURxKXJ0WDdmIWhDQG9RcVtkXy5FYTtfV0NsJj09a2onRkYyajBpbGZWOUlkbEluWGsoPGg0KlVZLT4jbyo3Yl90Nk1AT09gZU1pK2RbVF01KD8+IWI/QklrL0kvMzM5aHFNZV07SWZQIm4sb0JFUU46USdSNSghKFEiWS10OEdFWzZXQW9oXk8ocS5yblxgLnIoXlhWUCt1JSNPNGcqdUhkY2tMSEJcJmgia183MyY+MF45KjlsQyUxN3MyO1FpVmQwdU4yWFAlJGUvQEdeLE5kTGs5W1tOMyFcaC48I290UDZmcFRvc047QUg3LVhWXkdQOGhCXFVsWC8rSGhxT20tayJwNGI+RidKayRNW2JQMD9lNGc8YiIqaDItJixsJVZlQjtBblQqQlkrIjN0S3I7bmM+KTdXVm5tN102cEtpZjA7WjMiQ14xYEBIL11DJ2ciWUldRy5DTlRELEFObmo9alJrUCUxJFlhV2VZKFQkKVx1WjROdSdjK24oSjwqc19UaSlpRHQuXXRxSW0nYk5fQ1toS0YnU0EpT2k/alQ1NmplQTMkNUNoWDZPWm85N2ldKjFZUGdlYDM0cm90Iy0yYDtmZmtPYlhdPVp0bllEdTsrKDNkcmVXN3VycFtUSmlaP1E+TUxRVzUpazktWTI+LyUraDcmazcmLGRmOG1OSTtiVCJaXDVIRW5jP2BXXCk5PGJdNWsyOzkoS3AkOyoiWmpqcS5fKmtoYWpsSkAnVyxOL0lwXCVfblgkOTZec1padEloU19uOTA7aVcrR0JUQUJHKU9FTj5YblpcUD5iX3E4Mmw6TUlMVDhNWjxFVmwydFtRLjdEKigsWHROJmJZRl1kKDtmZlpydEdkcF1WNW9cZ29RNFIwbVcnUCk0VStaVlJoSFhSSSxeKl1mU2Q+Uk9NXEprSEhlNWxmMkxoWzBfUjlmKUY3IltoV2JnTiRSMCFaKTdmOC9DYXBMY0JEZ2NXRzJpV01oV0kpQkFzKU1CZF9Lc0JpRkw9RCRUMyUkOmE6I09xOTd0Lk0mcVxWbDdLRjRSaFg2RllJLU9RZFpVJko7STMvXj9TK11YcW4lSSFbKDUucU5zYkdxTiE1QXNUc0ZmSVI6T00+V1JPTjRjWzY3MSZuLjRBTzZyZD9SRj0zVF5wMllxWjhfY0xdMUwyWFFuJzpYVHNablNaPTNHTTMiQCtjV1tWJkAwLVVSPGRNbiNxLk9tOTdNYXApY1doWyNSVklncDsnKigxWm1FT2owKFQuW0hkWWEhanB0LWxSYD5xbzQ3QG9VbFRsbzNdIWNJVixcTlxac2tsIV1PVShLaDZeXVVVUCoiUyxSWltDPURqVC1ZImZkLDUyOkhBUWwtZ0BeWSdfYTxYOyQlME5KLDdSN2FhJkVtWWQ3LFdmJ0M4RCJjPidvKU9aJFsnRWY4aWdiS2IvMUMkRGpAQStVXzchXzUyT3VKSkJGY01OKylMPFs4blNmJjB0VGBYNVdecWB1LUFhOyUuTE9iMDhHKkA1LzRwanEhIVxbN1tJJTMvSkgtajwyKkUqdF0rMTE4J1Y7STZAX1lRP0M+NUUqImYkPW9mXjcvN2t1alwlN2RqLGNYMiY0MyxCQEVhO2FcNFhlLlxoZF9TaE01IUVQdStdTDA2SjY7Sl0kYW8tXyhecGpoZTVvTE42QSU9OVBYTTsiZlNBLEl0JDdoRyxeLW9qbUQ6KictLVxkXW05JmJVMXVrJC9uRU5RY2JGM1U0bnA8TU06WzxNaENZRFxRbi1lYkNwRjpUdDZGT0xoJSdCOyFLajhrXDpGOD5gU0d1XExkIjBMM0tHazlCQV8lTHJWZ1cjKVMhJTwxLmhQaiUvRWZOb1ZbJi5bJmg8S0BFJnM0L1BxZkVdZzZEPWREdUhpJkZKcyNqaVFXMS8qOlU2NzVFIiJ0MUZIL1FESGVqbmhxJU9eXlNtM2xYSnU3V2MpdVZPSW8jREU4SUk2anVvQ0FgdXMuISk4MmdBQExRQCs4ZTBXPXRHQ28tM3IsNW1iaVckOzRSXzwjXDt0PSoqQEIlS2BUQUIrcC9VbCtzImwmK3AvVEEsNlI9TWJuKCVWS2tbJWdVN19tbSg1bWVZRks/JFk4OWxdRWQqW09lZ1MlNTIwQEYwXiJRVTJzYFRnYk1AOVUkNyUrQUFnPUg0JDhzNmBHb105LXVXOV9pY0ZoJTU+QmI+KVkoP20xbEBFOi5VaVEtKigqa1JlUnRFb2IjPi1WIlhwUmlFPGlLaDJRVCNXJCEsIW9KKTEmaWFhSDVtXVVRYFtvZUs3Z3QmJ2oqJSZtNiRjWmJMLktDOUtvcUo1PzVOdGRZVj1LWmtcLV9ANlQ4SSJBLlpwXWVfNiI1S29xSVdLZ1E9Uy88IzcoLiojO0Y3MlRPaDE2KUNZWihBK25NbElQbkhTKzNOLktkQWMnVVYybT1FW01rPTwlcSxAV2YtcjtPJmwjVUZQKSkzKWRwQVFSYCgiRWFcclleaUk4XyFRdFtvKi0nRjQ8VlNQWF1CTCdrbG5tN2RfXWY2STVsLzJ0LF9vS1RcY2g9bE1oUGwlJi4uU15cayNCNF9YVEtONUlwb0hKSjBwU0BRSXRTS0ZDdCtkI0xyWUsuOT5EYCsjKWVAREtgLy5MJUg1MWtxJEUrVThJczpnWUNeaUcicW8zPUsiXDA9bSNuLWRvdU4tVD8uUGdeNGFNP0Y3RyU7cWhfVyhCXXMyMyM3RGBdXjBHZkBNJ2ZFWGg+OihuOCZwKjdDU1UmJ0BYNEpXY1pfJWk1SXI3Pk48NFdrYW1GbkhqTzkwI0dEUTgzPSktQG1RTVlIJ25qT005SDtlIkxJIkc+QTs+Jks3a19HWVIqVyFLQVZhWSQ9SSo4NTpfaixpMEVhJydJJ248PVppYCxoKk81NicvLWArMGFHIVQpXnFzRXFXRVAkMyVeRVRkIW08UC0vQjpiPDBMbFktJS8uUEghWCJiS111OzE3Wzk1bDkrO0wzL1hSKjUjM3A4J3UvSks/amdPXXU4R1A9RSpCaEZadTktaClKL2ldJmtfU1ZKbUs9N3FZbGZXaks9WypdcWZBZj5UbklJNkZrWT87M2tTZ0lKbUgwIUI9WG9xIVVZRXFmQmVrcHJkVz9udVEoOj4sOU1yaFw0NE4yRVU6QS4lK2NQQ2xMZCRdKmNrMkhOIXU/biQpIXA/Ti5HXDtfaHBeXC1YSmFncmRAUUJbLlIiZmcoZTRFMz1TVVAlYm0mPVJeIS9UW1oucyNDL3NfdExWVFwnQlEvUFdfbVdmbGpKJ3JJXT9cYj1iM049OF5rVExrTCNWLi90KjRmQzg/WltoWExNKmsvUThMQChcUmdEOGdVZiw6ZSpaNj5uRjZfWVRjJDAvKCtgclM9dEJfJDBdWj87bVllQzxbdCpaXFxrXSY6a15uST5TL0F0V0pRTiZxYGAxMzVLZz5kNF0kUTUoJSEmbF5ZJnEzWiZ1KlFcUkVDJjU/WVFCUUxlUGU8SDQxSj4kczpTTSVdamc3YDtzT0FjW2IqdS9DTGZZPXUyKVVZYCwiT0NKQitDbENNSys7NmRqNWYzTzNPMEptQydiRVg4bi9FXTgsPU5HZjlSUypUTDVEKjQkb2FGckdiKXVlS0lJIm1eJlNhcyNiW3VzW3E5WSU3S10jMzVNbzE+NkVdRzU5QGxZWDo9UFkmblxTK2QqYkg2XHVnWVBBRzNnUT47R0FETjktT3NBQDBVVSYycmwkV2ohcSNAbyViZkNuRWpWYFMzU0g4c2ZibXJ0L0BRdEZAUE9yUEAtQyxUaC4hc1UzKiFwP1FmSiUmbHBLXFwiNGxUUChJRGhmQ0QsbDFUYVl0VHIzP2A+J1BcRl4xISMlbFJMXEdYOGxsVihcdHFmPzFWTVNcQWIkN3VxXyE2aSkpUFJtXiduMyRVREYwJC9VWSRcTWA0UmQ1cVheOT9cKWVnNHV0TEBBKFlcLj1xbkdpYERpQWJRYWI1UlwwI0FAYyUtXFtYN0I4O21OLl9EbkpwdCM5b0hjRVdTKUxpQTJcL1RHaDZha0lVQG4+ST0rOlxEazEuXz5QRmEqNTcyKSxyTk0kQl1vJzQ4NCVUZWUuMmY6NEdyPm1FZVZAalVoR2E1X0xNN1ZvY2EvRidiY0JeJloqL29RYnU3ZSZWaSxpT2cxSmZBQHJGVF4kNWIuQ1tGKW0oRjZodHVbX3Bzc1BLc2ExTzgxMWNJPG8hXGVmWCJjVVs3P0Eyb3RrPGA+PmpQcG9ZKU9dK100NWxJWmFeZzMyN1BrbHIvZSMtZlBKOElwaGNiTzFlc1tzYT9gXWRcM11TMERRVTU8ZDcjRzFSXCFmN0lobjNGI2gqKzBDYTNRUigySTMlMkxxWitCWFY+bTxsKEg0Xmsram4xVV02MHBtPVYxQzhJKz4nZTFpJHA/T2NXPUlOPEA7Ul9SUm5kWnAtMlZVS1ZbOFErM3REdD4nSS5ubiUoImdsXjItTTgrJVdhNE00P2VkbjUtLGVSVF8mQiloPTdCaj5DTT81O0I5WmZRIiQvPz1KbCkmSE4sTEM7VUIrLV84V2IvSTZlUWBHKmBIYU5DWFg6TGw0UjkqdT5uSSInam0jOnNOXm8tP1tiUlg8ak9WXyk8RT0maSs/UVJSdSRkZzIhLi1uQ1NZR1VAMW9FTEUia21jRUg6QEk+cSIhQF1dXDFnLWNDPmoqKGFhNmlyXElyS2pEMkcvVF5kbWs5aVtec0E1JCdqc2cuJ1dpZVJDRD5gMiglIW1UNVo1MyNkYEBxKFEkPztdQDJAVztbIlk/OVVFLFduKEI4IV5kXyVtKklsYm1mMFZkXiIqfj5lbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCAxMgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwNjEgMDAwMDAgbiAKMDAwMDAwMDEzMiAwMDAwMCBuIAowMDAwMDAwMjM5IDAwMDAwIG4gCjAwMDAwMDAzNTEgMDAwMDAgbiAKMDAwMDAwMDQ1NiAwMDAwMCBuIAowMDAwMDAwNTcxIDAwMDAwIG4gCjAwMDAwMDA2ODAgMDAwMDAgbiAKMDAwMDAwMDg3NSAwMDAwMCBuIAowMDAwMDAwOTQ0IDAwMDAwIG4gCjAwMDAwMDEyMjQgMDAwMDAgbiAKMDAwMDAwMTI4NCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzxlZWIyZmU5Nzc1YTZmNDJlZWQzOTYzZWQ3MDI4YmE2ND48ZWViMmZlOTc3NWE2ZjQyZWVkMzk2M2VkNzAyOGJhNjQ+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDkgMCBSCi9Sb290IDggMCBSCi9TaXplIDEyCj4+CnN0YXJ0eHJlZgo1OTcxCiUlRU9GCg==",
    "DataFulfillment_REQ_2026_KMK_114_20261011_221106.zip": "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",
    "DataExport_REQ_2026_EKS_042_20261011_221106.xlsx": "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",
    "Sertifikat_Otorisasi_REQ_2026_EKS_042_20261011_221106.pdf": "JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIgL0Y0IDUgMCBSIC9GNSA2IDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQmFzZUZvbnQgL0NvdXJpZXIgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YzIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNSAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1PYmxpcXVlIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GNCAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0Jhc2VGb250IC9UaW1lcy1Sb21hbiAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjUgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago3IDAgb2JqCjw8Ci9Db250ZW50cyAxMSAwIFIgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXSAvUGFyZW50IDEwIDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgMTAgMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago5IDAgb2JqCjw8Ci9BdXRob3IgKFwoYW5vbnltb3VzXCkpIC9DcmVhdGlvbkRhdGUgKEQ6MjAyNjEwMTEyMzAzMzArMDcnMDAnKSAvQ3JlYXRvciAoXCh1bnNwZWNpZmllZFwpKSAvS2V5d29yZHMgKCkgL01vZERhdGUgKEQ6MjAyNjEwMTEyMzAzMzArMDcnMDAnKSAvUHJvZHVjZXIgKFJlcG9ydExhYiBQREYgTGlicmFyeSAtIFwob3BlbnNvdXJjZVwpKSAKICAvU3ViamVjdCAoXCh1bnNwZWNpZmllZFwpKSAvVGl0bGUgKFwoYW5vbnltb3VzXCkpIC9UcmFwcGVkIC9GYWxzZQo+PgplbmRvYmoKMTAgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA3IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKMTEgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggNDYyMAo+PgpzdHJlYW0KR2F1MEk+PztiKCZxODAxZCRdWUxiXFJoQm9wbiVeMlcrUmlmT2o6NGckRCcyMnBhOXMxVlJCcHA9RjVeZ0ZAM0olPFUsRy1lTk9yVDtrTGo/KTNjNCxzOnQnV2g3bUErWzFuKF8zI0AmTXBbTVxKSUtLXDlRV2NIcnFgOz1UKyUhQHI7XSJpZkFQKmIhSVFWal9DYEoxVSxbaGA4KWpzPVg5KScpVCUlYG1wZSIpbHFCS09EPCNnVSRJT2srZTBAInA+WHIrUTkvVEtLLV0vWFNfTmQ6WipcL2IvP0JGVDxfZjA/aGBTQVZ0cmA5PWZNckBbZjkyP20nLkpcT3UsPERiP0lvWU1tJEpXTzQnV0FHNWM3NyQ5L2QuQE1nJVpbbm1AOmIjLi1rSV1RZkJaSzJMPkJcRUdMU11rTlBxSk80UlwsYmREX2I7MV9PLDxjYicuVlA/LEYyKlE8RFJxXipKXTF0Y2NsOl4yZFZJV0pQdTQxW0k3bENGSnM6YTwyU3FyN1BFWE9sYUhdOnJUc2N1K2lTTyxXbkVXUWZIJU5rRGxqYDNvNUByIWg3Qkl1bS1XKzlxQFgqNURlaT1OTWluYHVpSWhbT0whRD9MUGwmPVgtM1hVMlxAL1JEcThyO0JhTi1vMkJMNCdDP2IrLk4iRy46alg9Li5kIjpPcT5HcUlARlk2WTs6cXAxOnFuLGwiSyY7KllfJm1yIiYiNl1eQEdlNiJYYUFwTTk+LCsyaSloWmZsVCtnX2dLMExETWgjbzRMQmlqQDYoL2hNa0dmJWIxIyFXPjhnRjkpRGg+N1RLTzs5JShdZzIycjJzQUpKW09QWG0yOURjZiRXYFhxcCJSXlglQEBQSDxRQlZrOkk3Tks4PmtGRkR0WE5nWGchWjFiMW1EcUgoOUlENHVgQl5bYlRxdS9sLjhZajJ1QWEwOmI1Y2tgRy06P19OUk8tRj8taCwuJiUxL3NiIVVaLkIrMCM7M2ZtUUtDKFg0STplOF1vYV1dKUBFV0BzXmxvdS9SJ1MxMmdTUzRUVWVJRmFUa2QtSjBXZi0pQ0tjN19wRnFUaVghN2VfV1NvaDZTIWB1blxZZCEsOE9aTUInSzc3VVZGb0JHVVo8YkNIOm1nOi9HZj9oOEIrZEBLMDJoJi5GSV5RcjZZRm1iNjZiQ1tGbmBqRyZBczpiJUltbEc7O21vXEdQb29wOikuQTBzN19SZDIhOmxCdTZhJl5oWGlWXEg9L1QtdUElOjtZRFovNixfVz4sbmxgL0RRNW1HJj5ORChcKlAzcXFTYTAhMSRyXj1XIyFFcklJVkFdI1BlYGwpWmhJV25ob3NeTDNfLF9OTHIyNEItL0x0YllqWkhhNmxRPSlCVCNjdVAqLkk+JjJZSXVwXWRlcGQ3K1YyLjlIOGpgblk5MiM0LWRjUylfOVs2Lz0tK0Viak0wLWk4I1ljbUVkVEthPC4yOitVP2NJKEFVOkUuTWNVI2ZWdFReby1ObTFXSUM6Y2I9dScoNWl0akYzQS9KLypCTyQvTFE4RygucW5CLDA1a2MxQWJKYSdfQnA1ckBMKEU7J3FkTywjX18mRDJVOEEzSj1GT1hNSzg4ayhmJSZmSCckY15wT3Q7YD09YXMlX1k5X0FIPEI8LmtnU2heJV5lMExmKDdRTVQuQz1XRCIvYCtZSiFYNkxzb0wqPEdrTyhKOnBhQ1NoMjlTPEE4UWA5b0ZfaHBKKnIxSU1Jc2Feb2RUMFM2VHJmS2M7TSIrOjojKyg4X15vYE8iLW1mUFdzcWFcWjAyXmVqMzFTTDhsPzs7JW1wNFFxYy42aDA5PDQ4QVFRJDZvaTklMkZVPlZzZ2NCPUAxSl5eKmxWRCM4IlNLaStNWD83NCg/JmhyYSRAXks2SGVMRShjWXFwb0xlNWVIblhHMUBOXyttUkJpWjxXNmQ0WVxLMSN1KEJYKGZfO0xiMWchNFVyI0txJV9ZRCYuVFNWLFFmZkI4aEVOJHE6QGVdLVxEMlokJG4oam1IYXIsQz5iY11HQSdINSgpVVEwdTNydDMzL2ZTRjZpVz1RbmNeNCxCNj48b15sT1dTck9jKS1xSVF1U1BTTiZyPkhpRVZGM1AxaHAlc1EiIyhrK0lZLWVbTUkvTz9MYSVeKy5oTnI4YGBIYykmNSVccHFPSF4obmxKYGZKXDs7YEomXTpcX1hoc1BVQyclSGpDYFNlWz4lOjlrQzlnSzVfPi5cQENTdU4tQmNuXE5aPTlAKl5ubzMrV1pTZ3JfKzkhMHVKbi5mLV9fR0Y4S0o2QVpKYS1FbmU7MG5bQi9KST1pOD1vM0ldOVhOKGVEMmo7UGsjK0VrLldwJS1nNS84SmBNcEBUbDtuPE1rUVNxTDQmbTAqTTNZYXBScGlnWFVfOy5RYSFmUWdMUkBcQytSJSI/Sis8amY9ZE1oaS0sJG8zY3RbSUNyOWE+QV9FP24kaHAmUnRBaCJALCxBV1clP2ErYlBrYHRibTozZ2xbOFp1RTojR3NmLm83a3J0JzU+W0JbbDxnXDkiYUNiLVg6W3NiUFFgQTRnIzNQREhPN1ciVzsyZ05jPipxXFRFclg3PnRjZzJFMlwoZyZHNWdyaChAOGJxWWtqPjdlOiJSJGtbOlZfaWFrMDdcYUxxVlguNF9mJlhHby5kMSd1QTckSHRKcDslUS9bYCZubl8mVTorOz4zV2hcZWRoSTlRQiNKbSxZQCIiK05zU2MidCUmJ2I3Q0dBLUQ/JiFBPiJQWEJfPzhBNVlLRTZBKnBLM2lyKXU5TisxaFAkczRbT1cmdGciQCY1WFBLL0RgK01CWjJJKT9WOSpdal9sU0pec3Q3WyRMQG8qKj5hM01hYTpSLk5zLThNRjROaE8+WTMhWVgvbEs5J0QkXT1ORkwjZV9ENWVeWl1cXTcyYDxMPSRyc3A4Z21mYVFUPlYuXmdUK2BRZkM1NzAjcjwiUUxALGFrIXVEZ2llWiEoXFVtP1ZPVSdETkBPV1Y6ODooZyxFY0k/c1FmQzRMLnUjblw9SzpOTUVaUlc4YidCKCU0WUk2WU1bKkI5JU0sO1dqWkxVbjIuc1ZrOTlobyY2UyhIZk9uKUJjLz0yIyxZY3FOMEB0ZGFHQ0U6RDc9TyVmSz1PbkFTNyE2ZEdRY188dS9LVFp0ZWpwZEA4PHE8ZVNWbEsrJWlHWmU6UTxqZDBYdS5dLlsqTTU8JF5XXTwkXmNfPCZRYVRUaDohUCZnXTssSnFzRFwnUERzJVdKMW1vMVE9Z2lLcHNGcCRVbkk2Kk1DZFA2XGhALidlLE9UWi1RaiRGO1stKFJvMUNzM08ybFoob0RabE1kXGBhSltNKDVpZGU+UEhObCVhNDpHPyNaPTpUVlUiaTMhUilOQjZWKGxAPD9ZJHI9QjRSWmAsMyk0Lk89UURCOV1MZVlXY1RYP0FJdG5mRWNodFovc2tsbjNnUFwxKDo4QGM9Jjs7Xlc9QyFWZlIrSV1BbG9HWyZUUiM6MCZrNyZqbWs4MiguSlZBbCJzJScwVUVgcj1mZ2JOJyZKSSYzNVo7ZCIzW3RrWidva11rJ3Q9RDVPcjRvJFgoZWAvbkAqTVFBJl9uZEJdPzAvPWNSc0AkYVRma2knVj1gXEghSU1vT2hwZTsuMzhqKlxkUykhTml0amsqI0I2P15iTSo0dEZzRVxaK3VOP2I7VUAmNVZZLlVuTUphJEdPI242Q1o1L2s6N0xRNCddJD1RaShuSFhWSl89TyFIWTNOaClgPFYnQXFCOWEkZG5DLkw3QVsxSE8oQ2hpdG9lS284V29DZ1s0cU0wVzRdW2dWRWlnXVApNVAsXms2dElRb1tebz84ZFJOb05uPjVSbkNbbUdRRSp1KUU3TEpYW2VncCZFalojaiRZcCYwJ1tkQSVeQmdUYTkvIjQtYCtNXnJgKyNBVUszWlxxRkxiWSZWOT1SNkUiJGQ/VmVwT1RZVGgkYF8sKF8hP29gQzUvNDAmO0I1QGRXMFFuVFQ2Z1M4WWQxKjhDPVNQIjhYczIwJ1wyaCteJig5alhNc0NLOS5NTkBAPkpoVSIjSjk+bGspU2dxKEw5Tk4rdSFFWGNwYkYwPjozLmNFYWQ9VCpdXyhbKj1FKikqKj4qLTEtZCNJa3Vgc0UoNWxVWVNIMCw5K0MuRkZETjlhMiZdJFVjQmNgaXQ7XTJlbkA1RDo3S10/NSxrb2ExVCtWcGFrWmwsPyEwJE1yVkVhYFwoQCFlRVRBQyhwYC5iPT4mIlgqdTZpdG1fO1JlK14nOFZrPj5uJXNVLzNMZGlrKHIkb2xFIVU0LSZSYmZXLm1hV18wRUBxOkA+cjYsJWFGZldCK08zKDNHUFtpUlFtTk09KWA4TFleaUs5XFpCSHBIaG4nVTNnOixNbiFlNTllIko9RUk6YDImTFA2cjUqSzJecFctLEw6N3JsRyclLUAmSC9dLm5qYjxGM2pDXTtCX0RdJEU1Vz1WUTwlJkZfRi9sdWRqL0FmVU1kWmdvMCU9V0MuPyhqXVJhb3VpaixuW0dfJTlkWWcrLjknRjJOTCZKX1AhV01nZFtYUlhXTzZIXEwha2lkbFptUkg9Y3EwKmIka0I1bUFuJ0thXydjZz0hN10wVjw2MHBCMWZjNU8kV0EkcCh0YkxESHE5OGBJSitiZVBsYlldNmJUPlY+L0AvQWMtUUktUUBTWzxaZjJJXGIudV5JVm10KGAlVXFNYDUhW21RQjY1Jk1hVDsyTU43V2NhSHBxPWJuXHNAZyFncUdyPmE/QWkpUTdBTGE1XzAmRnNPX1olVHQ8LzAyTEpWQE9jQFBxZEpgXidnPkU1J09aLT5CJ3RYOVRtYUBEOXNrU2pDQ1M7YFRwajtdMlt1UiM5dUZJOlZdWTpJPik5MWtUJW5vbE1iLzVvYHViIztLVUgmIypRQkZpZjJnbFVVS0U1Q00nKUBNLFY1Z3NfK19VW3QvcVYlKDdyLy9GIU9kSCxEXVtvZT0mPUxNT1YvJ21FKEQkSSdeP1xpTTxtMjsiKXBEdUA/KilnMzxvRm1VLGhmKDk3L3NnKEpgU3Q4VD5xVDNGaTNFdCJmJGdsRGxmZ0g2ZWhcRldOQzFhLFhGSD9iI1lcZ0ZnLS8qVkdaIzlNKGFgNXBNZGFGPks4UF1dKDVyL2w9VSZyQEVIW1FJbXEwS0piLmJKLGgtK2dwSEE3YltCTzR0Yj9zLmZobSJFQkM/azxePDJLRTNZNk0xZGlwQCJkOlFUVSNJTTJPZkcycCJbM0VNKS49PjZjN3JJW0M0KWIzU3QiM3UiPUpqYGg4WlhpZyMhWD5DazFUP2E7UXAqTV1QWmVvRCk9PDRpc1ddJDxrV2UxZixaQ2Aha1wrdHVAJTZIWGVeJC8/S1cxbWg0aEBuWTYiXV8qZFtYQURHZj9QWnVMbjg1a1Q5cl10PEZdQUZbQD0pJFciM1k3WEw2PGViL1c6ZVdgOWxEKTZBZj1lbSFeVy1mOSdYTnQuPDxvVCI5bmYlSk5JJ2pDUTVEaCQ3dF5bKUdWckY+QkpDb1AuUF9vVjZiPm9oa3M3ImU7M1BIL2VgJVJwT2trZy0lMCwkKSFyQiIpZSZBNnMySipuTFkmKTsuZzI+T0RDXnA/bjFnXUNvQUQycCQyZTFRRjQqPy9MPW1gXShIVmhINWhrKV9WSyJQckhHSWo0bTwrbFQ/NkdOLks8S10kQHVTaDBfanBVblsmVzxIWVRiPCY5QmxWVlU1NCFfS1opNUciRk9bLWg2ZmhLO29OZWhPUmlObmc9WUdSZzVsYiFMVXA8RmQtZUIiLkRBQmo+RDg/WUE6N1pmUSJsL1c1PU0pJkhMVjdrbXRSKzY3cFJvIzRLOFFgRypcSFpXIzUnS3BcajQibmdUbE5PZVYzQ2kjJko1PUxAUmYzME0iJScwTFUsaGwuYTMzS29wKiJhWCQ9dDRvcEkuKUtRKyk6LlFhXnAwPztCWSUiIUBdXTMmPGQ7LyliRT9hYTZpclxJcCVdU10laWlpMWxKdXFaXmYoY1hkV1tbU2NeSFs5MVpdMSFUMG5xYytmbms8Z3VGKyhibiVgXk0kVGBTXVYuYj1APjY8SS47Lj9tdDMxU05lTWRyI108MCNcYX4+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMTIKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMzIgMDAwMDAgbiAKMDAwMDAwMDIzOSAwMDAwMCBuIAowMDAwMDAwMzUxIDAwMDAwIG4gCjAwMDAwMDA0NTYgMDAwMDAgbiAKMDAwMDAwMDU3MSAwMDAwMCBuIAowMDAwMDAwNjgwIDAwMDAwIG4gCjAwMDAwMDA4NzUgMDAwMDAgbiAKMDAwMDAwMDk0NCAwMDAwMCBuIAowMDAwMDAxMjI0IDAwMDAwIG4gCjAwMDAwMDEyODQgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8MTcxMjgzZjBkOTNkOTY5YWVhZTIxYWUwZmU5YmEwNjE+PDE3MTI4M2YwZDkzZDk2OWFlYWUyMWFlMGZlOWJhMDYxPl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKG9wZW5zb3VyY2UpCgovSW5mbyA5IDAgUgovUm9vdCA4IDAgUgovU2l6ZSAxMgo+PgpzdGFydHhyZWYKNTk5NgolJUVPRgo=",
    "DataFulfillment_REQ_2026_EKS_042_20261011_221106.zip": "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"
  },
  "samples_base64": {
    "Permohonan_Data_Internal_Bea_dan_Cukai.pdf": "JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOCAwIFIgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXSAvUGFyZW50IDcgMCBSIC9SZXNvdXJjZXMgPDwKL0ZvbnQgMSAwIFIgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4gL1JvdGF0ZSAwIC9UcmFucyA8PAoKPj4gCiAgL1R5cGUgL1BhZ2UKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL1BhZ2VNb2RlIC9Vc2VOb25lIC9QYWdlcyA3IDAgUiAvVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKNiAwIG9iago8PAovQXV0aG9yIChcKGFub255bW91c1wpKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYxMDExMjEzMDUzKzA3JzAwJykgL0NyZWF0b3IgKFwodW5zcGVjaWZpZWRcKSkgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYxMDExMjEzMDUzKzA3JzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKFwodW5zcGVjaWZpZWRcKSkgL1RpdGxlIChcKGFub255bW91c1wpKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA0IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxOTQ3Cj4+CnN0cmVhbQpHYXRtPD5BcjRmJjpWcy9SJj5nQl89Y1ddRGJiN1RmKk4hdWU8YF9SO0sjdDVOVDNbNFM2cGJYZkIqaSZkODxGWT1IQFpMayp1NjshPyRBJW5iRzZNXC1fLVtTSD1aVWk8cSdGVWRLQTtES3RqI1EuIypNPE5uOmYyXjskcC9SLWdATz5RSjBQLS00IUJnQXI1X0xuKj9mbSQrPWM1aF5OMjFESzUobThkaXBibikoa0lWOG0uISxSOykxaDglU0MpT2MiUl1mREY3OHFfTko/SlU0OCMsaSY/Wy9SIXJXND1lRishISVzOmhVWGM/WDRoI14vSi9fclp0JUFEakZOYHIzUU1NX11kRDUhYUw5PClEPFhkMj0tRTthX3EzJEozQTdtZjRTbWJ1MC5AIzJ0XmNAIVtlbCQncGY7RitIJydLaWhSXm01MiVnQEAvUWcpQDBMak50TFgjN24uZjAwbUVMKyQ+cSNfOEgmZ0dfRjQicm1bTFUtWksjdSh1VSUlLlllTDtISyhVc1w3O1Q3SmE/PF1SZmZBWT5IMk8zN1k9NElgRiIjZVpkXFFfcFQkdWxWSTZAWExDJFozJDhWLUloQWRzUEM/JSNcVCFFPHRINSlrci1qLjBVXTU2LS5XZTJRLUE3XS8jVW5CNC5aLz41VmhqWnUlYDpsYEhSTVJaTzdAR24kTis8bikqKkdaYXBMUzRCLyNKOEM2SyI8LD1eJCM1KjZBJjRJWENGXlo+MClPRFlwXyZrUy9tdS9iS2AxNl1zIzosWEoqVkp1bjgzRSxMQVkmMTlaJWohcFxNIV1cdFYzIj5bLW1OYTVJT01bRlRlPTFdbDpTNXMjaDksWz08K2hWXiNqdDdeMD11dDxqUUdiZlskVjo9NVdkLmsiWzRNPSJNVmE3ckYlITYlc0JKc0s0KUJvVS4naCxGQC1AJixfT2k0LUpidCkxMUlmcGkrWUBDJGRdbDI1ciNfUjtPclRVKCZVQT00KmByRj07SSM5RUhDTEFwclhmIysjMmQpMUJELT9JP0M2PVo4ST4tT2RFRy4pY2dSUDREUCZyNjwyM2diQjctXTYiYU4kPG40aUpNLExhWzFQM2RuV1E4NHFccF48bG8kM2k4TFtOTjIpYVFhZTZeIW4mTipIJTEsbk9IVmBCITRITF1VYlExLVQhLTNAMzwuWWc1QHQiTHQ6XThZLUohblU0IWc+byosUFBQKVUnNU4sSSRAbHM/LSQlZS5xalVpNENfaVJTcXA1XDdhJGAvWEJCIVRzUidlJGdkbUdqa0NhXylgJyxUJEBdaD1aQlFMSkRvImJfWWtBZFBacFxeRyN1OCcnMF1COyckQlFOQyRnbWRHdVRTSjpLOTs3ImlwK0plPjlyUVA1KTNuVGFFS0ZlYkBaaFU0OG0xRjdJUkw5QmRsP3A6LjU8UD89SUcsZy9RPXAzLVs6KHFZMmU1UTQzVElJbF1eT146RCF1bDNwQ2h1JmdWR3QnU0hsVShlKTk1I1xxUGpsK0twT0ldTjolXCVpKlsmTTZZUVQ/IStGazBcIzhvVSMmVWklY05caWlqQ2Y2SFpca0hrOkBpR1gvXm9mSUVQXjYnW2Qmc0xEZ0Q4NEA9LHJebjxcOSNRUk02XSx0UV4hSG9wUGBfLk8nNXA2ODxzbTA3TD1YJDdHRl5JVlZbaD0rVUY4b1heMj1JcVtea1NqL2UsPnVwLFhSLSVYSnFKQEtaVkhsWUhyMG8kKTVfTF1kSWJCSEdDXCI5YEJlNWReMzBUUmxBVWNEVEQzZG0tYTEwIkdOM0osV2s5T3QxSi4xIVgwLGwqPzttOm1jUkd1XkguN2hVQWM+ISQ9NDNPailcbkwiJ3JmUVRlKE8sajQuVU9cNkw6NExsXCpjKkJVX1s3TVxtaFZhR1M1TjY8NUIiTD1TLVtZMC86akJkKkRfSUU0ck9ZQDZNZmg8OCZBN2I0JE9KcyViNTBKRWdHRVN1T0ctU1dxRkhbNydCay5SQnNmODRiXVozOi01bSJXc1Q/ZlNAY1Q8anVBJDo4MU9DVWBqRGByZGMjUTdZJ2swblBDKkJTQm10VyFVQVFaN0VlPUxdJkkjV3NZcjIsWUpoIU9ETjA8blFJO0s3Rl9nKz9Xa0BVRyNQPjs7NidES2hkKEg4PW9RKjFnIyg4azRtJy09UUFDRy4lPTp1P19vN0EtbFJgUF4pXUk7TUw1KFZAVkRVXUlJMlJwbSZHYydcV3Avbk9JN0hISkdyL1lmZm0tT3FoYzA8JXA3aC1YIlJ0IUEyUV1tXT47Ryg0ZiowXzU5V0V1V0syZzxJcGlVJUNMYEgwbVpQZHNqZHQ7bVpDXyU5QFBTZTFCRT40JDI4KVBSZWtScCVNLC41YF1PTkpxPzUpRWRgZi5rM2NOVlNUc0pzO1dsPT9mRF9YbmE6PFk/OGZWQDRsPE8/cC4vbkcrISUyJmU3YkZZO0QxKTg7RSQ3WXU3c1BPdTdGYFBbJz5lOXAhKzxDIjpHMj1SW2lCTGM/PSQncSUjNEwnOjxIUzElYy0yLyZqJXJDYCUzbCpMI1psYl8yJWw4NWhJfj5lbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA5CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAowMDAwMDAwMTAyIDAwMDAwIG4gCjAwMDAwMDAyMDkgMDAwMDAgbiAKMDAwMDAwMDMyMSAwMDAwMCBuIAowMDAwMDAwNTE0IDAwMDAwIG4gCjAwMDAwMDA1ODIgMDAwMDAgbiAKMDAwMDAwMDg2MiAwMDAwMCBuIAowMDAwMDAwOTIxIDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPGQ5NGFhNmVkNGI5ZTQxNzRkMWFmYWFhMTJkMTcxMGNjPjxkOTRhYTZlZDRiOWU0MTc0ZDFhZmFhYTEyZDE3MTBjYz5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChvcGVuc291cmNlKQoKL0luZm8gNiAwIFIKL1Jvb3QgNSAwIFIKL1NpemUgOQo+PgpzdGFydHhyZWYKMjk1OQolJUVPRgo=",
    "Permohonan_Data_Internal_Kemenkeu.pdf": "JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOCAwIFIgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXSAvUGFyZW50IDcgMCBSIC9SZXNvdXJjZXMgPDwKL0ZvbnQgMSAwIFIgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4gL1JvdGF0ZSAwIC9UcmFucyA8PAoKPj4gCiAgL1R5cGUgL1BhZ2UKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL1BhZ2VNb2RlIC9Vc2VOb25lIC9QYWdlcyA3IDAgUiAvVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKNiAwIG9iago8PAovQXV0aG9yIChcKGFub255bW91c1wpKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYxMDExMjEzMDUzKzA3JzAwJykgL0NyZWF0b3IgKFwodW5zcGVjaWZpZWRcKSkgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYxMDExMjEzMDUzKzA3JzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKFwodW5zcGVjaWZpZWRcKSkgL1RpdGxlIChcKGFub255bW91c1wpKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA0IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNzA2Cj4+CnN0cmVhbQpHYXRtOz5CQUxaJjpXZURtKmNqKyQnJDw9bCdsYTU+JS5RXzMnQXBjYVhFZzYhaywnXTRrIm4xPGpIXWZfPSFddCtVUVNDRHI5dHRbM2hSLExUKDZyKHVRYG1sV1hGRDZNKEE5V0w0O2xebE5lK0hfZmRcLjYqJzdiWGczXWotZy9RYnRwV3RSPW1RLiJrZ0pCTUZhS11bRFldKzpvUT1KO0lXZHRsKyRMRj4hWUNCbiw2dF1MTFk2MEpjRlkmNU48c1trNzlNOEU8LCVgQksjTiJBKydMZmNPYk1YXzIxI0ZwRCNvajUqQkA5aiwjIjhGTW9qaWlfWlw9LSpEQFBxTmRqQ2RRLFMiL18/ZylNLUIkUTF1NUQiY3BVOksrLHJXUExoPD1zXzQ8ZTJxNFRgdVxUZDM/bi8nbCksTlxhRykjKFBPKkE3SjRkXlhYNW51VEk3cnIvImo8LSpqbz5OdCVqX1ldLDEzLyJnYWhUcnBbVkNKPVZDcTpIWmBuay81LDs4VTEkR0ddQCRaSjMlVlxvR1wmKSFpWkIublc9cDUuWEloVjFFWnJHL0chQk5CaEVpOFMqa0cxWTJKOS06X05iSmtWL2olRXM2K29MK2dQW2sxPFEiZidqaWpCZEdKK1xGYD51QFokVy9CLCoqOWBsPFs9TWBiV249PyRSVjZmQVBHJkYoWXRbYHRnTDxlZDklPipLOlhfO0pAKlopPGg0dD9NJWNNW0gmN1FhOVBqJ3RFQmhRTGpKanAyWTMoQTZZOk1iS3NOLXVeQ1NfQV9TNHI9aT9bVForaCVfVyJqTGFEQEVnRUchVWMoPCpDIUghZTAnPCNmYkNnM10yNDlMR0wkYEJoLixiSFciI1o+NEleQSRnTl5WPjleTD4oOi4tZSpodSI+IVpwMkhSLTAsLTs1JyplayYxSTdRYSwhUkk+VD5mMCwxJyJSNFxnNmQ6OWU4XENVL0FaJy5HZylAJzA+Ikc0Uy1yXzFQWVZDOHBEVTBzIlxcaUpbNSVQUlg8V2pJWFBmJFAwTWAoOkctO0pOU2VeQEEtKlk2TjRBbjlUMSReZXQyUmpSZjxmdSRVUXRMLVlGMTtnLSw0YSMlXC8vbV1yc1BOS1I2RlduaytwX1xca0xIcE4qKm5XOzQ/cEBSNlhMSUVOU2o6OzBzRWI9NkE2T289R1llKFo4azklVC50N2BqV0NKVWhjKS9ATE4vbmh0JVIoMjRQMmtAOHFdM1hebidNVmdzZmlFNiVPaGg3ZU9jQUU6PCc3a1xtSm4tVGluTVE6XSlkRGRDKzZlTFVWJVolXjpGRCU2W2FLSlw8RnVWMkolYGZHSCUpRURVP1xkT25pZldILU9wZyskQ2tNRXVWWUxOI1NSPU9KbTxPR15bLUVEc09eSjI4bUBFZTVnSGoiPlhfSWleOWZMLiUwUkBDJ2giKWpqIUlsVCJoVzVLP15wVTIwOlRebWNJYUUwOGZqR0FsblNeQ09uSDxcVyNBWTwkKkVQMVM8O0lzaTVfQUUrPC8xS0Mmci5QTkheYSVxVUgjQSY3aWFOTEQrNmBuOlZfYi1tZyxddUxgXUxSa11aJVomVktWaitidFVraDUociVuPDYycyFCaSlnNzwma1duVS1nX3JHZWM+bSROYytPOXJRM1lxMUskUjpHLWFMMExvTWIpdFdKZEMnLkxVVSZOIlhtZyhbT0sxImAxb1lZM1s2Vkc8SFMhQSI7NjZwbjpoJVRMLmk3c0kmOFRyJk8lVF1TVlAxaTdBNkZJQERrJVdPMSNZYGRbX2VzXEpoZHVXaWBIbj5XSFJAI0FtX0ZWY2ExWkZgVl4nREhtYUM1bS5ZI0grWUAtUGRVLSxJcVpJK2BWTmlRZ3I1bmAnKzhWYGo1X2NGQFppRSEmTDA6aD1WRSNoLWJDWzRgV09aUzxwKipYKDAlN0pDSmkiLVZPWlk2Ym5RVmEqNCIiR2Q4ITs6MVk/I2ZrZklNMkw9Z1hcNFMuQ2pDZm51XFJyWFthISxtNyw+WD5WcEJbJWpYM246SlJqQnQ4TG9ZbF83cm5LbDQ0WGpqZCI2bVolWFNXZURTYEhyclc/UytMbSRSZ1I9Zm4xXVhZZExNSU0qOHBYRHFYXDU8NSM0TylIIVM+T14tI1tkP2JZS3EwYnBzayxGcmRRI3RpTkxsMj9FMDpSaVJNWl8zXENEbmY4MiFmbzIlMlRjKFcvTVM2Mk1iOURqbkIvNTBQYV9cS2oqOmBkLys+JjllX2h+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDkKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMDIgMDAwMDAgbiAKMDAwMDAwMDIwOSAwMDAwMCBuIAowMDAwMDAwMzIxIDAwMDAwIG4gCjAwMDAwMDA1MTQgMDAwMDAgbiAKMDAwMDAwMDU4MiAwMDAwMCBuIAowMDAwMDAwODYyIDAwMDAwIG4gCjAwMDAwMDA5MjEgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8ZDZjNmI2M2FlNjUwMGU2YjcyNzczYzJkNTRlYTkxNTY+PGQ2YzZiNjNhZTY1MDBlNmI3Mjc3M2MyZDU0ZWE5MTU2Pl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKG9wZW5zb3VyY2UpCgovSW5mbyA2IDAgUgovUm9vdCA1IDAgUgovU2l6ZSA5Cj4+CnN0YXJ0eHJlZgoyNzE4CiUlRU9GCg==",
    "Permohonan_Data_Eksternal_Kemenkeu.pdf": "JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOCAwIFIgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXSAvUGFyZW50IDcgMCBSIC9SZXNvdXJjZXMgPDwKL0ZvbnQgMSAwIFIgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4gL1JvdGF0ZSAwIC9UcmFucyA8PAoKPj4gCiAgL1R5cGUgL1BhZ2UKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL1BhZ2VNb2RlIC9Vc2VOb25lIC9QYWdlcyA3IDAgUiAvVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKNiAwIG9iago8PAovQXV0aG9yIChcKGFub255bW91c1wpKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYxMDExMjEzMDUzKzA3JzAwJykgL0NyZWF0b3IgKFwodW5zcGVjaWZpZWRcKSkgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYxMDExMjEzMDUzKzA3JzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKFwodW5zcGVjaWZpZWRcKSkgL1RpdGxlIChcKGFub255bW91c1wpKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyA0IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNzE5Cj4+CnN0cmVhbQpHYXRtOz1gYDpYJ1JuQjMzKTpSSyQnK2JWRGJiOWNpZypKWVZEIkxeLXBdIzZENCxeXFNjOE01LGhqak5dRCMmKyklWyRFa1BOUEIlOS5eaG8pMTlGXDtvUDVaTmNqLm5Jb1Q1QFJCdHJLKSI/V0wiPlpLRmA3YG8ya3MnbypTMywpOl5tLilNUSg8TUQqYkdAXmwsU2VoMDtSPm4rR2JMTDpDNDcvLVJdNG5FNSQiVUk/a0Q/QFNBdDBWKHFQYyU5V29eUERSZmlYW18sZ2tmRlFqNkk4PGstXV89YkI3cUBKXzdQRD41MmZGTDE7MigxKWBEPUJVMidJJDpKQig7PVI/WCliKzdUa0QsMmdjYlI6dWM+SSNFS2UnXCwtUmI+ZVpRJnEiKyRnX3BJOWIoVWs5cFYyMyo9RSYwMGU/PFcpW2lgOFpcckc/cDFyW1giMSY0L1U5NlRnKUAqTmUxY2NHJFU3KmdNbShUNC8zbSMvZlNAUignW1NxUy4iMkYjRVxgVWRxOnEkdFtqW1hKMnVbOSFrbFVwYF50WUZgcyciXEtNVWRnOkU6RmxzXUJhVVlpb1lqOVVEWzFGTWs7RmRZOCxhY1lCRiFJO1ZIQGxgaGs0a1ZCODcoJUBVcURNP0RDLTI5dUlxWlY8cnRxWjleYi9zWUJaUmNSW1k1WkFQcUppUEQ8YFthQiNCO0hpYkJfSy9QaT4wbFMpSEhESHFYJkEtREgjT1tvMSltY2hvRT0uZ0xIMkFaImlSOz4jRDJtVDdedVNwaixaX0xANmg8WGhtI1s8KmY5Yjw7P1ZKNV1AYidCVzVZNy4qMmIrbnFCMXNRWS0mN3JZTCclb3RIUlIyOT9vZF5iQTo9LClBbUpQWyE1Xl4+ZiMkRDlScXBjc0NgbjV0SG5NSyZwZGJyYUApbEIiXzRBN2Iwayc8al5kJTw/XVU4Ok07bVooQVhKT20kKmhPaT9lQT5yblpqZSxMXGA7UFFebyxOQls+Rlk2YCgqWT1KXzlbTl81LHBmcy8uTShLbnFlWERgNGhSLy5RVkpzalpeTEZYRihpWGFsOT1TUltCQj5kPDNpMGtVMnR1XUFwRFpibSwsQ1VRKSEpX1ZicitIMWBuKDtsbUlNJHFxUD9aOEYsRGlWayNlSGdKZDtTRlJkTEtuQEtRPj5JImBvN2U7OC5YP2EiIj9EK0lZayRQWDs9Tk0lRispLXJGLzdDVGNfSzMwKiNCcHRyKFBiWlFgTW5tO0pSR20icysyLzNcPV0sRW0pVHUzaEFcX2kvKW1sI15WSk1CYzltK0lVIzNGQzhyVF1AT0ZiJyRjO0JlZSthZHVVZG4pLFJcKHJJTTsqayVHZkUqJkFAWC1iPE4kaEI4QThhQm9DQm4+KXIqJGI5LjRFbTNqZVZsbCFqYkQ/RzhUMXEyWyVVXyQ/bG1vbydgMW5IRSVVLDJBJDxpUyVmSSkqKVt0IUZpY0BFVWAhRDg0NGshOmw9JFJGb1RTPnVnPyxdKjpMUCFDbExWSmY8IWtgXzIiNz9jLiFQJ0ZCKjktWWxtcWpiJTQyYXIsayVUa0xKOk9EYSVcMGVKIy9kKXExbmVKWVlnJ25NSE0hVFoxTFwsKCltWDw+XDpXJFg3RU9FJmYwZXMrNT1eJD1WIk4vTzJiWVMxKEthYkM1cXNvWTU9ZV0mclVlZjJQcyJTPVooMF5YZUtzUjM/XWc2PkYpPFNvOGRmOCs/KEVhPWlcSypwJ2RDNWdCUWRrTTQ1YWM5bmZrYzY/YjY/OkY9Jj5uRzdbYlZGVSkxJyppU1hlViJaLlhDTDE6NTNILk9ZQmIwIzRyZUlqbSY7SC4wVDA8RVUiTloyJFBWQiY/YylrK2opLlk9OjBtXnNLKW1FOihaKl1FVWo+PD9ccklpbGxPJyNXV04jJ2k/Z0ZvKC1vRmEsVnFSTyNzIjVcXyVlXCVeTi5kLEZpOGw1UmIyZGhLRE9rayRhbz8iWStTU1hgPlpeNHFncWdwLj8nMyFRZHExRkMpLVhSIltCKWRWYF8zcVI+Y1kzIUEkWUdjOVM+UTcsUlVacShsXzhoNG0nUlpGKWM5bk9rZHJnMG1KMmc/MW9aQjFjb2YpKCc8OzxqKENDcFFZOjYhIWxlc1kuLmlxZ1M2WiNvKTEwTF1zOGonWlBTbjVuKF4xO15ob0JZcDxmNTY1T2tbYD1xKUF0LmdSOycpYj5dX2EmUUFsOmhOUWMoIykjSD9OVlwrZzRTXl1ASlhsYEM0WmxRW08oQ0MxJ1Umfj5lbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA5CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAowMDAwMDAwMTAyIDAwMDAwIG4gCjAwMDAwMDAyMDkgMDAwMDAgbiAKMDAwMDAwMDMyMSAwMDAwMCBuIAowMDAwMDAwNTE0IDAwMDAwIG4gCjAwMDAwMDA1ODIgMDAwMDAgbiAKMDAwMDAwMDg2MiAwMDAwMCBuIAowMDAwMDAwOTIxIDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPDVmMWIyM2Y3ZGFjZjk3ODNlMTllOTEzYWVjNzkyNjQ1Pjw1ZjFiMjNmN2RhY2Y5NzgzZTE5ZTkxM2FlYzc5MjY0NT5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChvcGVuc291cmNlKQoKL0luZm8gNiAwIFIKL1Jvb3QgNSAwIFIKL1NpemUgOQo+PgpzdGFydHhyZWYKMjczMQolJUVPRgo="
  }
};
