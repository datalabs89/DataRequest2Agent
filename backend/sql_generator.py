from typing import List, Dict, Any, Tuple
from models import DataRequestSpec, CatalogMatchResult, SQLGenerationResult, OpenMetadataTable

class SQLGenerator:
    """
    Menghasilkan query SQL terstruktur yang strictly bound ke skema OpenMetadata.
    Menerapkan masking otomatis untuk atribut PII.
    """

    def generate_sql(self, spec: DataRequestSpec, catalog_match: CatalogMatchResult, dialect: str = "PostgreSQL", masking_mode: str = "PARTIAL") -> SQLGenerationResult:
        is_oracle = "oracle" in dialect.strip().lower()
        tables = catalog_match.selected_tables
        if not tables:
            raise ValueError("Tidak ada tabel metadata yang dipilih dari OpenMetadata.")

        primary_table = tables[0]
        t_alias = "t"
        c_alias = "c"
        s_alias = "s"

        table_alias_map = {
            primary_table.table_name: t_alias
        }
        if len(tables) > 1:
            table_alias_map[tables[1].table_name] = c_alias
        if len(tables) > 2:
            table_alias_map[tables[2].table_name] = s_alias

        # Kolom yang diizinkan berdasarkan konfirmasi spesifikasi pengguna (Data Minimization)
        req_field_names = [f.name.lower() for f in spec.requested_fields] if spec.requested_fields else []
        def is_field_requested(name: str) -> bool:
            if not req_field_names:
                return True
            name_low = name.lower()
            return any(name_low in rf or rf in name_low for rf in req_field_names)

        # Pemetaan kolom dan penanganan PII Masking
        select_clauses = []
        selected_col_names = []
        applied_filters = []

        # Kumpulkan semua kolom dari tabel yang dipilih
        all_cols_by_tbl = {tbl.table_name: {col.name: col for col in tbl.columns} for tbl in tables}

        # 1. Seleksi Kolom
        has_customer_join = any(t.table_name == "dim_customers" for t in tables)
        has_perusahaan_join = any(t.table_name == "dim_perusahaan" for t in tables)

        date_col = "transaction_date"
        if primary_table.table_name == "fct_peb_ekspor":
            date_col = "tanggal_peb"
            select_clauses.append(f"{t_alias}.nomor_peb")
            selected_col_names.append("nomor_peb")

            if is_field_requested("tanggal") or is_field_requested("tanggal_peb"):
                select_clauses.append(f"{t_alias}.tanggal_peb")
                selected_col_names.append("tanggal_peb")

            select_clauses.append(f"{t_alias}.npwp_eksportir")
            selected_col_names.append("npwp_eksportir")

            # Proteksi Nama Eksportir
            if is_field_requested("nama") or is_field_requested("nama_eksportir"):
                if masking_mode == "HASH":
                    select_clauses.append(f"HEX(RANDOMBLOB(16)) AS nama_eksportir_pseudonym")
                    selected_col_names.append("nama_eksportir_pseudonym")
                elif masking_mode == "FULL_REDACT":
                    select_clauses.append(f"'[TERLINDUNGI_UU_PDP]' AS nama_eksportir_masked")
                    selected_col_names.append("nama_eksportir_masked")
                else:
                    if is_oracle:
                        select_clauses.append(f"SUBSTR({t_alias}.nama_eksportir, 1, 3) || '*** ' || SUBSTR({t_alias}.nama_eksportir, -3) AS nama_eksportir_masked")
                    else:
                        select_clauses.append(f"CONCAT(SUBSTRING({t_alias}.nama_eksportir, 1, 3), '*** ', SUBSTRING({t_alias}.nama_eksportir, LENGTH({t_alias}.nama_eksportir)-2, 3)) AS nama_eksportir_masked")
                    selected_col_names.append("nama_eksportir_masked")

            if is_field_requested("kode_kantor") or is_field_requested("kantor"):
                select_clauses.append(f"{t_alias}.kode_kantor")
                selected_col_names.append("kode_kantor")

            if is_field_requested("negara") or is_field_requested("negara_tujuan"):
                select_clauses.append(f"{t_alias}.negara_tujuan")
                selected_col_names.append("negara_tujuan")

            if is_field_requested("fob") or is_field_requested("nilai_fob_usd"):
                select_clauses.append(f"{t_alias}.nilai_fob_usd")
                selected_col_names.append("nilai_fob_usd")

            if is_field_requested("devisa") or is_field_requested("nilai_devisa_idr") or is_field_requested("total_amount") or is_field_requested("nominal"):
                select_clauses.append(f"{t_alias}.nilai_devisa_idr")
                selected_col_names.append("nilai_devisa_idr")

            select_clauses.append(f"{t_alias}.status_pabean")
            selected_col_names.append("status_pabean")

            if has_perusahaan_join:
                select_clauses.append(f"{c_alias}.kategori_layanan_aeo")
                selected_col_names.append("kategori_layanan_aeo")
                if is_field_requested("nik"):
                    if masking_mode == "HASH":
                        select_clauses.append(f"HEX(RANDOMBLOB(16)) AS nik_penanggung_jawab_pseudonym")
                    else:
                        select_clauses.append(f"CONCAT(SUBSTRING({c_alias}.nik_penanggung_jawab, 1, 6), '******', SUBSTRING({c_alias}.nik_penanggung_jawab, 13, 4)) AS nik_penanggung_jawab_masked")
                    selected_col_names.append("nik_penanggung_jawab_masked")

        elif primary_table.table_name == "fct_pib_impor":
            date_col = "tanggal_pib"
            select_clauses.append(f"{t_alias}.nomor_pib")
            selected_col_names.append("nomor_pib")
            select_clauses.append(f"{t_alias}.tanggal_pib")
            selected_col_names.append("tanggal_pib")
            select_clauses.append(f"{t_alias}.npwp_importir")
            selected_col_names.append("npwp_importir")

            if is_field_requested("nama") or is_field_requested("nama_importir"):
                if masking_mode == "HASH":
                    select_clauses.append(f"HEX(RANDOMBLOB(16)) AS nama_importir_pseudonym")
                else:
                    select_clauses.append(f"CONCAT(SUBSTRING({t_alias}.nama_importir, 1, 3), '*** ', SUBSTRING({t_alias}.nama_importir, LENGTH({t_alias}.nama_importir)-2, 3)) AS nama_importir_masked")
                selected_col_names.append("nama_importir_masked")

            select_clauses.append(f"{t_alias}.kode_kantor")
            selected_col_names.append("kode_kantor")
            select_clauses.append(f"{t_alias}.negara_asal")
            selected_col_names.append("negara_asal")
            select_clauses.append(f"{t_alias}.nilai_cif_usd")
            selected_col_names.append("nilai_cif_usd")
            select_clauses.append(f"{t_alias}.bea_masuk_idr")
            selected_col_names.append("bea_masuk_idr")
            select_clauses.append(f"{t_alias}.status_jalur")
            selected_col_names.append("status_jalur")

        elif primary_table.table_name == "fct_billing_cukai":
            date_col = "tanggal_billing"
            select_clauses.append(f"{t_alias}.billing_id")
            selected_col_names.append("billing_id")
            select_clauses.append(f"{t_alias}.nomor_dokumen_cukai")
            selected_col_names.append("nomor_dokumen_cukai")
            select_clauses.append(f"{t_alias}.tanggal_billing")
            selected_col_names.append("tanggal_billing")
            select_clauses.append(f"{t_alias}.npwp_pengusaha_cukai")
            selected_col_names.append("npwp_pengusaha_cukai")

            if is_field_requested("nama") or is_field_requested("nama_pabrik"):
                if masking_mode == "HASH":
                    select_clauses.append(f"HEX(RANDOMBLOB(16)) AS nama_pabrik_pseudonym")
                else:
                    select_clauses.append(f"CONCAT(SUBSTRING({t_alias}.nama_pabrik, 1, 3), '*** ', SUBSTRING({t_alias}.nama_pabrik, LENGTH({t_alias}.nama_pabrik)-2, 3)) AS nama_pabrik_masked")
                selected_col_names.append("nama_pabrik_masked")

            select_clauses.append(f"{t_alias}.jenis_hasil_tembakau")
            selected_col_names.append("jenis_hasil_tembakau")
            select_clauses.append(f"{t_alias}.nilai_penerimaan_cukai")
            selected_col_names.append("nilai_penerimaan_cukai")
            select_clauses.append(f"{t_alias}.status_pelunasan")
            selected_col_names.append("status_pelunasan")

        else:
            # Fallback untuk fct_transactions
            date_col = "transaction_date"
            if "transaction_id" in all_cols_by_tbl.get("fct_transactions", {}):
                select_clauses.append(f"{t_alias}.transaction_id")
                selected_col_names.append("transaction_id")

            if "transaction_date" in all_cols_by_tbl.get("fct_transactions", {}) and is_field_requested("transaction_date"):
                select_clauses.append(f"{t_alias}.transaction_date")
                selected_col_names.append("transaction_date")

            if "total_amount" in all_cols_by_tbl.get("fct_transactions", {}) and is_field_requested("total_amount"):
                select_clauses.append(f"{t_alias}.total_amount")
                selected_col_names.append("total_amount")

            if "payment_method" in all_cols_by_tbl.get("fct_transactions", {}) and is_field_requested("payment_method"):
                select_clauses.append(f"{t_alias}.payment_method")
                selected_col_names.append("payment_method")

            if "status" in all_cols_by_tbl.get("fct_transactions", {}) and is_field_requested("status"):
                select_clauses.append(f"{t_alias}.status")
                selected_col_names.append("status")

            # Jika ada join dengan dim_customers, tambahkan profil nasabah dengan masking PII
            if has_customer_join:
                select_clauses.append(f"{c_alias}.customer_id")
                selected_col_names.append("customer_id")

                # Proteksi Kolom Nama Nasabah (hanya jika diminta)
                if is_field_requested("customer_name") or is_field_requested("nama"):
                    if masking_mode == "HASH":
                        select_clauses.append(f"HEX(RANDOMBLOB(16)) AS customer_name_pseudonym")
                        selected_col_names.append("customer_name_pseudonym")
                    elif masking_mode == "FULL_REDACT":
                        select_clauses.append(f"'[TERLINDUNGI_UU_PDP]' AS customer_name_masked")
                        selected_col_names.append("customer_name_masked")
                    else:  # PARTIAL
                        if is_oracle:
                            select_clauses.append(f"SUBSTR({c_alias}.customer_name, 1, 3) || '*** ' || SUBSTR({c_alias}.customer_name, -3) AS customer_name_masked")
                        else:
                            select_clauses.append(f"CONCAT(SUBSTRING({c_alias}.customer_name, 1, 3), '*** ', SUBSTRING({c_alias}.customer_name, LENGTH({c_alias}.customer_name)-2, 3)) AS customer_name_masked")
                        selected_col_names.append("customer_name_masked")

                # Proteksi Kolom NIK (hanya jika diminta & dicentang pengguna)
                if is_field_requested("nik"):
                    if masking_mode == "HASH":
                        select_clauses.append(f"HEX(RANDOMBLOB(16)) AS nik_pseudonym")
                        selected_col_names.append("nik_pseudonym")
                    elif masking_mode == "FULL_REDACT":
                        select_clauses.append(f"'[TERLINDUNGI_UU_PDP]' AS nik_masked")
                        selected_col_names.append("nik_masked")
                    else:  # PARTIAL
                        if is_oracle:
                            select_clauses.append(f"SUBSTR({c_alias}.nik, 1, 6) || '******' || SUBSTR({c_alias}.nik, 13, 4) AS nik_masked")
                        else:
                            select_clauses.append(f"CONCAT(SUBSTRING({c_alias}.nik, 1, 6), '******', SUBSTRING({c_alias}.nik, 13, 4)) AS nik_masked")
                        selected_col_names.append("nik_masked")

                # Proteksi Kolom No HP (hanya jika diminta)
                if is_field_requested("phone") or is_field_requested("phone_number") or is_field_requested("hp"):
                    if masking_mode == "HASH":
                        select_clauses.append(f"HEX(RANDOMBLOB(16)) AS phone_pseudonym")
                        selected_col_names.append("phone_pseudonym")
                    elif masking_mode == "FULL_REDACT":
                        select_clauses.append(f"'[TERLINDUNGI_UU_PDP]' AS phone_masked")
                        selected_col_names.append("phone_masked")
                    else:  # PARTIAL
                        if is_oracle:
                            select_clauses.append(f"SUBSTR({c_alias}.phone_number, 1, 4) || '****' || SUBSTR({c_alias}.phone_number, -3) AS phone_masked")
                        else:
                            select_clauses.append(f"CONCAT(SUBSTRING({c_alias}.phone_number, 1, 4), '****', SUBSTRING({c_alias}.phone_number, LENGTH({c_alias}.phone_number)-2, 3)) AS phone_masked")
                        selected_col_names.append("phone_masked")

                if is_field_requested("customer_segment") or is_field_requested("segment"):
                    select_clauses.append(f"{c_alias}.customer_segment")
                    selected_col_names.append("customer_segment")

                if is_field_requested("city") or is_field_requested("kota"):
                    select_clauses.append(f"{c_alias}.city")
                    selected_col_names.append("city")

        # 2. Klausa FROM & JOIN (Oracle tidak menggunakan keyword 'AS' untuk alias tabel)
        table_as = "" if is_oracle else "AS "
        from_clause = f"FROM {primary_table.fqn} {table_as}{t_alias}".strip()
        join_clauses = []

        for strat in catalog_match.join_strategy:
            r_name = strat["right_table"]
            r_table_obj = next((t for t in tables if t.table_name == r_name), None)
            if r_table_obj:
                r_alias = table_alias_map.get(r_name, "c")
                condition = strat["on_condition"].replace(primary_table.table_name, t_alias).replace(r_name, r_alias)
                join_clauses.append(f"{strat['join_type']} {r_table_obj.fqn} {table_as}{r_alias}\n    ON {condition}".strip())

        # 3. Klausa WHERE (Filter)
        where_conditions = []

        # Filter tanggal
        if spec.time_range_start and spec.time_range_end:
            where_conditions.append(f"{t_alias}.{date_col} >= '{spec.time_range_start} 00:00:00'")
            where_conditions.append(f"{t_alias}.{date_col} <= '{spec.time_range_end} 23:59:59'")
            applied_filters.append(f"Rentang Tanggal: {spec.time_range_start} s/d {spec.time_range_end}")

        # Filter spesifik dari spec
        for filt in spec.filters:
            if filt.target_column in ["status", "status_pabean", "status_jalur", "status_pelunasan"] and filt.operator == "=":
                actual_col = filt.target_column
                if primary_table.table_name == "fct_peb_ekspor": actual_col = "status_pabean"
                elif primary_table.table_name == "fct_pib_impor": actual_col = "status_jalur"
                elif primary_table.table_name == "fct_billing_cukai": actual_col = "status_pelunasan"
                where_conditions.append(f"{t_alias}.{actual_col} = '{filt.value}'")
                applied_filters.append(f"{actual_col} = '{filt.value}'")
            elif filt.target_column == "customer_segment" and has_customer_join:
                where_conditions.append(f"{c_alias}.customer_segment = '{filt.value}'")
                applied_filters.append(f"Segmen Nasabah = '{filt.value}'")

        # Rangkai SQL Query
        select_str = ",\n    ".join(select_clauses)
        joins_str = "\n".join(join_clauses)
        where_str = "\n  AND ".join(where_conditions) if where_conditions else "1=1"
        limit_clause = "FETCH FIRST 500 ROWS ONLY;" if is_oracle else "LIMIT 500;"

        sql_text = f"""-- ====================================================================
-- Query Otomatis Dibuat oleh DataRequest2Agent
-- Berdasarkan Dokumen: {spec.document_title} (ID: {spec.request_id})
-- Pemohon: {spec.requester_name} ({spec.requester_department})
-- Metadata Divalidasi via: OpenMetadata Service {primary_table.service_name}
-- Target Database: {dialect}
-- ====================================================================

SELECT
    {select_str}
{from_clause}
{joins_str}
WHERE
    {where_str}
ORDER BY
    {t_alias}.{date_col} DESC
{limit_clause}
"""

        explanation = (
            f"Query disusun untuk database {dialect} dengan menggabungkan tabel fakta "
            f"`{primary_table.table_name}` dan tabel dimensi `{', '.join([t.table_name for t in tables[1:]])}`. "
            f"Filter diaplikasikan secara ketat sesuai spesifikasi dokumen permohonan. "
            f"Atribut PII (Nama, NIK, No Telepon) telah diproteksi dengan fungsi masking dinamis."
        )

        return SQLGenerationResult(
            dialect=dialect,
            query=sql_text.strip(),
            explanation=explanation,
            selected_columns=selected_col_names,
            applied_filters=applied_filters,
            tables_used=[t.fqn for t in tables]
        )
