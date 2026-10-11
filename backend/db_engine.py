import os
import sqlite3
import random
import datetime
from typing import List, Dict, Any, Tuple

class EnterpriseDatabaseEngine:
    """
    Database Engine DWH lokal (SQLite) dengan circuit breaker dan guard read-only.
    Menyediakan tabel fakta dan dimensi enterprise yang dapat di-query secara langsung.
    """

    def __init__(self, db_path: str = "outputs/dwh_enterprise.db"):
        self.db_path = db_path
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_database()

    def _init_database(self):
        """Membuat tabel dan mengisi data awal realistis jika database belum ada."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # 1. Tabel dim_customers
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS dim_customers (
            customer_id TEXT PRIMARY KEY,
            customer_name TEXT,
            email TEXT,
            phone_number TEXT,
            nik TEXT,
            customer_segment TEXT,
            city TEXT,
            province TEXT,
            registration_date DATE,
            is_active BOOLEAN
        );
        """)

        # 2. Tabel dim_stores
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS dim_stores (
            store_id TEXT PRIMARY KEY,
            store_name TEXT,
            region TEXT,
            store_type TEXT,
            manager_name TEXT
        );
        """)

        # 3. Tabel fct_transactions (Fakta Ekspor & Transaksi Terintegrasi)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS fct_transactions (
            transaction_id TEXT PRIMARY KEY,
            nomor_aju TEXT,
            nomor_daftar TEXT,
            tanggal_daftar TEXT,
            kantor_ekspor TEXT,
            kantor_muat TEXT,
            customer_id TEXT,
            npwp_eksportir TEXT,
            nama_eksportir TEXT,
            alamat_eksportir TEXT,
            npwp_ppjk TEXT,
            nama_ppjk TEXT,
            nama_penerima TEXT,
            negara_penerima TEXT,
            nama_pembeli TEXT,
            negara_pembeli TEXT,
            negara_tujuan TEXT,
            seri_barang INTEGER,
            kode_hs TEXT,
            uraian_barang TEXT,
            jumlah_satuan NUMERIC,
            jenis_satuan TEXT,
            netto_barang NUMERIC,
            valuta TEXT,
            kurs NUMERIC,
            fob_barang NUMERIC,
            total_amount NUMERIC,
            tarif_bea_keluar NUMERIC,
            bea_keluar_barang NUMERIC,
            pph_ekspor_peb NUMERIC,
            jalur TEXT,
            store_id TEXT,
            transaction_date TEXT,
            channel TEXT,
            payment_method TEXT,
            status TEXT,
            status_pabean TEXT,
            created_at TEXT,
            FOREIGN KEY (customer_id) REFERENCES dim_customers(customer_id),
            FOREIGN KEY (store_id) REFERENCES dim_stores(store_id)
        );
        """)

        # 4. Tabel fct_shipments
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS fct_shipments (
            shipment_id TEXT PRIMARY KEY,
            transaction_id TEXT,
            courier_name TEXT,
            delivery_status TEXT,
            shipping_cost NUMERIC,
            origin_city TEXT,
            destination_city TEXT,
            dispatch_date TEXT,
            received_date TEXT,
            FOREIGN KEY (transaction_id) REFERENCES fct_transactions(transaction_id)
        );
        """)

        # 5. Tabel DJBC Master: dim_perusahaan (Eksportir, Importir, PPJK, Pengusaha Cukai)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS dim_perusahaan (
            npwp_perusahaan TEXT PRIMARY KEY,
            nama_perusahaan TEXT,
            alamat_domisili TEXT,
            nik_penanggung_jawab TEXT,
            email_korespondensi TEXT,
            nomor_telepon TEXT,
            status_registrasi TEXT,
            kategori_layanan_aeo TEXT,
            tanggal_terdaftar DATE
        );
        """)

        # 6. Tabel DJBC Fakta Ekspor: fct_peb_ekspor
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS fct_peb_ekspor (
            nomor_aju TEXT PRIMARY KEY,
            nomor_daftar TEXT,
            nomor_peb TEXT,
            tanggal_daftar TEXT,
            tanggal_peb TEXT,
            kantor_ekspor TEXT,
            kantor_muat TEXT,
            kode_kantor TEXT,
            npwp_eksportir TEXT,
            nama_eksportir TEXT,
            alamat_eksportir TEXT,
            npwp_ppjk TEXT,
            nama_ppjk TEXT,
            nama_penerima TEXT,
            negara_penerima TEXT,
            nama_pembeli TEXT,
            negara_pembeli TEXT,
            negara_tujuan TEXT,
            seri_barang INTEGER,
            kode_hs TEXT,
            uraian_barang TEXT,
            jumlah_satuan NUMERIC,
            jenis_satuan TEXT,
            netto_barang NUMERIC,
            valuta TEXT,
            kurs NUMERIC,
            fob_barang NUMERIC,
            nilai_fob_usd NUMERIC,
            nilai_devisa_idr NUMERIC,
            tarif_bea_keluar NUMERIC,
            bea_keluar_barang NUMERIC,
            pph_ekspor_peb NUMERIC,
            jalur TEXT,
            status_pabean TEXT,
            created_at TEXT,
            FOREIGN KEY (npwp_eksportir) REFERENCES dim_perusahaan(npwp_perusahaan)
        );
        """)

        # 6b. Tabel Dokumen Pelengkap Ekspor: dim_dokumen_pelengkap
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS dim_dokumen_pelengkap (
            nomor_aju TEXT,
            nomor_peb TEXT,
            tanggal_peb TEXT,
            nama_dokumen TEXT,
            nomor_dokumen TEXT,
            tanggal_dokumen TEXT,
            FOREIGN KEY (nomor_aju) REFERENCES fct_peb_ekspor(nomor_aju)
        );
        """)

        # 7. Tabel DJBC Fakta Impor: fct_pib_impor
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS fct_pib_impor (
            nomor_pib TEXT PRIMARY KEY,
            tanggal_pib TEXT,
            npwp_importir TEXT,
            nama_importir TEXT,
            kode_kantor TEXT,
            negara_asal TEXT,
            nilai_cif_usd NUMERIC,
            bea_masuk_idr NUMERIC,
            ppn_impor_idr NUMERIC,
            status_jalur TEXT,
            created_at TEXT,
            FOREIGN KEY (npwp_importir) REFERENCES dim_perusahaan(npwp_perusahaan)
        );
        """)

        # 8. Tabel DJBC Fakta Cukai: fct_billing_cukai
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS fct_billing_cukai (
            billing_id TEXT PRIMARY KEY,
            nomor_dokumen_cukai TEXT,
            tanggal_billing TEXT,
            npwp_pengusaha_cukai TEXT,
            nama_pabrik TEXT,
            jenis_hasil_tembakau TEXT,
            jumlah_tarif_spesifik NUMERIC,
            nilai_penerimaan_cukai NUMERIC,
            status_pelunasan TEXT,
            FOREIGN KEY (npwp_pengusaha_cukai) REFERENCES dim_perusahaan(npwp_perusahaan)
        );
        """)

        # 9. Tabel DJBC Fakta Manifest: fct_manifest_bc11
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS fct_manifest_bc11 (
            nomor_bc11 TEXT PRIMARY KEY,
            tanggal_bc11 TEXT,
            nomor_pos TEXT,
            nama_sarana_pengangkut TEXT,
            nama_nahkoda_pilot TEXT,
            pelabuhan_muat TEXT,
            pelabuhan_tujuan TEXT,
            jumlah_kemasan INTEGER,
            berat_kotor_kg NUMERIC,
            status_segel TEXT
        );
        """)

        # 10. Tabel Fakta Penerimaan/Keuangan: fct_credit_applications
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS fct_credit_applications (
            application_id TEXT PRIMARY KEY,
            customer_id TEXT,
            loan_amount NUMERIC,
            tenor_months INTEGER,
            approval_status TEXT,
            application_date TEXT,
            credit_score INTEGER,
            FOREIGN KEY (customer_id) REFERENCES dim_customers(customer_id)
        );
        """)

        cursor.execute("SELECT COUNT(*) FROM dim_customers")
        count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM dim_perusahaan")
        p_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM fct_manifest_bc11")
        m_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM fct_credit_applications")
        c_count = cursor.fetchone()[0]

        if count == 0:
            self._seed_mock_data(cursor)
        elif p_count == 0:
            self._seed_djbc_mock_data(cursor)

        if m_count == 0:
            self._seed_manifest_data(cursor)

        if c_count == 0:
            self._seed_credit_data(cursor)

        conn.commit()
        conn.close()

    def _seed_mock_data(self, cursor: sqlite3.Cursor):
        """Seed 60 nasabah, 10 cabang, dan 350 transaksi realistis Q3 2026."""
        cities = [
            ("Jakarta Selatan", "DKI Jakarta"),
            ("Surabaya", "Jawa Timur"),
            ("Bandung", "Jawa Barat"),
            ("Medan", "Sumatera Utara"),
            ("Semarang", "Jawa Tengah"),
            ("Denpasar", "Bali"),
            ("Tangerang", "Banten")
        ]
        names = [
            "Budi Santoso", "Dewi Lestari", "Agus Setiawan", "Siti Rahmawati",
            "Hendro Wijaya", "Rina Marlina", "Eko Prasetyo", "Indah Permata",
            "Bambang Haryanto", "Maya Anggraini", "Ferry Salim", "Nadia Vega",
            "Rian Ardianto", "Gita Gutawa", "Irfan Bachdim", "Dian Sastrowardoyo",
            "Reza Rahadian", "Maudy Ayunda", "Nicholas Saputra", "Chicco Jerikho"
        ]

        # Insert 60 Customers
        customer_ids = []
        for i in range(1, 61):
            c_id = f"CUST-2026-{1000 + i}"
            customer_ids.append(c_id)
            name = random.choice(names) + f" {chr(65 + (i % 26))}"
            city_info = random.choice(cities)
            seg = "PRIORITAS" if i <= 35 else ("CORPORATE" if i <= 45 else "REGULER")
            nik = f"317{random.randint(100, 999)}{random.randint(10, 28):02d}{random.randint(1, 12):02d}{random.randint(70, 99):02d}{1000 + i}"
            phone = f"0812{random.randint(1000, 9999)}{1000 + i}"
            email = f"user{i}@perusahaan.id"

            cursor.execute("""
            INSERT INTO dim_customers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (c_id, name, email, phone, nik, seg, city_info[0], city_info[1], "2024-01-15", 1))

        # Insert 8 Stores
        store_ids = []
        for i in range(1, 9):
            s_id = f"STORE-0{i}"
            store_ids.append(s_id)
            cursor.execute("""
            INSERT INTO dim_stores VALUES (?, ?, ?, ?, ?);
            """, (s_id, f"Cabang Utama {cities[i % len(cities)][0]}", cities[i % len(cities)][0], "Flagship", f"Manager {i}"))

        # Insert 250 Transactions across July - September 2026
        start_date = datetime.date(2026, 7, 1)
        end_date = datetime.date(2026, 9, 30)
        days_span = (end_date - start_date).days

        payment_methods = ["QRIS", "Credit Card", "Bank Transfer", "Virtual Account"]
        channels = ["Mobile App", "Online", "Flagship Store"]

        for i in range(1, 251):
            t_id = f"TRX-2026-Q3-{10000 + i}"
            c_id = random.choice(customer_ids)
            s_id = random.choice(store_ids)

            delta_days = random.randint(0, days_span)
            t_date = start_date + datetime.timedelta(days=delta_days)
            t_datetime_str = f"{t_date.strftime('%Y-%m-%d')} {random.randint(8, 21):02d}:{random.randint(0, 59):02d}:{random.randint(0, 59):02d}"

            amount = random.choice([3500000, 5200000, 9400000, 14500000, 22000000, 37500000, 55000000, 85000000])
            discount = round(amount * random.choice([0.0, 0.05, 0.1]), 2)
            tax = round(amount * 0.11, 2)
            status = "SUCCESS" if random.random() > 0.08 else "FAILED"

            cursor.execute("""
            INSERT INTO fct_transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (t_id, c_id, s_id, t_datetime_str, random.choice(channels), amount, discount, tax,
                  random.choice(payment_methods), status, t_datetime_str))

        self._seed_djbc_mock_data(cursor)

    def _seed_djbc_mock_data(self, cursor: sqlite3.Cursor):
        """Seed data mock DJBC realistis: Profil Perusahaan, Dokumen PEB Ekspor, PIB Impor, dan Billing Cukai."""
        companies = [
            ("0123456789012000", "PT Nusantara Exportindo Global", "Kawasan Industri MM2100, Cikarang", "3275012345670001", "customs@nusantara-export.co.id", "021-8901234", "AKTIF", "AEO", "2020-01-15"),
            ("0234567890123000", "PT Sumber Berkah Sejahtera Mandiri", "Jl. Margomulyo Indah No. 45, Surabaya", "3578023456780002", "logistik@sumberberkah.com", "031-7489123", "AKTIF", "MITA_PRIORITAS", "2019-05-20"),
            ("0345678901234000", "PT Indo Pasifik Perkasa Industri", "Kawasan Berikat Nusantara, Cakung, Jakarta", "3172034567890003", "exim@indopasifik.co.id", "021-4405678", "AKTIF", "AEO", "2018-11-10"),
            ("0456789012345000", "CV Lautan Mas Jaya Utama", "Pelabuhan Tanjung Emas, Semarang", "3374045678900004", "info@lautanmas.id", "024-3512345", "AKTIF", "REGULER", "2021-03-12"),
            ("0567890123456000", "PT Djarum Mahakarya Tbk", "Jl. Jend. A. Yani No. 28, Kudus", "3319056789010005", "tax_cukai@djarum-corp.com", "0291-431234", "AKTIF", "AEO", "2015-08-01"),
            ("0678901234567000", "PT Gudang Garam Sentosa Utama", "Jl. Semampir II/1, Kediri", "3571067890120006", "cukai@gudanggaram-sentosa.co.id", "0354-681234", "AKTIF", "AEO", "2016-04-18"),
            ("0789012345678000", "PT Asia Pulp & Logistics Terminal", "Jl. Hang Tuah, Belawan, Medan", "1271078901230007", "customs.medan@asiapulp.co.id", "061-6941234", "AKTIF", "MITA_PRIORITAS", "2017-09-25"),
            ("0890123456789000", "PT Astra Agro Lestari Perkasa", "Jl. Pulo Buaran Raya, Jakarta Timur", "3175089012340008", "exim@astra-agro.co.id", "021-4616555", "AKTIF", "AEO", "2017-01-10")
        ]
        for comp in companies:
            cursor.execute("INSERT OR REPLACE INTO dim_perusahaan VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", comp)

        start_date = datetime.date(2026, 7, 1)
        end_date = datetime.date(2026, 9, 30)
        days_span = (end_date - start_date).days
        kantor_list = ["040300", "070100", "060100", "010700", "050100"]
        negara_ekspor = ["US - Amerika Serikat", "CN - Tiongkok", "JP - Jepang", "SG - Singapura", "NL - Belanda", "IN - India"]
        negara_impor = ["CN - Tiongkok", "JP - Jepang", "DE - Jerman", "US - Amerika Serikat", "KR - Korea Selatan"]

        # Seed 60 PEB Ekspor
        for i in range(1, 61):
            nopen = f"0{10000 + i}"
            comp = random.choice(companies[:4] + [companies[7]])
            delta = random.randint(0, days_span)
            t_date = start_date + datetime.timedelta(days=delta)
            t_str = f"{t_date.strftime('%Y-%m-%d')} {random.randint(8, 17):02d}:{random.randint(0, 59):02d}:00"
            fob_usd = random.choice([25000, 48000, 85000, 140000, 290000, 520000, 950000])
            devisa_idr = round(fob_usd * 16200, 2)
            status = "NPE" if random.random() > 0.08 else "PERIKSA_FISIK"
            cursor.execute("INSERT OR REPLACE INTO fct_peb_ekspor VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                           (f"PEB-{t_date.strftime('%Y%m%d')}-{nopen}", t_str, comp[0], comp[1], comp[2],
                            random.choice(kantor_list), random.choice(negara_ekspor), fob_usd, devisa_idr, status, t_str))

        # Seed 50 PIB Impor
        for i in range(1, 51):
            nopen = f"0{20000 + i}"
            comp = random.choice(companies[:4] + [companies[6]])
            delta = random.randint(0, days_span)
            t_date = start_date + datetime.timedelta(days=delta)
            t_str = f"{t_date.strftime('%Y-%m-%d')} {random.randint(8, 17):02d}:{random.randint(0, 59):02d}:00"
            cif_usd = random.choice([18000, 35000, 72000, 115000, 240000, 480000])
            bm_idr = round(cif_usd * 16200 * random.choice([0.05, 0.075, 0.1, 0.15]), 2)
            ppn_idr = round((cif_usd * 16200 + bm_idr) * 0.11, 2)
            jalur = random.choice(["HIJAU", "HIJAU", "HIJAU", "KUNING", "MERAH", "MITA"])
            cursor.execute("INSERT OR REPLACE INTO fct_pib_impor VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                           (f"PIB-{t_date.strftime('%Y%m%d')}-{nopen}", t_str, comp[0], comp[1],
                            random.choice(kantor_list), random.choice(negara_impor), cif_usd, bm_idr, ppn_idr, jalur, t_str))

        # Seed 40 Billing Cukai
        for i in range(1, 41):
            bid = f"BILL-CK-{20260700 + i}"
            doc_cukai = f"CK1-{2026000 + i}"
            comp = random.choice([companies[4], companies[5]])
            delta = random.randint(0, days_span)
            t_date = start_date + datetime.timedelta(days=delta)
            t_str = f"{t_date.strftime('%Y-%m-%d')} {random.randint(9, 15):02d}:{random.randint(0, 59):02d}:00"
            penerimaan = random.choice([250000000, 480000000, 850000000, 1400000000, 3200000000])
            cursor.execute("INSERT OR REPLACE INTO fct_billing_cukai VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                           (bid, doc_cukai, t_str, comp[0], comp[1], random.choice(["SKT", "SKM", "SPM"]),
                            random.choice([665.0, 985.0, 1150.0]), penerimaan, "LUNAS"))

    def _seed_manifest_data(self, cursor: sqlite3.Cursor):
        """Seed 30 data manifest kedatangan kapal/pesawat (BC 1.1)."""
        vessels = ["MV Meratus Java", "MV Samudera Mas", "KM Tanto Express", "MV WAN HAI 315", "GA-872 Boeing 777"]
        captains = ["Capt. Herman Susilo", "Capt. Tan Wei Lun", "Capt. Agus Salim", "Capt. James Miller"]
        ports_load = ["SGSIN - Singapore", "MYPKG - Port Klang", "CNSHA - Shanghai", "JPTYO - Tokyo"]
        ports_dest = ["IDTPP - Tanjung Priok", "IDTPS - Tanjung Perak", "IDBLW - Belawan"]
        for i in range(1, 31):
            bc11 = f"BC11-2026-{1000 + i}"
            t_str = f"2026-08-{random.randint(1, 28):02d} {random.randint(6, 22):02d}:00:00"
            cursor.execute("INSERT OR REPLACE INTO fct_manifest_bc11 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                           (bc11, t_str, f"POS-{i:03d}", random.choice(vessels), random.choice(captains),
                            random.choice(ports_load), random.choice(ports_dest), random.randint(150, 2400),
                            round(random.uniform(5000, 180000), 2), random.choice(["AMAN", "DIPERIKSA"])))

    def _seed_credit_data(self, cursor: sqlite3.Cursor):
        """Seed 40 data target dan realisasi penerimaan negara / fasilitas anggaran."""
        cursor.execute("SELECT customer_id FROM dim_customers LIMIT 30")
        cust_rows = cursor.fetchall()
        cids = [r[0] for r in cust_rows] if cust_rows else [f"CUST-{i:03d}" for i in range(1, 31)]
        for i in range(1, 41):
            app_id = f"APP-PNBP-2026-{2000 + i}"
            cid = random.choice(cids)
            amount = random.choice([50000000.0, 120000000.0, 350000000.0, 750000000.0, 1500000000.0])
            tenor = random.choice([6, 12, 24, 36])
            status = random.choice(["APPROVED", "LUNAS", "IN_REVIEW"])
            t_str = f"2026-08-{random.randint(1, 28):02d} 10:00:00"
            score = random.randint(650, 850)
            cursor.execute("INSERT OR REPLACE INTO fct_credit_applications VALUES (?, ?, ?, ?, ?, ?, ?)",
                           (app_id, cid, amount, tenor, status, t_str, score))

    def execute_query(self, sql_query: str) -> Tuple[List[str], List[Dict[str, Any]]]:
        """
        Mengeksekusi query SQL dengan Circuit Breaker dan Read-Only Security Guard.
        """
        clean_sql = sql_query.strip()
        upper_sql = clean_sql.upper()

        # Circuit Breaker 1: Hanya perbolehkan perintah baca (SELECT / WITH)
        first_word = upper_sql.split()[0] if upper_sql.split() else ""
        if first_word not in ["SELECT", "WITH"]:
            raise PermissionError(f"Operasi SQL ditolak! Hanya perintah baca (SELECT) yang diperbolehkan. Dilarang: {first_word}")

        # Circuit Breaker 2: Blokir operasi DDL/DML berbahaya
        forbidden = ["DROP", "DELETE", "TRUNCATE", "UPDATE", "INSERT", "ALTER", "CREATE", "REPLACE"]
        for word in forbidden:
            if f" {word} " in f" {upper_sql} ":
                raise PermissionError(f"Operasi mencurigakan terdeteksi: '{word}' tidak diizinkan.")

        # Adaptasi FQN schema untuk SQLite (hilangkan prefix skema)
        adapted_sql = clean_sql
        prefixes_to_strip = [
            "dwh_ceisa.ekspor.", "dwh_ceisa.impor.", "dwh_ceisa.cukai.", "dwh_ceisa.manifest.", "dwh_ceisa.master.",
            "dwh_ceisa.fasilitas.", "dwh_ceisa.penerimaan.", "dwh_ceisa.keberatan.", "dwh_ceisa.",
            "dwh_production.sales.", "dwh_production.logistics.", "dwh_production.finance.",
            "dwh_production.fasilitas.", "dwh_production.penerimaan.", "dwh_production.keberatan.", "dwh_production.",
            "fasilitas.", "penerimaan.", "keberatan.", "sales.", "logistics.", "finance."
        ]
        for prefix in prefixes_to_strip:
            adapted_sql = adapted_sql.replace(prefix, "")

        # Normalisasi klausa Oracle FETCH FIRST n ROWS ONLY ke SQLite LIMIT n
        import re
        adapted_sql = re.sub(r"FETCH\s+FIRST\s+(\d+)\s+ROWS\s+ONLY;?", r"LIMIT \1;", adapted_sql, flags=re.IGNORECASE)

        # Koneksi SQLite dengan mode Read-Only URI
        conn = sqlite3.connect(f"file:{os.path.abspath(self.db_path)}?mode=ro", uri=True, timeout=30.0)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        try:
            cursor.execute(adapted_sql)
            rows = cursor.fetchall()
            col_names = [desc[0] for desc in cursor.description] if cursor.description else []
            dict_rows = [dict(row) for row in rows]
            return col_names, dict_rows
        finally:
            conn.close()

if __name__ == "__main__":
    engine = EnterpriseDatabaseEngine()
    cols, data = engine.execute_query("""
    SELECT t.transaction_id, t.transaction_date, t.total_amount, c.customer_name, c.customer_segment
    FROM fct_transactions t
    JOIN dim_customers c ON t.customer_id = c.customer_id
    WHERE t.status = 'SUCCESS' AND c.customer_segment = 'PRIORITAS'
    ORDER BY t.transaction_date DESC
    LIMIT 5;
    """)
    print("Columns:", cols)
    print("Row count:", len(data))
    print("First row:", data[0] if data else "None")
