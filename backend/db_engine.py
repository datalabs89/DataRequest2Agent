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

        # 3. Tabel fct_transactions
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS fct_transactions (
            transaction_id TEXT PRIMARY KEY,
            customer_id TEXT,
            store_id TEXT,
            transaction_date TEXT,
            channel TEXT,
            total_amount NUMERIC,
            discount_amount NUMERIC,
            tax_amount NUMERIC,
            payment_method TEXT,
            status TEXT,
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

        cursor.execute("SELECT COUNT(*) FROM dim_customers")
        count = cursor.fetchone()[0]

        if count == 0:
            self._seed_mock_data(cursor)

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

        # Adaptasi FQN schema untuk SQLite (hilangkan prefix skema seperti dwh_production.sales.)
        adapted_sql = clean_sql
        for prefix in ["dwh_production.sales.", "dwh_production.logistics.", "dwh_production.finance.", "dwh_production."]:
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
